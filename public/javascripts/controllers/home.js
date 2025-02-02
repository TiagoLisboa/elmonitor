app.controller('HomeController', function ($scope, $location, session, $http, $compile) {
  var vm = this;
	var dicParam = {
		'Tensão': 'tensao_rms',
		'Corrente': 'corrente_rms',
		'Consumo': 'consumo',
		'Potência Ativa': 'pot_atv',
		'Potência Aparente': 'pot_apr',
		'Potência Reativa': 'pot_rea',
		'Fator de Potência': 'fat_pot'
	}
  vm.user = {};
  vm.user.name = session.getUsuario().proprietario;

	vm.dia = new Date();
  vm.dia.setDate(vm.dia.getDate() - 1);

  vm.logoff = function () {
    session.close();
    $location.path("/login");
  }

  vm.changeDado = function (dado) {
    // vm.dado = dado == 'corrente' || 'corrente_rms';
		vm.dado = dado
		drawMainChart ();
  }

  vm.registrosDiaSelected = null

	vm.mudarDia = function () {
		console.log(new Date(vm.dia))
		console.log(new Date())
    $http.get('http://localhost:3000/api/casas/registros/' + session.getUsuario()._id + '/' + vm.dia).then(function (res) {
      vm.registrosDiaSelected = res.data.registros;
      drawDayChart ();
    })
	}

  vm.mudarDia();

  vm.dado = 'Consumo';

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

  function drawDayChart () {
    $scope.dayChartConfig = {
      chart: {
        type: 'spline',
        // animation: Highcharts.svg, // don't animate in old IE
        marginRight: 10,
        events: {
          load: function () {

          }
        }
      },
      title: {
        text: vm.dado + ' no dia ' + vm.dia.getDate() + '/' + vm.dia.getMonth() + "/" + vm.dia.getFullYear()
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
          for (i = -vm.registrosDiaSelected.length+1; i <= 0; i += 1) {
            var time = (new Date(vm.registrosDiaSelected[vm.registrosDiaSelected.length-1+i].data)).getTime();
            data.push({
              x: time,
              y: vm.registrosDiaSelected[vm.registrosDiaSelected.length-1+i][dicParam[vm.dado]]
            });
          }
          return data;
        }())
      }]
    };

    $('#day-chart').empty();
    $('#day-chart').append($compile("<highchart id='chart-live' config='dayChartConfig' style='width: 95%;'></highchart>")($scope));
  }

  function drawMainChart () {
    $http.get('http://localhost:3000/api/casas/' + session.getUsuario()._id).then(function (res) {

      drawDayChart ();
      dbRegistros = res.data.registros;
			console.log(res)
      dbIndice = res.data.indice;

      $scope.mainChartConfig = {
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
                  series.addPoint([time, diff[i][dicParam[vm.dado]]], true, true);
                }
                dbRegistros = msg;
              });

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
                y: dbRegistros[dbRegistros.length-1+i][dicParam[vm.dado]]
              });
            }
            return data;
          }())
        }]
      };
      $('#main-chart').empty();
      $('#main-chart').append($compile("<highchart id='chart-live' config='mainChartConfig' style='width: 95%;'></highchart>")($scope));
    });
  }

drawMainChart ()



});
