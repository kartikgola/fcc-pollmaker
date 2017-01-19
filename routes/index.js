var express = require('express');
var router = express.Router();
var mongoClient = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var assert = require('assert');

/* GET home page. */
router.get('/', function(req, res, next) {
  var userName = '';
  var userId = '';
  if ( req.session.userDetails !== undefined ){
    userName = req.session.userDetails.name;
    userId = req.session.userDetails.userId;  
  }

  // Hit up MongoDb for getting Poll data...
  var data = [];
  mongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db){
    assert.equal(null, err);
    // Connection successful
    var pollData = db.collection('pollData', function(err2, collection){
        assert.equal(null, err2);
        // Collection found
        var cursor = collection.find({}).sort({'createdAt': -1});
        cursor.each(function(err3, item){
            assert.equal(null, err3);
            if ( item == null ){
              // cursor closed or exhausted
              res.render('index', { userName : userName, userId : userId,  data : data} );
              db.close();
            } else {
              data.push({
                  'pId' : item._id,
                  'pName' : item.title,
                  'createdAt' : item.createdAt,
                  'createdBy' : item.createdBy,
              });
            }
        }); // each   
    }); // collection
  }); // connect
}); // get

module.exports = router;
