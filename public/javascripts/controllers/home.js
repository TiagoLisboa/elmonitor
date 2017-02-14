app.controller('HomeController', function ($scope, $location, session, $http, $compile) {
  var vm = this;
  vm.user = {};
  vm.user.name = session.getUsuario().proprietario;

  vm.logoff = function () {
    session.close();
    $location.path("/login");
  }

  var socket = io();

  function arr_diff (A, B) {
    var arA = A.map(function (e) { return e._id });
    var arB = B.map(function (e) { return e._id });
    var arN = arA.filter(function (x, i) {return arB.indexOf(x) < 0 });
    return A.filter(function (x) {return arN.indexOf(x._id) >= 0});
  }

  $http.get('http://localhost:3000/api/casas/' + session.getUsuario()._id).then(function (res) {
    var dbRegistros = res.data.registros;

    $scope.chartConfig = {
      chart: {
        type: 'spline',
        // animation: Highcharts.svg, // don't animate in old IE
        marginRight: 10,
        events: {
          load: function () {
            var series = this.series[0];
            socket.on('update-consumo', function (msg) {
              var diff = arr_diff(msg, dbRegistros);
              for (var i = 0; i < diff.length; i++) {
                var time = (new Date(diff[i].data)).getTime();
                series.addPoint([time, diff[i].consumo], true, true);
              }
              dbRegistros = msg;

            });
            socket.emit('update-consumo', session.getUsuario()._id);

          }
        }
      },
      title: {
        text: 'Consumo em tempo real'
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
              x: time + i * 1000,
              y: dbRegistros[dbRegistros.length-1+i].consumo
            });
          }
          return data;
        }())
      }]
    };

    $('#main-chart').append($compile("<highchart id='chart-live' config='chartConfig' style='width: 100%;'></highchart>")($scope));
  });




});
