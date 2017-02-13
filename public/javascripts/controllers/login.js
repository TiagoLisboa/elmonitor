app.controller('LoginController', ['$scope', '$location', 'session', function ($scope, $location, session) {
  var vm = this;
  vm.login = {}
  vm.message = "";

  console.log(session);

  vm.loginHandler = function () {
    var x = session.setUsuarioAuten('true', vm.login);
    x.then(function (res) {
      if (res) {
        $location.path('/home');
      }else {
        vm.message = "Login ou senha inválidos";
      }
    })
  }
}]);
