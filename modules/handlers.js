'use strict';

const { response } = require('express');
const Results = require('../models/results');
const axios = require('axios');
require('dotenv').config();

const Handler = {};

Handler.getCity = (req, res) => {
  const resultObj = {
    city: '',
    col_idx:  '',
    rent_idx: '',
    col_plus_rent_idx: '',
    groceries_idx: '',
    restaurant_idx:  '',
    local_purchasing_pwr_idx:  '',
    gas_price: '',
  }
  const url = `https://us1.locationiq.com/v1/search.php?key=${process.env.LOCATION_KEY}&q=${req.query.city}&format=json`;
  axios.get(url)
    .then(response => {
      console.log('Location Response: ', response.data[0]);
      const locationObj = {
        lat: response.data[0].lat,
        lon: response.data[0].lon,
        country: response.data[0].display_name.split(', ')[response.data[0].display_name.split(', ').length - 1]
      };
      getGasPrices(locationObj)
        .then(result => {
          console.log('Gas Response:', result.data);
          resultObj['gas_price'] = result.data[0].Price
          res.send(resultObj);
        })
    })
    .catch(error => {
      console.log(error);
    });
};

const getGasPrices = (locationObj) => {
  let isUSA = false;

  if (locationObj.country === 'USA') {
    isUSA = true;
  }
  const url = `https://www.gasbuddy.com/gaspricemap/county?lat=${locationObj.lat}&lng=${locationObj.lon}&usa=${isUSA}`;
  console.log(url)
  return axios.post(url);
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
