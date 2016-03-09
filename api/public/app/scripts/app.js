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
    'api',
    'Chart.js'
  ]).constant('appconfig', {
//   apiurl: 'http://borgman.no-ip.org:3001'
    apiurl: 'http://localhost:3001'
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
      .when('/refills', {
       templateUrl: 'views/refills.html',
       controller: 'RefillsCtrl',
       controllerAs: 'refills'
     })
      .otherwise({
        redirectTo: '/'
      });
  });
