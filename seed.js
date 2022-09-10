'use strict';

const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_CONNECTION);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () {
  console.log('Mongoose is connected for seeding!');
});

const Results = require('./models/results');

async function seed() {
  console.log('seeding database...');
  const myResults = new Results({
    city: 'Hamilton, Bermuda',
    col_idx: 149.02,
    rent_idx: 96.1,
    col_plus_rent_idx: 124.22,
    groceries_idx: 157.89,
    restaurant_idx: 155.22,
    local_purchasing_pwr_idx: 79.43,
    gas_price: '$3.17',
    time_stamp: Date.now(),
    user_email: 'lauren.main28@gmail.com',
  });
  myResults.save(function (err) {
    if (err) console.error(err);
    else console.log('saved city info in database!');
  });

  console.log('saved city into database');

  console.log('done seeding!');

  mongoose.disconnect();
}

seed();
