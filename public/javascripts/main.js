var app = angular.module("elmonitor", ['ngCookies', 'ngRoute', 'highcharts-ng'])
  .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    // $locationProvider.html5Mode(true);
    $routeProvider
      .when('/login',
        {
          templateUrl: 'partials/login.html',
          controller: 'LoginController',
          controllerAs: 'Login'
        })
      .when('/cadastrar',
        {
          templateUrl: 'partials/cadastra.html',
          controller: 'CadastroController',
          controllerAs: 'Cadastro'
        })
      .when('/home',
        {
          templateUrl: 'partials/home.html',
          controller: 'HomeController',
          controllerAs: 'Home'
        })
      .otherwise({'redirectTo':'/home'});
  }]);

app.run(['$rootScope', '$location', 'session', function ($rootScope, $location, session) {
  $rootScope.$on("$locationChangeStart", function(event, next, current) {
    console.log(session.getUsuarioAuten());
    if (!session.getUsuarioAuten() && ($location.path().indexOf('/login') < 0 && $location.path().indexOf('/cadastrar') < 0)) {
      console.log("oii");
      event.preventDefault();
      $location.path("/login");
    }
  });
}]);
