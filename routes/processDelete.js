var express = require('express');
var router = express.Router();
var mongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

router.delete('/:pollId', function (req, res) {
    if (req.session.userDetails) {
        var userId = req.session.userDetails.userId;
        var pollId = '';
        var userName = req.session.userDetails.name;
        if (!req.params.pollId) {
            res.send({ success: false, error: { message: 'Invalid query' } });
        } else {
            pollId = req.params.pollId;
            var pollId_Obj = new ObjectId(pollId);

            try {
                mongoClient.connect(process.env.MONGOLAB_URI, function (err, db) {
                    var pollData_user = db.collection('pollData_user', function (err2, collection) {
                        if (err2) throw err2;
                        collection.deleteOne({ "pollId": pollId }, function (err3, doc) {
                            if (err3) throw err3;
                            // Now, delete the poll itself.
                            var pollData = db.collection('pollData', function(err4, collection2){
                                if(err4) throw err4;
                                collection2.deleteOne({"_id" : pollId_Obj}, function(err5, doc){
                                    if (err5) throw err5;
                                    res.send({ success: true, message : "Poll deletion success" });
                                });
                            });
                        }); // deleteOne
                    }); // collection
                }); // connect
            }
            catch (e) {
                console.error(e);
                res.send({ success : false, error : { message : 'Database error'}});
            }
        }
    } else {
        res.send({ success: false, error: { message: "Invalid Session" } });
    }
});

module.exports = router;
