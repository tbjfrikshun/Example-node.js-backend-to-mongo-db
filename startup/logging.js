const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');

module.exports = function() {
	process.on('unhandledRejection', (ex) => {
		winston.error('WE GOT AN UNHANDLED REJECTION');
		winston.error(ex.message, ex);
		throw ex; // Send rejection as exception to
		//   winston.
	});

	const options = {
		fileInfo: {
			level: 'info',
			filename: './logfile.log',
			handleExceptions: true,
			json: true,
			maxsize: 5242880, // 5MB
			maxFiles: 5,
			colorize: false,
			timestamp: true
		},
		mongoDB: {
			db: 'mongodb://localhost/vidly',
			collection: 'log',
			handleExceptions: true,
			level: 'info',
			storeHost: true,
			capped: true
		}
	};

	// Setup for dual output both log file and database
	winston.add(winston.transports.File, options.fileInfo);
	winston.add(winston.transports.MongoDB, options.mongoDB);
	winston.info('Completed logging startup successfully.');
};
