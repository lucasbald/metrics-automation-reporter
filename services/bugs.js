const { executeSearch, handleResponse } = require('../handlers/jira');

const consolidateByEnvironment = (environment, data) => {
	const filterByEnvironment = data.filter((b) => b.developmentPhase === environment && b.status !== 'Canceled');
	const filterQtyCanceled = data.filter((b) => b.developmentPhase === environment && b.status === 'Canceled');

	const results = {
		qty: filterByEnvironment.length,
		sumTimeSpent: filterByEnvironment.reduce((previous, { timeSpent }) => previous + timeSpent, 0),
		qtyCanceled: filterQtyCanceled.length,
	};

	return results;
};

const getBugs = async (sprint) => {
	const bugsFilter = `jql=Sprint=${sprint}+and+(issuetype in (Sub-Bug, bug))
	+and+summary!~"Code Review Fixes"
	&fields=summary,assignee,status,timespent,customfield_14280`;
	let totalSpentBugs = 0;

	const data = await executeSearch({ filter: bugsFilter });

	const bugsData = {
		bugs: handleResponse(data.issues),
		total: data.total,
	};

	const environmentsFound = [...new Set(bugsData.bugs.map((bug) => bug.developmentPhase))];

	environmentsFound.forEach((environment) => {
		const resultEnvironment = consolidateByEnvironment(environment, bugsData.bugs);
		bugsData[`${environment}`] = resultEnvironment;
		totalSpentBugs += resultEnvironment.sumTimeSpent;
	});

	bugsData.totalSpentBugs = totalSpentBugs;

	return bugsData;
};

module.exports = {
	getBugs,
};
