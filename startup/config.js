const winston = require('winston');
const config = require('config');

// Read in the private key from enviroment variable.
module.exports = function() {
	if (!config.get('jwtPrivateKey')) {
		throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
	}
	winston.info('Completed config startup.');
};
