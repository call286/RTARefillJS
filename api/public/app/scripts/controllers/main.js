'use strict';

/**
 * @ngdoc function
 * @name RTARefillJS.controller:MainCtrl
 * @description # MainCtrl Controller of the RTARefillJS
 */
angular.module('RTARefillJS').controller('MainCtrl', function($scope, apiReport, apiRefill, apiAtomizer, $interval) {
 $scope.deleteEnabled = false;
 $scope.medianconsump = 0.0;
 $scope.medianconsumpYear = undefined;
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
 
 $scope.labels = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
 $scope.series = ['Verbrauch ml'];
 $scope.chartOptions = {
   scaleGridLineColor : "rgba(100,100,100,.8)",
   barValueSpacing : 1,
   barDatasetSpacing : 1,
   scaleOverride: true,
   // ** Required if scaleOverride is true **
   // Number - The number of steps in a hard coded scale
   scaleSteps: 20,
   // Number - The value jump in the hard coded scale
   scaleStepWidth: 1,
   // Number - The scale starting value
   scaleStartValue: 0,
 };

 $scope.data = [[]];
 
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
  $scope.calcYearRefillsPerMonth();
 });

 var update = function() {
  $scope.year = $scope.withYear ? ($scope.year || new Date().getFullYear()) : undefined;
  $scope.month = $scope.withMonth ? ($scope.month || new Date().getMonth() + 1) : undefined;

  apiReport.get($scope.year, $scope.month).then(function(data) {
   $scope.medianconsump = data.medianconsump;
  });

  apiAtomizer.get().then(function(data) {
   $scope.atomizer = data;
  });

// apiRefill.todaysRefills().then(function(data) {
// $scope.todaysRefills = data;
// });
//
// apiRefill.todaysRefillsAtomizer().then(function(data) {
// $scope.todaysRefillsAtomizer = data;
// });

  apiRefill.dateRefills($scope.refillDate.getFullYear(), $scope.refillDate.getMonth(), $scope.refillDate.getDate()).then(function(data) {
   $scope.todaysRefills = data;
  });

  apiRefill.dateRefillsAtomizer($scope.refillDate.getFullYear(), $scope.refillDate.getMonth(), $scope.refillDate.getDate()).then(function(data) {
   $scope.todaysRefillsAtomizer = data;
  });
  
  $scope.calcYearRefillsPerMonth = function() {
   apiReport.getPerMonth(($scope.year || new Date().getFullYear())).then(function(data) {
    $scope.medianconsumpYear = new Array(13);
    $scope.medianconsumpYear[0] = data[0].median;
    for(var ii=0;ii<data.length;ii++){
     var month = data[ii].month;
     $scope.medianconsumpYear[month] = data[ii].median;
    }
    
    $scope.medianconsumpYear.shift();
    
    $scope.labels = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
    $scope.series = ['Verbrauch ml'];
    $scope.data = [$scope.medianconsumpYear];
   });
  }
 };

 update();

 $scope.update = function() {
  update();
 };
 
 $scope.changedDate = function() {
  console.clear();
  console.log($scope.refillDate);
  update();
 }
});
