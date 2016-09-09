app = angular.module('hcApp', ['ngRoute', 'ui.router', 'templates']); 

app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/home',
            {
                controller: 'HomeController',
                templateUrl: 'home.html',
            })
        .when('/cells/:cellId',
            {
                controller: 'EditorController',
                templateUrl: 'editor.html'
            })
        .when('/logs',
            {
                controller: 'LogsController',
                templateUrl: 'logs.html'
            })
        .when('/profile',
            {
                controller: 'ProfileController',
                templateUrl: 'profile.html'
            })
        .otherwise(
            { 
                redirectTo: '/home' 
            });
    //$locationProvider.html5Mode(true); //removes # but buggy
}]);

app.config(['$httpProvider', function ($httpProvider) { //NOTE: need for server to accept data
   $httpProvider.defaults.headers.common['X-CSRF-Token'] = angular.element('meta[name=csrf-token]').attr('content') 
}]);

landingApp = angular.module('fooApp', []); //needed for landing.js, b/c i'm just including all scripts


/*

// Template: app/assets/templates/yourTemplate.html.haml
{
  templateUrl: 'yourTemplate.html'
}

*/


/*

        .when('/',
            {
                controller: 'LandingController',
                templateUrl: 'landing.html'
                
            })

*/