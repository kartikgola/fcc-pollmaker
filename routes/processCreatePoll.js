var express = require('express');
var router = express.Router();
var mongoClient = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var assert = require('assert');

router.get('/', function (req, res, next) {

    if (req.session.userDetails) {
        var title = req.query.title;
        var options = req.query.options.split('\n');
        options = options.filter(function (val) {
            return val !== ""
        });
        var optionsData = {};
        for ( var i in options ) {
            optionsData[options[i]] = 0;
        }

        try {
            // Hit up mongo to create poll data
            mongoClient.connect(process.env.MONGOLAB_URI, function (err, db) {
                if ( err ) throw err;
                // Connection successful
                var pollData = db.collection('pollData', function (err2, collection) {
                    if ( err2 ) throw err2;
                    var dateNow = new Date().toLocaleDateString();
                    // Collection found
                    collection.insertOne({
                        title: title,
                        options: optionsData,
                        createdBy: req.session.userDetails.userId,
                        createdAt: dateNow
                    }, function (err3, data) {
                        if ( err3 ) throw err3;
                        // console.log(data.ops[0]._id); 
                        db.close();
                        res.send({ success: true, redirect: '/polls/' + data.ops[0]._id });
                    });
                });
            });

        }
        catch (e) {
            console.err(e);
            res.send({success: false, message : 'Database error'});
        }

    } else {
        res.render('/');
    }

});

module.exports = router;