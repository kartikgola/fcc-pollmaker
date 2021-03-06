var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Requiring routes JS files
var index = require('./routes/index');
var requestToken = require('./routes/requestToken');
var accessToken = require('./routes/accessToken');
var logout = require('./routes/logout');
var createPoll = require('./routes/createPoll');
var myPolls = require('./routes/myPolls');
var polls = require('./routes/polls');
var processCreatePoll = require('./routes/processCreatePoll');
var processVote = require('./routes/processVote');
var processDelete = require('./routes/processDelete');

// Express settings
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('Gangadhar is shaktiman'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('express-session')({
  name : 'pMtwitter',
  secret : 'Gangadhar is shaktiman',
  resave : false,
  saveUninitialized : true,
  cookie: { path: '/',
    httpOnly: true,
    secure: false,
    maxAge: 9999999 
  }
}));

// Attaching routes
app.use('/', index);
app.use('/requestToken', requestToken);
app.use('/accessToken', accessToken);
app.use('/logout', logout);
app.use('/createPoll', createPoll);
app.use('/myPolls', myPolls);
app.use('/polls', polls);
app.use('/processCreatePoll', processCreatePoll);
app.use('/processVote', processVote);
app.use('/processDelete', processDelete);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
