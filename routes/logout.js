var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next){
    if ( req.session.userDetails ){
        delete req.session.userDetails;
        res.redirect(302, '/');
    } else {
        res.render('error', {error : { message : 'Not found'}});
    }
    // res.render('index', {userName : ''});
});

module.exports = router;