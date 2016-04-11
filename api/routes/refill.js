var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Refill = require('../models/refill.js');
var moment = require('moment');

// CORS
router.all('/*', function(req, res, next) {
 res.header("Access-Control-Allow-Origin", "*");
 res.header("Access-Control-Allow-Headers", "X-Requested-With, content-type");
 res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
 next();
});

router.get('/', function(req, res, next) {
 Refill.paginate({},{ page : req.query.page, limit : req.query.itemsCnt, sortBy : { 'refilldate' : -1, 'atomizer.name' : 1 } },function(err, refills) {
  if (err)
   return next(err);
  
  res.json(refills);
 });
});

router.get('/totalcount', function(req, res, next) {
 Refill.count(function(err, refillcount) {
  if (err)
   return next(err);
  
  res.json({totalcount:refillcount});
 });
});

router.get('/todaysrefills', function(req, res, next) {
 var dateStart = new Date();
 dateStart.setHours(0,0,0,0);
 var dateEnd = new Date(dateStart);
 dateEnd.setDate(dateStart.getDate()+1);
 Refill.find({refilldate:{$gt: dateStart, $lt:dateEnd}},function(err, refills) {
  if (err)
   return next(err);
  
  res.json(refills);
 });
});

router.get('/atomizerrefillstoday', function(req, res, next) {
 var momentStart = moment().startOf('day');
 var momentEnd = moment().endOf('day');

 Refill.aggregate([
                    { $match : { 'refilldate' : { $gte : dateStart, $lte : dateEnd } } },
                    { $group : { _id : '$atomizer.name', total:{$sum : 1 } } }
                    ],function(err, refills) {
  if (err)
   return next(err);
  
  res.json(refills);
 });
});

router.get('/daterefills', function(req, res, next) {
 var year = req.query.year;
 var month = req.query.month.length == 1 ? '0' + (parseInt(req.query.month)+1) : (parseInt(req.query.month)+1);
 var day = req.query.day.length == 1 ? '0' + req.query.day : req.query.day;
 var clientTZ = req.query.timezone;
 var dateStr = year.toString() + '-' + month.toString() + '-' + day.toString() + 'T00:00:00.000+02:00';
 
 var momentStart = moment(dateStr).startOf('day');
 var momentEnd = moment(dateStr).endOf('day');
 
 Refill.find({refilldate:{$gte : momentStart.toDate(), $lte : momentEnd.toDate()}},function(err, refills) {
  if (err)
   return next(err);
  
  res.json(refills);
 });
});

router.get('/atomizerdaterefills', function(req, res, next) {
 var year = req.query.year;
 var month = req.query.month.length == 1 ? '0' + (parseInt(req.query.month)+1) : (parseInt(req.query.month)+1);
 var day = req.query.day.length == 1 ? '0' + req.query.day : req.query.day;
 var clientTZ = req.query.timezone;
 var dateStr = year.toString() + '-' + month.toString() + '-' + day.toString() + 'T00:00:00.000+02:00';
 
 var momentStart = moment(dateStr).startOf('day');
 var momentEnd = moment(dateStr).endOf('day');
 
 Refill.aggregate([
                    { $match : { 'refilldate' : { $gte : momentStart.toDate(), $lte : momentEnd.toDate() } } },
                    { $group : { _id : '$atomizer.name', total:{$sum : 1 } } }
                    ],function(err, refills) {
  if (err)
   return next(err);
  
  res.json(refills);
 });
});

router.post('/', function(req, res, next) {
 if(req.body !== undefined) {
  Refill.create(req.body, function(err, data) {
   if (err)
    return next(err);
   
   res.json(data);
  });
 } else {
  console.log(req.body);
  res.json({NoBody:true});
 }
});

router.delete('/:id', function(req, res, next) {
 Refill.findByIdAndRemove(req.params.id, req.body, function(err, match) {
  if (err)
   return next(err);
  
  res.json(match);
 });
});

module.exports = router;