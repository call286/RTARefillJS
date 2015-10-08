'use strict';

/**
 * @ngdoc function
 * @name RTARefillJS.controller:AtomizerCtrl
 * @description # AtomizerCtrl Controller of the RTARefillJS
 */
angular.module('RTARefillJS').controller('AtomizerCtrl', function($scope, apiAtomizer) {
 $scope.atomizer = [];

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
