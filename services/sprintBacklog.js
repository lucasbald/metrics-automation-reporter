const { GoogleSpreadsheet } = require('google-spreadsheet');
const { executeSearch, handleResponse } = require('../handlers/jira');
const { log } = require('../utils/logger');
const { getSsmParameters } = require('../utils/ssm');
const { googleSheet: keysToSearch } = require('../utils/credentials');

const STORY_POINTS_ERROR_MSG = 'There is no story points set in any of the Stories';

// eslint-disable-next-line max-len
const getRework = (timeSpentBugs, totalSpentSprint) => ((timeSpentBugs / totalSpentSprint) * 100).toFixed(2);

// eslint-disable-next-line max-len
const getWorkRatio = ({ totalSpentHoursBugs, aggregateTimeSpent, aggregateTimeOriginalEstimate }) => (aggregateTimeSpent - totalSpentHoursBugs) - aggregateTimeOriginalEstimate;

const getSprintBacklog = async (sprint, totalSpentHoursBugs) => {
	const sprintFilter = `jql=Sprint=${sprint}+and+( issuetype in ( Story, Improvement, Task  ))
	&fields=summary,assignee,status,timeoriginalestimate,aggregatetimespent,aggregatetimeoriginalestimate,customfield_14280,customfield_14601`;
	const response = {};

	const data = await executeSearch({ filter: sprintFilter });

	const backlogItems = handleResponse(data.issues);

	const { aggregateTimeSpent } = backlogItems.reduce((a, b) => (
		{ aggregateTimeSpent: a.aggregateTimeSpent + b.aggregateTimeSpent }
	));

	const { aggregateTimeOriginalEstimate } = backlogItems.reduce((a, b) => (
		// eslint-disable-next-line max-len
		{ aggregateTimeOriginalEstimate: a.aggregateTimeOriginalEstimate + b.aggregateTimeOriginalEstimate }
	), { aggregateTimeOriginalEstimate: 0 });

	if (totalSpentHoursBugs) {
		response.rework = getRework(totalSpentHoursBugs, aggregateTimeSpent);

		response.workRatio = getWorkRatio(
			{
				totalSpentHoursBugs,
				aggregateTimeSpent,
				aggregateTimeOriginalEstimate,
			},
		);
	}

	const { storyPoints } = backlogItems.reduce((a, b) => (
		{ storyPoints: a.storyPoints + b.storyPoints }));

	response.aggregateTimeSpent = aggregateTimeSpent;
	response.timeEstimated = aggregateTimeOriginalEstimate;
	response.velocity = storyPoints;
	response.productivity = storyPoints ? (aggregateTimeSpent / storyPoints) : STORY_POINTS_ERROR_MSG;

	return response;
};

const stringToTitleCase = (text) => {
	const treatedString = text.replace(/([A-Z])/g, ' $1');
	return treatedString.charAt(0).toUpperCase() + treatedString.slice(1);
};

const treatKeyToAddOnSheet = (objToSheet) => {
	const objWithTitleCaseKeys = {};
	// keyCamelCase to Key Camel Case
	Object.keys(objToSheet).forEach((key) => {
		if (key === 'QA' || key === 'UAT' || key === 'PROD') objWithTitleCaseKeys[key] = objToSheet[key];
		else objWithTitleCaseKeys[stringToTitleCase(key)] = objToSheet[key];
	});
	return objWithTitleCaseKeys;
};

const roundNumbers = (num) => ((typeof num) === 'number' ? Math.round((num + Number.EPSILON) * 100) / 100 : num);

const envBugDetailsToString = (env) => {
	if (!env) return '';
	const {
		qty,
		sumTimeSpent,
		qtyCanceled,
	} = env;
	return `${qty} bugs with ${roundNumbers(sumTimeSpent)} time spent and ${qtyCanceled} cancelled`;
};

const createSprintMetricsObj = (bugsData, sprintIndicators) => {
	const {
		total,
		PROD,
		UAT,
		QA,
		totalSpentBugs,
	} = bugsData;

	Object.keys(sprintIndicators).forEach((key) => {
		// eslint-disable-next-line no-param-reassign
		sprintIndicators[key] = roundNumbers(sprintIndicators[key]);
	});

	return {
		totalBugsAmount: total,
		PROD: envBugDetailsToString(PROD),
		UAT: envBugDetailsToString(UAT),
		QA: envBugDetailsToString(QA),
		totalSpentBugs: roundNumbers(totalSpentBugs),
		...sprintIndicators,
	};
};

const updateDBWithStoryDetails = async ({
	bugsData,
	sprintIndicators,
}) => {
	const { id, accountEmail, privateKey } = await getSsmParameters({ parameters: keysToSearch, toolName: 'googleSheet' });

	try {
		const { bugs } = bugsData;
		const doc = new GoogleSpreadsheet(id);
		await doc.useServiceAccountAuth({
			client_email: accountEmail,
			private_key: privateKey,
		});
		await doc.loadInfo();
		const sheetBugs = doc.sheetsByTitle['Sprint Bugs'];
		const sheetMetrics = doc.sheetsByTitle['Sprint Metrics'];

		// eslint-disable-next-line no-restricted-syntax
		for (const element of bugs) {
			// eslint-disable-next-line no-await-in-loop
			await sheetBugs.addRow(treatKeyToAddOnSheet(element));
		}

		// eslint-disable-next-line max-len
		await sheetMetrics.addRow(treatKeyToAddOnSheet(createSprintMetricsObj(bugsData, sprintIndicators)));
	} catch (error) {
		log(error);
		throw Error(error);
	}

	return true;
};

module.exports = {
	getSprintBacklog,
	updateDBWithStoryDetails,
};
