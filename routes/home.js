const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    // rendering the pug templete (in the views folder) 
    //   index.pug on the home page
    res.render('index', {title: 'Vidly Application', message: 'Hello'});
});

module.exports = router;