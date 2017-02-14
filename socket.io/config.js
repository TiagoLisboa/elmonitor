var io = require('socket.io')();
var CasasModel = require('../modules/Casas/model');
// var registros = [];
const find = (query, socket) => {
  CasasModel.findOne(query, (err, data) => {
    var registros = []
    for (var i = 0; i < data.registros.length; i++) {
      registros.push(data.registros[i]);
    }
    socket.emit('update-consumo', registros);
  });
}
var interval;
io.on('connection', function(socket){
  socket.on('update-consumo', function (data) {
    interval = setInterval(function () {
      var query = {_id: data};
      find(query, socket);
      // socket.emit('update-consumo', {x: 0, y: 0});
    }, 1000);
  });

  socket.on('disconnect', () => {
    clearInterval(interval);
  });

});

module.exports = io;
