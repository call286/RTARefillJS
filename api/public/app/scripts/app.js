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
    'api'
  ]).constant('appconfig', {
    apiurl: 'http://borgman.no-ip.org:3001',
    version: '1.0'
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
