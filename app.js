var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multipart = require('connect-multiparty');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var config = require('./config');
var mongoose = require('mongoose');
var passport = require('passport');

// load up the db
var connect = function () {
  var options = { server: { socketOptions: { keepAlive: 1 } } };
  mongoose.connect(config.db, options);
};
connect();

// Error handler
mongoose.connection.on('error', function (err) {
  console.log(err);
});

// Reconnect when closed
mongoose.connection.on('disconnected', function () {
  connect();
});

// Models
require('./models/post');
require('./models/user');
var User = mongoose.model('User');
var Post = mongoose.model('Post');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json({limit: '25mb'}));
app.use(bodyParser.urlencoded({
  limit: '25mb',
  extended: true
}));
var multipartMiddleware = multipart();
app.use(multipartMiddleware);
app.use(cookieParser());
app.use(session({
  secret: config.secret,
  maxAge: 2592000000,
  store: new MongoStore(
    { mongooseConnection: mongoose.connection },
    function(err){
      console.log(err || 'connect-mongodb setup ok');
    }),
  saveUninitialized: true,
  resave: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

passport = require('./routes/passport')(passport);

var index = require('./routes/index')();
var blog = require('./routes/blog')(passport);

app.use('/', index);
app.use('/blog/', blog);

// Handle 404
app.use(function(req, res) {
  var renderObj = {title: '404: File Not Found'};
  if (req.user) {renderObj.user = req.user;}
  res.status(404);
  res.render('404.jade', renderObj);
});

// Handle 500
app.use(function(error, req, res, next) {
  var renderObj = {title:'500: Internal Server Error', error: error};
  if (req.user) {renderObj.user = req.user;}
  res.status(500);
  console.log(error);
  res.render('500.jade', renderObj);
});

module.exports = app;
