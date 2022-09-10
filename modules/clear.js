'use strict';

require('dotenv').config();
const mongoose = require('mongoose');


mongoose.connect(process.env.MONGO_CONNECTION);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
  console.log('Mongoose is connected for clearing the database!');
});

const Results = require('../models/results');

async function clear() {
  try {
    await Results.deleteMany({});
    console.log('Results deleted! Database cleared!');
  } catch(error) {
    console.error(`something went wrong when clearing the DB: ${error}`);
  } finally {
    mongoose.disconnect();
  }
}

clear();
