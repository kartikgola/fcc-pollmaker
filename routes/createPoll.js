var express = require('express');
var router = express.Router();
var mongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var objectId = require('mongodb').ObjectID;

router.get('/', function(req, res, next){
    // Check if valid session
    if ( req.session.userDetails ) 
        res.render('createPoll', {userName : req.session.userDetails.name, userId : req.session.userDetails.userId});
    else res.render('error', { error : { message : 'Invalid request. Please login'}});
});

module.exports = router;
