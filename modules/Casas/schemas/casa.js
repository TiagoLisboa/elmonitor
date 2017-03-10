'use strict';

const Schema = require('mongoose').Schema;
const registroSchema = require('./registro');

const _schema_casa = {
  proprietario: {type: String, required: true},
  login: {type: String, required: true, unique: true},
  senha: {type: String, required: true},
  registros: [registroSchema]
}

module.exports = new Schema(_schema_casa, {collection: 'casas'});
