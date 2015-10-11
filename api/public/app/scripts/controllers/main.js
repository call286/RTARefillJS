'use strict';

/**
 * @ngdoc function
 * @name RTARefillJS.controller:MainCtrl
 * @description # MainCtrl Controller of the RTARefillJS
 */
angular.module('RTARefillJS').controller('MainCtrl', function($scope, apiReport, apiRefill, apiAtomizer) {
 $scope.deleteEnabled = false;
 $scope.medianconsump = 0.0;
 $scope.year = $scope.withYear ? ($scope.year || new Date().getFullYear()) : undefined;
 $scope.month = $scope.withMonth ? ($scope.month || new Date().getMonth() + 1) : undefined;
 $scope.withYear = false;
 $scope.withMonth = false;
 $scope.todaysRefills = [];
 $scope.atomizer = [];
 $scope.todaysRefillsAtomizer = [];
 $scope.refillDate = new Date();
 $scope.status = {
   refillDateOpened: false
 };
 $scope.dateOptions = {
   formatYear: 'yyyy',
   startingDay: 1
 };
 $scope.dateFormat = 'dd.MM.yyyy';
 
 $scope.open = function($event) {
  $scope.status.refillDateOpened = true;
 };

 $scope.refill = function(atomizer) {
  $scope.refillDate.setUTCHours(0,0,0,0);
  var refill = {
    "refilldate":$scope.refillDate,
    "atomizer":atomizer.toJSON()
  };
  
  apiRefill.refill(refill).then(function(){
   update();
  });
 };

 $scope.remove = function(refill) {
  if(!$scope.deleteEnabled){
   return;
  }
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
