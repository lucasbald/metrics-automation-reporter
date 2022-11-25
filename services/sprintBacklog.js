const { GoogleSpreadsheet } = require('google-spreadsheet');
const { executeSearch, handleResponse } = require('../handlers/jira');

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

/*
	TODO: understand what we will have to put on the sheet DB
	because it is not the same values that we have as the base spreadsheet that we are referring to
*/
const updateDBWithStoryDetails = async ({
	bugsData,
	sprintIndicators,
}) => {
	try {
		const { bugs } = bugsData
		const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
		await doc.useServiceAccountAuth({
			client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
			private_key: process.env.GOOGLE_PRIVATE_KEY,
		});
		await doc.loadInfo();
		const sheetBugs = doc.sheetsByTitle['Sprint Bugs']
		const sheetMetrics = doc.sheetsByTitle['Sprint Metrics']

		for (const element of bugs) {
			await sheetBugs.addRow(element)
		}

		await sheetMetrics.addRow(createSprintMetricsObj(bugsData, sprintIndicators))

		return true
	} catch (error) {
		console.log(error);
	}
};

const roundNumbers = (num) => {
	return (typeof num) === 'number' ? Math.round((num + Number.EPSILON) * 100) / 100 : num
}

const createSprintMetricsObj = (bugsData, sprintIndicators) => {
	const {
		total,
		PROD,
		UAT,
		QA,
		totalSpentBugs
	} = bugsData
	Object.keys(sprintIndicators).forEach((key) => sprintIndicators[key] = roundNumbers(sprintIndicators[key]))
	return {
		totalBugsAmount: total,
		PROD: envBugDetailsToString(PROD),
		UAT: envBugDetailsToString(UAT),
		QA: envBugDetailsToString(QA),
		totalSpentBugs: roundNumbers(totalSpentBugs),
		...sprintIndicators
	}
}

const envBugDetailsToString = ({
	qty,
	sumTimeSpent,
	qtyCanceled
}) => {
	return `${qty} bugs with ${roundNumbers(sumTimeSpent)} time spent and ${qtyCanceled} cancelled`
}

module.exports = {
	getSprintBacklog,
	updateDBWithStoryDetails
};
