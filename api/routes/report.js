var express = require('express');
var router = express.Router();
var moment = require('moment');

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

router.get("/permonth/:year", function(req, res, next) {
 // http://jsfiddle.net/n15wwafg/
 var year = parseInt(req.params.year);
 Refill.aggregate([
   {
    $match : {
     refilldate : {
      $gte : new Date(year, 00, 01, 00, 00, 00),
      $lt : new Date(year + 1, 00, 01, 00, 00, 00)
     }
    }
   }, {
    $group : {
     _id : {
      month : {
       $month : "$refilldate"
      },
      day : {
       $dayOfMonth : '$refilldate'
      }
     },
     total : {
      $sum : '$atomizer.volume'
     }
    }
   }
 ], function(err, consumption1) {
  if (err) return next(err);

  var result = {};
  var tmpArray = new Array(13);

  for (var ii = 0; ii < consumption1.length; ii++) {
   var month = consumption1[ ii ]._id.month;
   var tmpArrayContent = tmpArray[ month ];
   if (tmpArrayContent === null || tmpArrayContent === undefined) {
    tmpArrayContent = {
     volume : 0,
     count : 0,
     month : '',
     median : 0
    };
   }

   tmpArrayContent.volume += consumption1[ ii ].total;
   tmpArrayContent.count++;
   tmpArrayContent.month = month;

   tmpArray[ month ] = tmpArrayContent;
  }

  var yearlyVolume = 0;
  var yearlyCount = 0;

  for (var jj = 1; jj < 13; jj++) {
   if (tmpArray[ jj ] !== undefined && tmpArray[ jj ] !== null) {
    yearlyVolume += tmpArray[ jj ].volume;
    yearlyCount += tmpArray[ jj ].count;
    tmpArray[ jj ].median = tmpArray[ jj ].volume / tmpArray[ jj ].count;
   } else {
    tmpArray[ jj ] = {
      volume : 0,
      count : 0,
      month : jj,
      median : 0
     };
   }
  }

  tmpArray[ 0 ] = {
   volume : yearlyVolume,
   count : yearlyCount,
   median : (yearlyVolume / yearlyCount)
  };

  result = tmpArray;

  res.json(result);
 })
});

module.exports = router;