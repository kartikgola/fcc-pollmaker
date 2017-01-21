var express = require('express');
var router = express.Router();
var mongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;


router.get('/', function (req, res, next) {

    var userIp = req.ip.split(':')[3];
    var userId = '';
    if (req.session.userDetails)
        userId = req.session.userDetails.userId;
    var pollId = req.query.pollId;
    var vote = req.query.vote.toString();
    var customOption = req.query.customOption || '';
    if (!req.query.custom)
        vote = vote.substring(vote.length - 1, vote.length);

    try {
        // Check if vote has already been made by that IP or user.
        // Using different collection for this called pollData_user
        mongoClient.connect(process.env.MONGOLAB_URI, function (err, db) {
            if (err) throw err;
            // Connection successful
            var pollData_user = db.collection('pollData_user', function (err2, collection) {
                if (err2) throw err2;
                collection.findOne({ $or: [{ 'userIp': userIp }, { 'userId': userId }], 'pollId': pollId }, function (err3, doc) {
                    if (err3) throw err3;
                    if (doc == null) {
                        // vote does not exist
                        // Insert into pollData_user
                        collection.insertOne({
                            userIp: userIp,
                            userId: userId,
                            pollId: pollId,
                            vote: vote
                        }, function (err4, data) {
                            if (err4) throw err4;
                            // Update vote count in pollData
                            var pollData = db.collection('pollData', function (err5, collection2) {
                                if (err5) throw err5;
                                if (req.query.custom) { // If user selected custom option
                                    collection2.updateOne({ "_id": new ObjectId(pollId) }, {$push : { options : customOption}} , function(err7, data){
                                        if ( err7 ) throw err7;
                                        collection2.updateOne({ "_id": new ObjectId(pollId) }, {$push : { votes : 1}}, function(err8, data){
                                            if ( err8 ) throw err8;
                                            res.send({success : true, message : 'Vote successful'});
                                            db.close();
                                        });
                                    }); 
                                } else { // If user did not select custom option
                                    var voteString = "votes." + vote;
                                    var update = {
                                        $inc: {
                                            [voteString]: 1
                                        }
                                    };
                                    collection2.updateOne({ "_id": new ObjectId(pollId) }, update, function (err6, data) {
                                        if (err6) throw err6;
                                        res.send({ success: true, message: 'Vote successful' });
                                        db.close();
                                    });
                                }
                            });
                        });

                    } else {
                        // vote exists
                        db.close();
                        res.send({ success: false, message: 'Vote already exists' });
                    }

                }); // findOne
            }); // collection
        }); // connect
    }

    catch (e) {
        console.err(e);
        res.send({ success: false, message: 'Database error' });
    }
});

module.exports = router;