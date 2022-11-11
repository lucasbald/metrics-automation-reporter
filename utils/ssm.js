const aws = require('aws-sdk');
const { log } = require('./logger');

const getSsmParameters = async ({ parameters, withDecryption = true, awsRegion = 'us-east-1' }) => {
	log('SSM Parameters:');
	log(parameters);

	try {
		const keys = Object.keys(parameters);

		const ssm = new aws.SSM({ region: awsRegion });

		const ssmResponse = await ssm.getParameters({
			Names: Object.values(parameters),
			WithDecryption: withDecryption,
		}).promise();

		ssmResponse.Parameters?.forEach((element) => {
			keys.forEach((key) => {
				if (parameters[key] === element.Name) {
					// eslint-disable-next-line no-param-reassign
					parameters[key] = element.Value;
				}
			});
		});

		return parameters;
	} catch (error) {
		log('Failed to load these parameters from SSM');
		log(error);
		throw Error(error.message);
	}
};

module.exports = {
	getSsmParameters,
};
