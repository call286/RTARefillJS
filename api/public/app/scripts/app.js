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
    'ui.bootstrap',
    'chart.js',
    'rzModule',
    'angularMoment',
    'api'
  ]).constant('appconfig', {
    apiurl: 'http://localhost:3001',
    version: '1.0'
  }).constant('angularMomentConfig', {
   timezone: 'Europe/Berlin' // e.g. 'Europe/London'
  })
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'ABCMainCtrl',
      })
      .when('/atomizer', {
        templateUrl: 'views/atomizer.html',
        controller: 'AtomizerCtrl',
      })
      .when('/refills', {
       templateUrl: 'views/refills.html',
       controller: 'RefillsCtrl',
     })
      .otherwise({
        redirectTo: '/'
      });
  });
