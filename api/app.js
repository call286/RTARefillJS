var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var mongoose = require('mongoose');
var index = require('./routes/index');
var atomizer = require('./routes/atomizer');
var refill = require('./routes/refill');
var report = require('./routes/report');

mongoose.connect('mongodb://localhost/rtarefilljs', function(err) {
 if(err) {
     console.log('connection error', err);
 } else {
     console.log('connection successful');
 }
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json({limit:'5mb'}));
app.use(bodyParser.urlencoded({extended: true,limit:'5mb'}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/atomizer', atomizer);
app.use('/refill', refill);
app.use('/report', report);

app.use(function(req, res, next) {
 var err = new Error('Not Found');
 err.status = 404;
 next(err);
});

app.use(function(err, req, res, next) {
 res.status(err.status || 500);
 res.render('error', {
     message: err.message,
     error: err,
     title: 'error'
 });
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});