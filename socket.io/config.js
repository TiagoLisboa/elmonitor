module.exports = function (server) {
  var io = require('socket.io')(server);
  return io;
}
