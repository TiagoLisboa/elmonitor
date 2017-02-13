'user scripts';

const CasasModel = require('./model');

const callback = (err, data, res) => {
  if (err) return console.log(err);
  return res.json(data);
};

const Actions = {};

Actions.listar = (req, res) => {
  const query = {};
  CasasModel.find(query, (err, data) => {
    callback(err, data, res);
  })
}

Actions.consultar = (req, res) => {
  const query = {_id: req.params.id};
  CasasModel.findOne(query, (err, data) => {
    callback(err, data, res);
  })
}

Actions.login = (req, res) => {
  const query = {login: req.body.login, senha: req.body.senha};
  CasasModel.findOne(query, (err, data) => {
    callback(err, data, res);
  })
}

Actions.alterar = (req, res) => {
  const query = {_id: req.params.id};
  const body = req.body;
  const mod = {$set: body}
  CasasModel.update(query, mod, (err, data) => {
    callback(err, data, res);
  })
}

Actions.remover = (req, res) => {
  const query = {_id: req.params.id};
  CasasModel.remove(query, (err, data) => {
    callback(err, data, res);
  })
}

Actions.cadastrar = (req,res) => {
  let body = req.body;
  if (body.registros == undefined) {
    body.registros = [];
  }
  const casa = new CasasModel(body);
  casa.save((err, data) => {
    callback(err, data, res);
  })
}

Actions.novoRegistro = (req, res) => {
  const query = {_id: req.params.id};
  const body = req.body;
  const mod = {
    $push: {registros: body}
  };
  CasasModel.update(query, mod, (err, data) => {
    callback(err, data, res);
  })
}

module.exports = Actions;
