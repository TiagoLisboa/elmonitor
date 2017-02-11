'use strict';

const Schema = require('mongoose').Schema;

const _schema_registro = {
  casa_id: Number,
  tensao: Number,
  corrente: Number,
  tensao_rms: Number,
  corrente_rms: Number,
  pot_atv: Number,
  pot_apr: Number,
  pot_rea: Number,
  fat_pot: Number,
  consumo: Number
}
module.exports = new Schema(_schema_registro);
