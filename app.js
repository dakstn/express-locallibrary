var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// route modules
var index = require('./routes/index');
var users = require('./routes/users');
var catalog = require('./routes/catalog'); // import routes for the catalog area of the site

// compression and security middleware modules
var compression = require('compression');
var helmet = require('helmet');

// express application object
var app = express();

// setup compression and security middleware
app.use(compression());
app.use(helmet());

//Set up mongoose connection
var mongoose = require('mongoose');
var mongoDB = process.env.MONGODB_URI || 'mongodb://librarian:password@ds149373.mlab.com:49373/local_library'; // https://mlab.com
mongoose.connect(mongoDB);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// add routes to the middleware chain
app.use('/', index);
app.use('/users', users);
app.use('/catalog', catalog);

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
