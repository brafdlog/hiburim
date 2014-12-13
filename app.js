var express = require('express');
var session = require('express-session');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compression = require('compression');
var quickthumb = require('quickthumb');
var MongoSessionStore = require('connect-mongo')(session);
var passport = require('passport');

var config = require('./config').Config;
var security = require('./security');

var routes = require('./routes/index');
var cars = require('./routes/cars');
var donors = require('./routes/donors');
var consumers = require('./routes/consumers');
var usersRoute = require('./routes/usersRoute');
var configRoute = require('./routes/configRoute');
var apiRoute = require('./routes/apiRoute');

var app = express();

console.log('Using ' + config.env + ' configuration');
console.log('Server provider: ' + process.env.SERVER_PROVIDER);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
// Don't default to the layout file in the views folder
app.set('view options', { layout: false });

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));

// gzip compression of static resources with size larger than 256kb
app.use(compression({
  threshold: 256
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(config.cookie.secret));

// Store session in mongodb. Needs to be AFTER cookie parser
app.use(session({
  store: new MongoSessionStore({
    url: config.mongoDbUri
  }),
 ***REMOVED***
  resave: false,
  saveUninitialized: false
}));

// Setup authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(security.authStrategy);
// Define how user is stored on session
passport.serializeUser(security.serializeUserForSession);
passport.deserializeUser(security.deserializeUserFromSession);

// Use quickthumb for images
app.use('/images', quickthumb.static(__dirname + '/public/images'));

// Cache static resources for one year
// var oneYear = "31557600000";
// app.use(express.static(path.join(__dirname, 'public'), {maxage: oneYear}));

// Don't cache
app.use(express.static(path.join(__dirname, 'public'), {maxage: 0}));

app.use('/', routes);
app.use('/config', configRoute);
app.use('/cars', security.requireAuth, cars);
app.use('/donors', security.requireAuth, donors);
app.use('/users', security.requireAuth, usersRoute);
app.use('/consumers', security.requireAuth, consumers);
app.use('/api', security.requireAuth, apiRoute);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;