/* eslint-disable max-len */
/* eslint-disable no-console */
const util = require('util');

function log(message) {
	const msg = util.inspect(message, { compact: true, depth: 5 });
	const now = new Date();
	const dateAndTime = `${(now.getMonth() + 1).toString().padStart(2, '0')}/${now
		.getDate()
		.toString()
		.padStart(2, '0')}/${now.getFullYear().toString().padStart(4, '0')} ${now
		.getHours()
		.toString()
		.padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;

	console.log(`${dateAndTime} ${msg}`);
}

module.exports = {
	log,
};
