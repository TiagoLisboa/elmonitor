'use strict';

module.exports = (updateData) => {
  const express = require('express');
  const router = express.Router();

  const routes = require ('./routes')(updateData);

  routes.forEach((route, index) => {
    router[route.method](route.path, route.action);
  });

  return router
};
