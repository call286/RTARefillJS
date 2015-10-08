'use strict';

angular.module('api', []).factory('apiAtomizer', function($resource, $q, appconfig) {
 var Atomizer = $resource(appconfig.apiurl + '/atomizer');

 return {
  get : function() {
   var deferred = $q.defer();
   Atomizer.query(function(data) {
    deferred.resolve(data);
   });
   return deferred.promise;
  }
 };
}).factory('apiRefill', function($resource, $q, appconfig) {
 var Refill = $resource(appconfig.apiurl + '/refill/:id',{id:'@id'});
 var RefillsToday = $resource(appconfig.apiurl + '/refill/todaysrefills',{id:'@id'},{delete: { method: "DELETE", url: appconfig.apiurl + '/refill/:id'}});
 var RefillsTodayAtomizer = $resource(appconfig.apiurl + '/refill/atomizerrefillstoday',{id:'@id'},{delete: { method: "DELETE", url: appconfig.apiurl + '/refill/:id'}} );

 return {
  getAll : function() {
   var deferred = $q.defer();
   Refill.query(function(data) {
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
 var ReportConsumpMedian = $resource(appconfig.apiurl + '/report/consumpmedian', {
  year : '@year',
  month : '@month'
 });

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
  }
 };
});