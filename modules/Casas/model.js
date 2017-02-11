'use strict';

const mongoose = require('mongoose');
const casaSchema = require('./schemas/casa');

const CasasModel = mongoose.model('Casas', casaSchema, 'casas');

module.exports = CasasModel;
