app.controller('HomeController', function ($scope, $location, session, $http, $compile) {
  var vm = this;
  vm.user = {};
  vm.user.name = session.getUsuario().proprietario;

  vm.logoff = function () {
    session.close();
    $location.path("/login");
  }

  vm.changeDado = function (dado) {
    vm.dado = dado;
    drawChart ();
  }

  vm.dado = 'Tensão';

  var socket = io();

  function removerAcentos( newStringComAcento ) {
    var string = newStringComAcento;
    var mapaAcentosHex 	= {
      a : /[\xE0-\xE6]/g,
      e : /[\xE8-\xEB]/g,
      i : /[\xEC-\xEF]/g,
      o : /[\xF2-\xF6]/g,
      u : /[\xF9-\xFC]/g,
      c : /\xE7/g,
      n : /\xF1/g
    };

    for ( var letra in mapaAcentosHex ) {
      var expressaoRegular = mapaAcentosHex[letra];
      string = string.replace( expressaoRegular, letra );
    }

    return string.toLowerCase();
  }

  function arr_diff (A, B) {
    var arA = A.map(function (e) { return e._id });
    var arB = B.map(function (e) { return e._id });
    var arN = arA.filter(function (x, i) {return arB.indexOf(x) < 0 });
    return A.filter(function (x) {return arN.indexOf(x._id) >= 0});
  }

  var dbRegistros, dbIndice;
  socket.emit('ack', session.getUsuario()._id);
  socket.on("update-ack", function () {
    socket.emit('update-ask', {_id: session.getUsuario()._id, indice: dbIndice});
  })

  function drawChart () {
    $http.get('http://localhost:3000/api/casas/' + session.getUsuario()._id).then(function (res) {
      dbRegistros = res.data.registros;
      dbIndice = res.data.indice;

      $scope.chartConfig = {
        chart: {
          type: 'spline',
          // animation: Highcharts.svg, // don't animate in old IE
          marginRight: 10,
          events: {
            load: function () {
              var series = this.series[0];
              socket.removeListener('update-data');
              socket.on('update-data', function (msg) {
                var diff = arr_diff(msg, dbRegistros);
                for (var i = 0; i < diff.length; i++) {
                  var time = (new Date(diff[i].data)).getTime();
                  series.addPoint([time, diff[i][removerAcentos(vm.dado)]], true, true);
                }
                dbRegistros = msg;

              });
              // socket.emit('update-data', {_id: session.getUsuario()._id, indice: dbIndice});

            }
          }
        },
        title: {
          text: vm.dado + ' em tempo real'
        },
        xAxis: {
          type: 'datetime',
          tickPixelInterval: 150
        },
        yAxis: {
          title: {
            text: 'Value'
          },
          plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
          }]
        },
        tooltip: {
          formatter: function () {
            return '<b>' + this.series.name + '</b><br/>' +
            Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
            Highcharts.numberFormat(this.y, 2);
          }
        },
        legend: {
          enabled: false
        },
        exporting: {
          enabled: false
        },
        series: [{
          name: 'Random data',
          data: (function () {
            // generate an array of random data
            var data = [],
            i;
            for (i = -19; i <= 0; i += 1) {
              var time = (new Date(dbRegistros[dbRegistros.length-1+i].data)).getTime();
              data.push({
                x: time,
                y: dbRegistros[dbRegistros.length-1+i][removerAcentos(vm.dado)]
              });
            }
            return data;
          }())
        }]
      };
      $('#main-chart').empty();
      $('#main-chart').append($compile("<highchart id='chart-live' config='chartConfig' style='width: 100%;'></highchart>")($scope));
    });
  }

drawChart ()



});
