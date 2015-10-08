'use strict';

/**
 * @ngdoc overview
 * @name RTARefillJS
 * @description
 * # RTARefillJS
 *
 * Main module of the application.
 */
angular
  .module('RTARefillJS', [
    'ngAnimate',
    'ngAria',
    'ngCookies',
    'ngMessages',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'api'
  ]).constant('appconfig', {
   apiurl: 'http://localhost:3000'
  })
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/atomizer', {
        templateUrl: 'views/atomizer.html',
        controller: 'AtomizerCtrl',
        controllerAs: 'atomizer'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
