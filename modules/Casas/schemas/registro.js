'use strict';

const Schema = require('mongoose').Schema;

const _schema_registro = {
  tensao: {type: Number, required: true},
  corrente: {type: Number, required: true},
  tensao_rms: {type: Number, required: true},
  corrente_rms: {type: Number, required: true},
  pot_atv: {type: Number, required: true},
  pot_apr: {type: Number, required: true},
  pot_rea: {type: Number, required: true},
  fat_pot: {type: Number, required: true},
  consumo: {type: Number, required: true},
  data: {type: Date, required: true, default: Date.now}
}
module.exports = new Schema(_schema_registro);
