'use strict';

const mongoose = require('mongoose');

const { Schema } = mongoose;

const resultsSchema = new Schema({
  city: String,
  col_idx: Number,
  rent_index: Number,
  col_plus_idx: Number,
  groceries_idx: Number,
  restaurant_idx: Number,
  local_purchasing_pwr_idx: Number,
}, { collection : 'cost-of-living-dataset' });

const Dataset = mongoose.model('cost-of-living-dataset', resultsSchema);

module.exports = Dataset;
