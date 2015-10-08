'use strict';

/**
 * @ngdoc function
 * @name RTARefillJS.controller:MainCtrl
 * @description # MainCtrl Controller of the RTARefillJS
 */
angular.module('RTARefillJS').controller('MainCtrl', function($scope, apiReport, apiRefill, apiAtomizer) {
 $scope.medianconsump = 0.0;
 $scope.year = $scope.withYear ? ($scope.year || new Date().getFullYear()) : undefined;
 $scope.month = $scope.withMonth ? ($scope.month || new Date().getMonth() + 1) : undefined;
 $scope.withYear = false;
 $scope.withMonth = false;
 $scope.todaysRefills = [];
 $scope.atomizer = [];
 $scope.todaysRefillsAtomizer = [];

 $scope.refill = function(atomizer) {
  var refillDate = new Date();
  refillDate.setUTCHours(0,0,0,0);
  var refill = {
    "refilldate":refillDate,
    "atomizer":atomizer.toJSON()
  };
  
  apiRefill.refill(refill).then(function(){
   update();
  });
 };

 $scope.remove = function(refill) {
   apiRefill.delete(refill).then(function(){
    update();
   });
 };

 $scope.$watch('withYear', function(ov, nv) {
  update();
 });

 $scope.$watch('withMonth', function(ov, nv) {
  update();
 });

 $scope.$watch('month', function(ov, nv) {
  update();
 });

 $scope.$watch('year', function(ov, nv) {
  update();
 });

 var update = function() {
  $scope.year = $scope.withYear ? ($scope.year || new Date().getFullYear()) : undefined;
  $scope.month = $scope.withMonth ? ($scope.month || new Date().getMonth() + 1) : undefined;

  apiReport.get($scope.year, $scope.month).then(function(data) {
   $scope.medianconsump = data.medianconsump;
  });

  apiRefill.todaysRefills().then(function(data) {
   $scope.todaysRefills = data;
  });

  apiAtomizer.get().then(function(data) {
   $scope.atomizer = data;
  });

  apiRefill.todaysRefillsAtomizer().then(function(data) {
   $scope.todaysRefillsAtomizer = data;
  });
 };

 update();

 $scope.update = function() {
  update();
 };
});
