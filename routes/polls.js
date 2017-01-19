var express = require('express');
var router = express.Router();
var mongoClient = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var assert = require('assert');

router.get('/:pollId', function (req, res, next) {
    var pollId = req.params.pollId;
    var userName = ''; 
    var userId = '';
    if ( req.session.userDetails ){
        userName = req.session.userDetails.name;
        userId = req.session.userDetails.userId;
    }
    // Hit up mongo to create poll data
    mongoClient.connect(process.env.MONGOLAB_URI, function (err, db) {
        assert.equal(null, err);
        // Connection successful
        var pollData = db.collection('pollData', function (err2, collection) {
            collection.findOne({ _id: objectId(pollId) }, function (err3, doc) {
                if (err3) {
                    console.error(err3);
                    return;
                } else {
                    if (doc == null) {
                        res.render('error', { error : { message: "This poll does not exist" }});
                        db.close();
                    }
                    else {
                        // poll found
                        res.render('polls', {
                            pollId : doc._id,
                            title: doc.title,
                            options: doc.options,
                            votes: doc.votes,
                            createdBy: doc.createdBy,
                            createdAt: doc.createdAt,
                            userName : userName,
                            userId : userId
                        });
                        db.close();
                    }
                }
            }); // findOne
        });
    });
});

module.exports = router;