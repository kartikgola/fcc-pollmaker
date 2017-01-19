var express = require('express');
var router = express.Router();
var mongoClient = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var assert = require('assert');

router.get('/', function (req, res, next) {

    if (req.session.userDetails) {
        var userName = req.session.userDetails.name;
        var userId = req.session.userDetails.userId;

        mongoClient.connect('mongodb://127.0.0.1:27017/test', function (err, db) {
            assert.equal(null, err);
            // Connection successful
            var pollData = db.collection('pollData', function (err2, collection) {
                assert.equal(null, err2);
                // Collection found
                var cursor = collection.find({ createdBy: req.session.userDetails.userId }).sort({ 'createdAt': -1 });
                cursor.count(function (err3, count) {
                    assert.equal(null, err3);
                    if (count == 0) {
                        res.render('myPolls', {
                            userName : userName,
                            userId : userId,
                            count: 0,
                            pollData: []
                        });
                    } else {
                        var data = [];
                        cursor.each(function (err3, item) {
                            assert.equal(null, err3);
                            if (item == null) {
                                // cursor closed or exhausted
                                res.render('myPolls', { userName: userName, userId: userId, pollData: data, count : data.length });
                                db.close();
                            } else {
                                data.push({
                                    'pId': item._id,
                                    'title': item.title,
                                    'createdAt': item.createdAt,
                                    'votes' : item.votes,
                                    'totalVotes' : item.votes.reduce(function(a,b){ return a+b;}, 0)
                                });
                            }
                        }); // each  
                    }
                });
            }); // collection
        }); // connect
    } else {
        res.render('/');
    }
});

module.exports = router;