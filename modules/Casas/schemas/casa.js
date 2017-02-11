'use strict';

const Schema = require('mongoose').Schema;
const registroSchema = require('./registro');

const _schema_casa = {
  proprietario: String,
  registros: [registroSchema]
}

module.exports = new Schema(_schema_casa, {collection: 'casas'});
