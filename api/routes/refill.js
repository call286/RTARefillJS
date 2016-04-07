var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Refill = require('../models/refill.js');

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
 var dateStart = new Date(Date.UTC());
 dateStart.setUTCHours(0,0,0,0);
 var dateEnd = new Date(dateStart);
 dateEnd.setDate(dateStart.getDate()+1);
 Refill.find({refilldate:{$gt: dateStart, $lt:dateEnd}},function(err, refills) {
  if (err)
   return next(err);
  
  res.json(refills);
 });
});

router.get('/atomizerrefillstoday', function(req, res, next) {
 var dateStart = new Date(Date.UTC());
 dateStart.setUTCHours(0,0,0,0);
 var dateEnd = new Date(dateStart.getUTCDate());
 dateEnd.setUTCDate(dateStart.getUTCDate()+1);
 console.log(dateStart);
 console.log(dateEnd);
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
 var dateStart = new Date(Date.UTC(req.query.year, req.query.month, req.query.day, 0, 0, 0, 0));
 var dateEnd = new Date(Date.UTC(dateStart));
 dateEnd.setDate(dateStart.getDate()+1);
 console.log(dateStart);
 console.log(dateEnd);
 Refill.find({refilldate:{$gt: dateStart, $lt:dateEnd}},function(err, refills) {
  if (err)
   return next(err);
  
  res.json(refills);
 });
});

router.get('/atomizerdaterefills', function(req, res, next) {
 var dateStart = new Date(Date.UTC(req.query.year, req.query.month, req.query.day, 0, 0, 0, 0));
 var dateEnd = new Date(Date.UTC(dateStart));
 dateEnd.setDate(dateStart.getDate()+1);
 console.log(dateStart);
 console.log(dateEnd);
 Refill.aggregate([
                    { $match : { 'refilldate' : { $gte : dateStart, $lte : dateEnd } } },
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