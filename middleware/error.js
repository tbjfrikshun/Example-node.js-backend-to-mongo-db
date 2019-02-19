const winston = require('winston');

module.exports = function(err, req, res, next) {
    // error
    // warn
    // info
    // verbose
    // debug
    // silly
    winston.error(err.message, err);
    
    // 500 = Internal server error
    res.status(500).send('Something failed called from error.js');  
}