'use strict';

const { response } = require('express');
const Results = require('../models/results');

const Handler = {};

Handler.savedResults = async (req, res, next) => {
  try {
    const results = await Results.find({});
    res.status(200).send(results);
  } catch (error) {
    console.error(error);
    next(error);
  }
};



module.exports = Handler;
