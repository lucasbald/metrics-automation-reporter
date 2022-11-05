const { executeSearch, handleResponse } = require('../handlers/jira');

const consolidateByIssueType = (issueType, data) => {
	const filterByIssueType = data.filter((b) => b.issueType === issueType && b.status !== 'Canceled');

	const results = {
		qty: filterByIssueType.length,
		sumTimeEstimated: filterByIssueType.reduce((a, b) => (
			{ timeEstimated: a.timeEstimated + b.timeEstimated })).timeEstimated,
	};

	return results;
};

const getStoryDetails = async (story) => {
	const storyFilter = `jql=parent=${story}+&fields=summary,issuetype,timeoriginalestimate,status,aggregatetimespent,customfield_14280`;
	const response = {};
	let totalEstimated = 0;

	const data = await executeSearch({ filter: storyFilter });

	const ticketsInStory = handleResponse(data.issues);

	const issueTypesFound = [...new Set(ticketsInStory.map((ticket) => ticket.issueType))];
	issueTypesFound.forEach((issueType) => {
		const result = consolidateByIssueType(issueType, ticketsInStory);
		response[`${issueType}`] = result;
		totalEstimated += result.sumTimeEstimated;
	});

	response.totalEstimated = totalEstimated;

	return response;
};

module.exports = {
	getStoryDetails,
};
