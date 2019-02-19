function logme(req, res, next) {
    console.log('Logging...');
    next();
}

module.exports = logme;