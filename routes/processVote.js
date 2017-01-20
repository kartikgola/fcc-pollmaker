var express = require('express');
var router = express.Router();
var mongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var objectId = require('mongodb').ObjectID;


router.get('/', function (req, res, next) {

    var userIp = req.ip.split(':')[3];
    var userId = '';
    if (req.session.userDetails)
        userId = req.session.userDetails.userId;
    var pollId = req.query.pollId;
    var vote = req.query.vote.toString();
    vote = vote.substring(vote.length - 1, vote.length);

    try {
        // Check if vote has already been made by that IP or user.
        // Using different collection for this called pollData_user
        mongoClient.connect(process.env.MONGOLAB_URI, function (err, db) {
            assert.equal(null, err);
            // Connection successful
            var pollData_user = db.collection('pollData_user', function (err2, collection) {
                collection.findOne({ $or: [{ 'userIp': userIp }, { 'userId': userId }], 'pollId': pollId }, function (err3, doc) {
                    assert.equal(null, err3);
                    if (doc == null) {
                        // vote does not exist
                        // Insert into pollData_user
                        collection.insertOne({
                            userIp: userIp,
                            userId: userId,
                            pollId: pollId,
                            vote: vote
                        }, function (err4, data) {
                            assert.equal(null, err4);
                            // Update vote count in pollData
                            var pollData = db.collection('pollData', function (err5, collection2) {
                                var voteString = "votes." + vote;
                                var update = {
                                    $inc: {
                                        [voteString]: 1
                                    }
                                };
                                collection2.updateOne({ _id: objectId(pollId) }, update, function (err6, data) {
                                    assert.equal(null, err6);
                                    res.send({ success: true, message: 'Vote successful' });
                                });
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
        res.send({ success : false, message : 'Database error'});
    }
});

module.exports = router;