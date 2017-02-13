app.controller('HomeController', function ($scope) {
  var vm = this;
  vm.user = {};
  vm.user.name = 'Fulano';

  $scope.chartConfig = {
    chart: {
      type: 'spline',
      // animation: Highcharts.svg, // don't animate in old IE
      marginRight: 10,
      events: {
        load: function () {
          var socket = io();
          var series = this.series[0];
          socket.on('random', function (msg) {
            series.addPoint([msg.x, msg.y], true, true);
          });

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
        time = (new Date()).getTime(),
        i;
        data.push({
          x: time + i * 1000,
          y: Math.random()
        });
        for (i = -2; i <= 0; i += 1) {
          data.push({
            x: time + i * 1000,
            y: Math.random()
          });
        }
        return data;
      }())
    }]
  };


});
