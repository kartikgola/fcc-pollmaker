var express = require('express');
var router = express.Router();
var mongoClient = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var assert = require('assert');

/* GET home page. */
router.get('/', function (req, res, next) {
  var userName = '';
  var userId = '';
  if (req.session.userDetails !== undefined) {
    userName = req.session.userDetails.name;
    userId = req.session.userDetails.userId;
  }

  // Hit up MongoDb for getting Poll data...
  var data = [];
  try {
    mongoClient.connect(process.env.MONGOLAB_URI, function (err, db) {
      if ( err ) throw err;
      // Connection successful
      var pollData = db.collection('pollData', function (err2, collection) {
        if ( err2 ) throw err;
        // Collection found
        var cursor = collection.find({}).sort({ 'createdAt': -1 });
        cursor.each(function (err3, item) {
          if ( err3 ) throw err;
          if (item == null) {
            // cursor closed or exhausted
            res.render('index', { userName: userName, userId: userId, data: data });
            db.close();
          } else {
            data.push({
              'pId': item._id,
              'pName': item.title,
              'createdAt': item.createdAt,
              'createdBy': item.createdBy,
            });
          }
        }); // each   
      }); // collection
    }); // connect
  }

  catch (e) {
    console.log(e);
    res.render('snap', { 
      userName : userName,
      userId : userId,
      title : 'Something doesn\'t seem right', 
      message : 'Please try again later :('
        })
  }

}); // get

module.exports = router;
