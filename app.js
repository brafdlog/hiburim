var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compression = require('compression');
var config = require('./config').Config;

var routes = require('./routes/index');
var cars = require('./routes/cars');
var donors = require('./routes/donors');
var consumers = require('./routes/consumers');
var configRoute = require('./routes/configRoute');
var apiRoute = require('./routes/apiRoute');

var app = express();

console.log('Using ' + config.env + ' configuration');

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
app.use(cookieParser());
// Cache static resources for one year
var oneYear = "31557600000";
app.use(express.static(path.join(__dirname, 'public'), {maxage: oneYear}));

app.use('/', routes);
app.use('/cars', cars);
app.use('/donors', donors);
app.use('/consumers', consumers);
app.use('/config', configRoute);
app.use('/api', apiRoute);

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