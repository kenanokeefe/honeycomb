//= require jquery
//= require jquery_ujs

//= require angular.min.js
//= require angular-route.min.js
//= require angular-ui-router.min.js

landingApp = angular.module('landingApp', ['ngRoute', 'ui.router']); 

landingApp.config(['$httpProvider', function ($httpProvider) { //NOTE: need for server to accept data
   $httpProvider.defaults.headers.common['X-CSRF-Token'] = angular.element('meta[name=csrf-token]').attr('content') 
}]);