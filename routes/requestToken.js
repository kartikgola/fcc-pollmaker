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

  twitter.getRequestToken(function (err, reqToken, reqTokenSecret, result) {
    if (err) {
      console.log('Error getting OAuth token : ' + err);
      res.status(500).send(err);
    }
    else {
      // Store reqToken and reqTokenSecret 
      console.log('getRequestToken successful...');
      if (!req.session.userDetails) {
        req.session.userDetails = {
          reqToken: reqToken,
          reqTokenSecret: reqTokenSecret
        };
      }
      res.redirect("https://api.twitter.com/oauth/authenticate?oauth_token=" + reqToken);
    }
  });

});

module.exports = router;
