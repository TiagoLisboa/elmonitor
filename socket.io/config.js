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

var clientes = []

io.on('connection', function(socket){
  socket.on('ack', function (data) {
    clientes.push({
      cliId: data,
      socId: socket.id
    });
  });
  socket.on('update-ask', function (data) {
      var query = {_id: data._id};
      find(query, data.indice, socket);
  });

  socket.on('disconnect', () => {
    clientes = clientes.filter((item) => { return item.socId != socket.id })
    clearInterval(interval);
  });

});

updateData = function (idCli) {
  var cliente = clientes.filter((item) => {return item.cliId == idCli})[0];
  if (cliente) {
    io.sockets.connected[cliente.socId].emit('update-ack')
  }
}

module.exports = {io, updateData};
