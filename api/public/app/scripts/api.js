'use strict';

angular.module('api', []).factory('apiAtomizer', function($resource, $q, appconfig) {
 var Atomizer = $resource(appconfig.apiurl + '/atomizer/:id',{id:'@id'});

 return {
  get : function() {
   var deferred = $q.defer();
   Atomizer.query(function(data) {
    deferred.resolve(data);
   });
   return deferred.promise;
  },
  create : function(atomizer) {
   var deferred = $q.defer();
   Atomizer.save({},atomizer,function(data) {
    deferred.resolve(data);
   });
   return deferred.promise;
  },
  delete : function(atomizer) {
   var deferred = $q.defer();
   atomizer.$delete({id:atomizer._id}).then(function(data){
    deferred.resolve(data);
   });
   return deferred.promise;
  }
 };
}).factory('apiRefill', function($resource, $q, appconfig) {
 var Refill = $resource(appconfig.apiurl + '/refill/:id',{id:'@id',page:'@page',itemsCnt:'@itemsCnt'});
 var RefillTotalCount = $resource(appconfig.apiurl + '/refill/totalcount');
 var RefillsToday = $resource(appconfig.apiurl + '/refill/todaysrefills',{id:'@id',timezone:'@timezone'},{delete: { method: "DELETE", url: appconfig.apiurl + '/refill/:id'}});
 var RefillsTodayAtomizer = $resource(appconfig.apiurl + '/refill/atomizerrefillstoday',{id:'@id',timezone:'@timezone'},{delete: { method: "DELETE", url: appconfig.apiurl + '/refill/:id'}} );
 var RefillsDate = $resource(appconfig.apiurl + '/refill/daterefills',{id:'@id',year:'@year',month:'@month',day:'@day',timezone:'@timezone'},{delete: { method: "DELETE", url: appconfig.apiurl + '/refill/:id'}});
 var RefillsDateAtomizer = $resource(appconfig.apiurl + '/refill/atomizerdaterefills',{id:'@id',year:'@year',month:'@month',day:'@day',timezone:'@timezone'},{delete: { method: "DELETE", url: appconfig.apiurl + '/refill/:id'}} );

 return {
  getAll : function(page, itemsCnt) {
   var deferred = $q.defer();
   Refill.query({page:page, itemsCnt:itemsCnt},function(data) {
    deferred.resolve(data);
   });
   return deferred.promise;
  },
  totalCount : function() {
   var deferred = $q.defer();
   RefillTotalCount.get(function(data) {
    deferred.resolve(data);
   });
   return deferred.promise;
  },
  todaysRefills : function() {
   var deferred = $q.defer();
   RefillsToday.query(function(data) {
    deferred.resolve(data);
   });
   return deferred.promise;
  },
  todaysRefillsAtomizer : function() {
   var deferred = $q.defer();
   RefillsTodayAtomizer.query(function(data) {
    deferred.resolve(data);
   });
   return deferred.promise;
  },
  dateRefills : function(year, month, day, timezone) {
   var deferred = $q.defer();
   RefillsDate.query({year:year, month:month, day:day, timezone},function(data) {
    deferred.resolve(data);
   });
   return deferred.promise;
  },
  dateRefillsAtomizer : function(year, month, day, timezone) {
   var deferred = $q.defer();
   RefillsDateAtomizer.query({year:year, month:month, day:day, timezone},function(data) {
    deferred.resolve(data);
   });
   return deferred.promise;
  },
  refill : function(refill) {
   var deferred = $q.defer();
   Refill.save({},refill,function(data) {
    deferred.resolve(data);
   });
   return deferred.promise;
  },
  delete : function(refill) {
   var deferred = $q.defer();
   refill.$delete({id:refill._id}).then(function(data){
    deferred.resolve(data);
   });
   return deferred.promise;
  }
 };
}).factory('apiReport', function($resource, $q, appconfig) {
 var ReportConsumpMedian = $resource(appconfig.apiurl + '/report/consumpmedian', {year : '@year',month : '@month', timezone : '@timezone'});
 var ReportConsumpPerMonth = $resource(appconfig.apiurl + '/report/permonth/:year', {year : '@year', timezone : '@timezone'});

 return {
  get : function(year, month) {
   var deferred = $q.defer();
   ReportConsumpMedian.get({
    year : year,
    month : month
   }, function(data) {
    deferred.resolve(data);
   });
   return deferred.promise;
  },
  getPerMonth : function(year) {
   var deferred = $q.defer();
   ReportConsumpPerMonth.query({
    year : year
   }, function(data) {
    deferred.resolve(data);
   });
   return deferred.promise;
  }
 };
});