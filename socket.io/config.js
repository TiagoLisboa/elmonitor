var io = require('socket.io')();
var CasasModel = require('../modules/Casas/model');
// var registros = [];
const find = (query, indice, socket) => {
  CasasModel.findOne(query, (err, data) => {
    var registros = registros = data.registros.slice(indice);
    socket.emit('update-data', registros);
  });
}
var interval;
io.on('connection', function(socket){
  socket.on('update-data', function (data) {
    interval = setInterval(function () {
      var query = {_id: data._id};
      find(query, data.indice, socket);
    }, 1000);

  });

  socket.on('disconnect', () => {
    clearInterval(interval);
  });

});

module.exports = io;
