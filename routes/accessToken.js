var express = require('express');
var router = express.Router();
var config = require('../config');

router.get('/', function (req, res) {
    var twitterApi = require('node-twitter-api');
    var twitter = new twitterApi({
        consumerKey: config.consumerKey,
        consumerSecret: config.consumerSecret,
        callback: config.callback
    });

    var reqToken = req.query.oauth_token,
        verifier = req.query.oauth_verifier,
        reqSecret;

    if (req.session.userDetails) {
        reqSecret = req.session.userDetails.reqTokenSecret;
    } else reqSecret = "";

    twitter.getAccessToken(reqToken, reqSecret, verifier, function (err, accessToken, accessSecret) {
        if (err)
            res.status(500).send(err);
        else {
            twitter.verifyCredentials(accessToken, accessSecret, function (err, user) {
                if (err)
                    res.status(500).send(err);
                else {
                    //res.send(user);
                    //console.log(user);
                    req.session.userDetails.name = user.name;
                    req.session.userDetails.userId = user.screen_name;
                    
                    // var app = require('../app');
                    // app.locals.uD_name = user.name;
                    // app.locals.uD_userId = user.screen_name;

                    res.render('success', { userName : user.name , userId : user.screen_name});
                }
            });
        }
    });
});

module.exports = router;
