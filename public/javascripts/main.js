var app = angular.module("elmonitor", ['ngRoute', 'highcharts-ng'])
  .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    // $locationProvider.html5Mode(true);
    $routeProvider
      .when('/login',
        {
          templateUrl: 'partials/login.html',
          controller: 'LoginController'
        })
      .when('/home',
        {
          templateUrl: 'partials/home.html',
          controller: 'HomeController',
          controllerAs: 'Home'
        })
      .otherwise({'redirectTo':'/home'});
  }]);
