app.controller('CadastroController', ['$scope', '$location', 'session', function ($scope, $location, session) {
  var vm = this;
  vm.cadastro = {}
  vm.message = "";

  console.log(session);

  vm.cadastrar = function () {
  	var c = session.cadastrar({	proprietario: vm.cadastro.proprietario, 
  								login: vm.cadastro.login,
  								senha: vm.cadastro.senha});

  	c.then(function (res) {
  		var x = session.setUsuarioAuten('true', vm.cadastro);
  		x.then(function (res) {
  		  if (res) {
  		    $location.path('/home');
  		  }else {
  		    vm.message = "Login ou senha inválidos";
  		  }
  		})
  	})
  }
}]);
