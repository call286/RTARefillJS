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
var server = require('http').createServer(app)
var mongourl = process.env.OPENSHIFT_MONGODB_DB_URL || 'mongodb://localhost/rtarefilljs';

mongoose.connect(mongourl, function(err) {
 if(err) {
     console.log('MongoDB connection error', err);
 } else {
     console.log('MongoDB connection successful');
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

//var server = app.listen(3001, function () {
//  var host = server.address().address;
//  var port = server.address().port;
//
//  console.log('Example app listening at http://%s:%s', host, port);
//});

//Start the server
var port = process.env.OPENSHIFT_INTERNAL_PORT || process.env.OPENSHIFT_NODEJS_PORT || process.env.OPENSHIFT_NodeJS_PORT || 3001
 , ip = process.env.OPENSHIFT_INTERNAL_IP || process.env.OPENSHIFT_NODEJS_IP || process.env.OPENSHIFT_NodeJS_PORT || "127.0.0.1";
console.log(ip+':'+port)
server.listen(port, ip);