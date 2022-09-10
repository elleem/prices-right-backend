'use strict';

const mongoose = require('mongoose');

const { Schema } = mongoose;

const resultsSchema = new Schema({
  city: String,
  col_idx: Number,
  rent_idx: Number,
  col_plus_rent_idx: Number,
  groceries_idx: Number,
  restaurant_idx: Number,
  local_purchasing_pwr_idx: Number,
  gas_price: String,
  time_stamp: Date,
  user_email: String
}); 

const Results = mongoose.model('Results', resultsSchema);

module.exports = Results;
