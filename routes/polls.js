var express = require('express');
var router = express.Router();
var mongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
var assert = require('assert');

router.get('/:pollId', function (req, res, next) {
    var pollId = req.params.pollId.toString().trim();
    var dataId = new ObjectId(pollId);
    var userName = '';
    var userId = '';
    if (req.session.userDetails) {
        userName = req.session.userDetails.name;
        userId = req.session.userDetails.userId;
    }
    try {
        // Hit up mongo to create poll data
        mongoClient.connect(process.env.MONGOLAB_URI, function (err, db) {
            if ( err ) throw err;
            // Connection successful
            var pollData = db.collection('pollData', function (err2, collection) {
                if ( err2 ) throw err2;
                collection.findOne({ "_id" : dataId}, function (err3, doc) {
                        if ( err3 ) throw err3;
                        if (doc == null) {
                            res.render('error', { error: { message: "This poll does not exist" } });
                            db.close();
                        }
                        else {
                            // poll found
                            res.render('polls', {
                                pollId: doc._id,
                                title: doc.title,
                                options: doc.options,
                                createdBy: doc.createdBy,
                                createdAt: doc.createdAt,
                                userName: userName,
                                userId: userId
                            });
                            db.close();
                        }
                }); // findOne
            });
        });
    }
    catch (e) {
        console.error(e);
        res.render('snap', {
            userName: userName,
            userId: userId,
            title: 'Something doesn\'t seem right',
            message: 'Please try again later :('
        })
    }
});

module.exports = router;