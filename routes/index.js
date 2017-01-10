var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var userName = '';
  if ( req.session.userDetails !== undefined )
    userName = req.session.userDetails.name;
  res.render('index', { userName : userName });
});

module.exports = router;
