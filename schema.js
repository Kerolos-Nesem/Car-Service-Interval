const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const schema = new Schema({
  id: {type: Number, required: true, unique: true},
  eng: [{type: Boolean, required: true}],
  tir: [{type: Boolean, required: true}],
  bra: [{type: Boolean, required: true}],
  tra: [{type: Boolean, required: true}],
  dif: [{type: Boolean, required: true}],
  coo: [{type: Boolean, required: true}],
  air: [{type: Boolean, required: true}],
  cab: [{type: Boolean, required: true}],
})


module.exports = mongoose.model('Service', schema, 'cs');