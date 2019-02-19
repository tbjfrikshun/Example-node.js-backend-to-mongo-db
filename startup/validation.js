const winston = require('winston');
const Joi = require('joi');

module.exports = function () {
    Joi.objectId = require('joi-objectid')(Joi);
    winston.info('Completed started for validation.')
}