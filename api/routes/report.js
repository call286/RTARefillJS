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

router.get('/consumpmedian', function(req, res, next) {
 var year = req.query.year;
 var month = req.query.month;

 Refill.aggregate([
  {
   $group : {
    _id : '$refilldate',
    total : {
     $sum : '$atomizer.volume'
    }
   }
  }
 ], function(err, consumpperday) {
  if (err) return next(err);

  var sum = 0;
  var count = consumpperday.length;
  for (var i = consumpperday.length; i--;) {
   if (year !== undefined) {
    var refilldate = new Date(consumpperday[ 0 ]._id);
    if (Number(refilldate.getFullYear()) === Number(year) && (month === undefined || Number(month) - 1 === Number(refilldate.getMonth()))) {
     sum += consumpperday[ 0 ].total;
    } else {
     count--;
    }
   } else {
    sum += consumpperday[ 0 ].total;
   }
   consumpperday.splice(0, 1);
  }

  res.json({
   medianconsump : (sum / count)
  });
 });
});

router.get("/permonth", function(req, res, next) {
 Refill.aggregate([
  {
   $group : {
    _id : {
     month : {
      $month : "$refilldate"
     }
     ,year : {
      $year : "$refilldate"
     }
     //,aName : "$atomizer.name"
    },
    total : {
     $sum : '$atomizer.volume'
    },
    count : {
     $sum : 1
    }
   }
  }
 ], function(err, consump) {
  if (err) return next(err);
  res.json(consump);
 })
});

module.exports = router;