'use strict';

/**
 * @ngdoc function
 * @name RTARefillJS.controller:AtomizerCtrl
 * @description # AtomizerCtrl Controller of the RTARefillJS
 */
angular.module('RTARefillJS').controller('AtomizerCtrl', function($scope, apiAtomizer) {
 $scope.deleteEnabled = false;
 $scope.atomizer = [];
 $scope.newAtomizer = {};
 
 $scope.createAtomizer = function(){
  if($scope.newAtomizer.name === '' || $scope.newAtomizer.volume <= 0){
   return;
  }
  apiAtomizer.create($scope.newAtomizer).then(function(data){
   $scope.newAtomizer = {};
   update();
  });
 };

 $scope.remove = function(atomizer) {
  if(!$scope.deleteEnabled){
   return;
  }
  apiAtomizer.delete(atomizer).then(function(){
    update();
   });
 };

 var update = function() {
  apiAtomizer.get().then(function(data) {
   $scope.atomizer = data;
  });
 };

 update();

 $scope.update = function() {
  update();
 };
});
