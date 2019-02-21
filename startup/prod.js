const winston = require('winston');
const helmet = require('helmet');
const compression = require('compression');

module.exports = function(app) {
    app.use(helmet());
    app.use(compression());
    winston.info('Completed startup for helmet and compression.');
}