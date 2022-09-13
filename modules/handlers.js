'use strict';

const { response } = require('express');
const Results = require('../models/results');
const axios = require('axios');
require('dotenv').config();

const Handler = {};

Handler.getCity = (req) => {
  const url = `https://us1.locationiq.com/v1/search.php?key=${process.env.LOCATION_KEY}&q=${req.query.city}&format=json`;
  axios.get(url)
    .then(response => {
      console.log('Location Response: ', response.data);
      const locationObj = {
        lat: response.data.lat,
        lon: response.data.lon,
        country: response.data.display_name.split(', ')[response.data.display_name.length - 1]
      };
      getGasPrices(locationObj);
    })
    .then(response => {
      console.log('Gas Response:', response.data);
    }).catch(error => {
      console.log(error);
    });
};

const getGasPrices = (locationObj) => {
  let isUSA = false;

  if (locationObj.country === 'USA') {
    isUSA = true;
  }
  const url = `https://www.gasbuddy.com/gaspricemap/county?lat=${locationObj.lat}&lng=${locationObj.lon}&usa=${isUSA}`;
  const response = axios.get(url);
};

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
