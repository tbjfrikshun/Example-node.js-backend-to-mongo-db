const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');

// Connect to database
module.exports = function() {
	const db = config.get('db');
	mongoose
		.connect(db, {
			useNewUrlParser: true,
			useFindAndModify: false,
			useCreateIndex: true
		})
		.then(() => winston.info(`Connected to ${db}...`));
};
