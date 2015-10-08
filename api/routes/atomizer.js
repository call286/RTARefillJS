var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Atomizer = require('../models/atomizer.js');

// CORS
router.all('/*', function(req, res, next) {
 res.header("Access-Control-Allow-Origin", "*");
 res.header("Access-Control-Allow-Headers", "X-Requested-With, content-type");
 res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
 next();
});

router.get('/', function(req, res, next) {
 Atomizer.find(function(err, atomizers) {
  if (err)
   return next(err);
  
  res.json(atomizers);
 });
});

router.post('/', function(req, res, next) {
 if(req.body !== undefined) {
  Atomizer.create(req.body, function(err, data) {
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
 Atomizer.findByIdAndRemove(req.params.id, req.body, function(err, match) {
  if (err)
   return next(err);
  
  res.json(match);
 });
});

module.exports = router;