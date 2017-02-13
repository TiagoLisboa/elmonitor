app.service('session', function ($cookies, $http, $q) {
  // $cookies.put('usuarioAutenticado', 'false');
  this.setUsuarioAuten = function (val, usr) {
    var deferred = $q.defer();

    $http.post('http://localhost:3000/api/casas/login', usr).then(function (res) {
      if (res.data) {
        $cookies.putObject('usuarioAutenticado', val);
        $cookies.putObject('usuario', res.data);
        deferred.resolve(true);
      }
      deferred.resolve(false);
    });

    return deferred.promise;
  }

  this.getUsuarioAuten = function () {
    return $cookies.getObject('usuarioAutenticado');
  }

  this.getUsuario = function () {
    return $cookies.getObject('usuario');
  }

  this.close = function () {
    $cookies.remove('usuarioAutenticado');
    $cookies.remove('usuario');
  }
});
