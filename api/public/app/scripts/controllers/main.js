'use strict';

/**
 * @ngdoc function
 * @name RTARefillJS.controller:MainCtrl
 * @description # MainCtrl Controller of the RTARefillJS
 */
angular.module('RTARefillJS').controller('ABCMainCtrl', function($scope, apiReport, apiRefill, apiAtomizer, $interval, moment) {
 $scope.deleteEnabled = false;
 $scope.medianconsump = 0.0;
 $scope.medianconsumpYear = undefined;
 $scope.withYear = true;
 $scope.year = $scope.withYear ? ($scope.year || new Date().getFullYear()) : undefined;
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
 
 //Slider with ticks and values year
 $scope.slider_year = {
     value: new Date().getFullYear(),
     options: {
         ceil: new Date().getFullYear(),
         floor: 2015,
         showTicksValues: false
     }
 };
 
 $scope.labels = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
 $scope.series = ['Verbrauch ml'];
 $scope.chartOptions = {
   scaleGridLineColor : "rgba(100,100,100,.8)",
   scaleOverride: true,
   // ** Required if scaleOverride is true **
   // Number - The number of steps in a hard coded scale
   scaleSteps: 20,
   // Number - The value jump in the hard coded scale
   scaleStepWidth: 1,
   // Number - The scale starting value
   scaleStartValue: 0,
   
   //Boolean - If there is a stroke on each bar
   barShowStroke : true,

   //Number - Pixel width of the bar stroke
   barStrokeWidth : 2,

   //Number - Spacing between each of the X value sets
   barValueSpacing : 5,

   //Number - Spacing between data sets within X values
   barDatasetSpacing : 1,

   //String - A legend template
   legendTemplate : "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].fillColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>",

   // Boolean - Whether to show labels on the scale
   scaleShowLabels: true,

   // String - Scale label font declaration for the scale label
   scaleFontFamily: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",

   // Number - Scale label font size in pixels
   scaleFontSize: 16,

   // String - Scale label font colour
   scaleFontColor: "#EEE",
   
   showTooltips: false, // Because we show values on top of the bar an the tooltip would interfere with that
   
   onAnimationComplete: function () {

    var ctx = this.chart.ctx;
    ctx.font = this.scale.font;
    ctx.fillStyle = this.scale.textColor
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";

    this.datasets.forEach(function (dataset) {
        dataset.bars.forEach(function (bar) {
            ctx.font = "30px Helvetica";
            ctx.fillText(bar.value.toFixed(2), bar.x, bar.y - 5);
        });
    })
}

 };

 $scope.data = [[]];
 
 $scope.open = function($event) {
  $scope.status.refillDateOpened = true;
 };

 $scope.refill = function(atomizer) {
  $scope.refillDate.setHours(0,0,0,0);
  var test = moment($scope.refillDate);
  var refill = {
    "refilldate":test.format(),//$scope.refillDate,
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
//  $scope.calcYearRefillsPerMonth();
 });
 
 $scope.calcYearRefillsPerMonth = function() {
  apiReport.getPerMonth(($scope.year || new Date().getFullYear()), moment().utcOffset()).then(function(data) {
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

 var update = function() {
  $scope.year = $scope.withYear ? ($scope.year || new Date().getFullYear()) : undefined;
  $scope.month = $scope.withMonth ? ($scope.month || new Date().getMonth() + 1) : undefined;

  apiReport.get($scope.year, $scope.month, moment().utcOffset()).then(function(data) {
   $scope.medianconsump = data.medianconsump;
  });

  apiAtomizer.get().then(function(data) {
   $scope.atomizer = data;
  });

  apiRefill.dateRefillsAtomizer($scope.refillDate.getFullYear(), $scope.refillDate.getMonth(), $scope.refillDate.getDate(), moment().utcOffset()).then(function(data) {
   $scope.todaysRefillsAtomizer = data;
  });
  
  $scope.calcYearRefillsPerMonth();
 };

 update();

 $scope.update = function() {
  update();
 };
 
 $scope.changedDate = function() {
  update();
 }
});
