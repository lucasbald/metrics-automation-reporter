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

module.exports = {
	getSprintBacklog,
};