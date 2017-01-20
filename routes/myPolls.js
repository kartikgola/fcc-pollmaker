var express = require('express');
var router = express.Router();
var mongoClient = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var assert = require('assert');

router.get('/', function (req, res, next) {

    if (req.session.userDetails) {
        var userName = req.session.userDetails.name;
        var userId = req.session.userDetails.userId;

        try {
            mongoClient.connect(process.env.MONGOLAB_URI, function (err, db) {
                if ( err ) throw err;
                // Connection successful
                var pollData = db.collection('pollData', function (err2, collection) {
                    if ( err2 ) throw err2;
                    // Collection found
                    var cursor = collection.find({ createdBy: req.session.userDetails.userId }).sort({ 'createdAt': -1 });
                    cursor.count(function (err3, count) {
                        if ( err3 ) throw err3;
                        if (count == 0) {
                            res.render('myPolls', {
                                userName: userName,
                                userId: userId,
                                count: 0,
                                pollData: []
                            });
                        } else {
                            var data = [];
                            cursor.each(function (err4, item) {
                                if ( err3 ) throw err4;
                                if (item == null) {
                                    // cursor closed or exhausted
                                    res.render('myPolls', { userName: userName, userId: userId, pollData: data, count: data.length });
                                    db.close();
                                } else {
                                    data.push({
                                        'pId': item._id,
                                        'title': item.title,
                                        'createdAt': item.createdAt,
                                        'votes': item.votes,
                                        'totalVotes': item.votes.reduce(function (a, b) { return a + b; }, 0)
                                    });
                                }
                            }); // each  
                        }
                    });
                }); // collection
            }); // connect
        }

        catch (e) {
            console.log(e);
            res.render('snap', {
                userName: userName,
                userId: userId,
                title: 'Something doesn\'t seem right',
                message: 'Please try again later :('
            })
        }
    } else {
        res.render('/');
    }
});

module.exports = router;