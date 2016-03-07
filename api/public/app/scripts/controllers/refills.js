'use strict';

/**
 * @ngdoc function
 * @name RTARefillJS.controller:RefillsCtrl
 * @description # RefillsCtrl Controller of the RTARefillJS
 */
angular.module('RTARefillJS').controller('RefillsCtrl', function($scope, apiRefill) {
 $scope.currentPage = 1;
 $scope.itemsCnt = 10;
 $scope.totalItems = 0;
 $scope.refills = [];
 $scope.deleteEnabled = true;
 
 $scope.update = function(){
  apiRefill.totalCount().then(function(data){
   $scope.totalItems = data.totalcount;
  });
  
  apiRefill.getAll($scope.currentPage, $scope.itemsCnt).then(function(data){
   $scope.refills = data;
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
 
 $scope.pageChanged = function(){
  update();
 };
 
 var update = function(){
  $scope.update();
 };
 
 update();
});
