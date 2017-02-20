'use strict';

module.exports = (updateData) => {

  const Actions = require('./actions')(updateData);

  const routes = [
    {
      method: 'get',
      path: '/',
      action: Actions.listar
    },
    {
      method: 'get',
      path: '/:id',
      action: Actions.consultar
    },
    {
      method: 'put',
      path: '/:id',
      action: Actions.alterar
    },
    {
      method: 'put',
      path: '/registro/:id',
      action: Actions.novoRegistro
    },
    {
      method: 'post',
      path: '/',
      action: Actions.cadastrar
    },
    {
      method: 'delete',
      path: '/:id',
      action: Actions.remover
    },
    {
      method: 'post',
      path: '/login',
      action: Actions.login
    }
  ];

  return routes;

};
