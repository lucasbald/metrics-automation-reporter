const axios = require('axios');

const STORY_POINTS_CUSTOM_FIELD = 'customfield_14601';
const DEVELOPMENT_PHASE_CUSTOM_FIELD = 'customfield_14280';

const executeSearch = async ({ filter }) => {
	const options = {
		baseURL: process.env.JIRA_BASE_URL,
		url: encodeURI(`search?${filter}`),
		method: 'GET',
		headers: {
			Authorization: process.env.JIRA_AUTHENTICATION,
		},
	};
	const { data } = await axios.request(options);
	return data;
};

const handleResponse = (issues) => issues.map((i) => ({
	key: i.key,
	summary: i.fields.summary,
	status: i.fields.status.name,
	assignee: (i.fields.assignee ? i.fields.assignee.displayName : 'Unassigned'),
	timeSpent: (i.fields.timespent ? (i.fields.timespent / 3600) : 0),
	aggregateTimeSpent: (i.fields.aggregatetimespent ? (i.fields.aggregatetimespent / 3600) : 0),
	aggregateTimeOriginalEstimate:
		(i.fields.aggregatetimeoriginalestimate ? (i.fields.aggregatetimeoriginalestimate / 3600) : 0),
	developmentPhase: (i.fields[DEVELOPMENT_PHASE_CUSTOM_FIELD]
		? i.fields[DEVELOPMENT_PHASE_CUSTOM_FIELD].value : null),
	storyPoints: (i.fields[STORY_POINTS_CUSTOM_FIELD] ? i.fields[STORY_POINTS_CUSTOM_FIELD] : null),
	issueType: i.fields.issuetype?.name || 'Empty',
	timeEstimated: (i.fields.timeoriginalestimate ? (i.fields.timeoriginalestimate / 3600) : 0),
}));

module.exports = {
	executeSearch,
	handleResponse,
};