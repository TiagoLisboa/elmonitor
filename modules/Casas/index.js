'use strict';

const express = require('express');
const router = express.Router();

const routes = require ('./routes');

routes.forEach((route, index) => {
  router[route.method](route.path, route.action);
});

module.exports = router;
