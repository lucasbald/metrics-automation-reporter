const credentials = {
	jira: {
		url: '/MetricsAutomationReporter/Jira/Url',
		basicAuth: '/MetricsAutomationReporter/Jira/BasicAuth',
	},
};

const getCredentialsKeys = ({ toolName = 'jira' }) => credentials[toolName];

module.exports = {
	getCredentialsKeys,
};
