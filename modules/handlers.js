'use strict';

const { response, request } = require('express');
const Results = require('../models/results');
const Dataset = require('../models/dataset');
const axios = require('axios');
require('dotenv').config();

const Handler = {};

Handler.getCity = (req, res) => {
  const resultObj = {
    city: '',
    col_idx: '',
    rent_idx: '',
    col_plus_rent_idx: '',
    groceries_idx: '',
    restaurant_idx: '',
    local_purchasing_pwr_idx: '',
    gas_price: '',
    results_city: ''
  };
  console.log(req.city);
  const config = {
    url: `https://us1.locationiq.com/v1/search.php?key=${process.env.LOCATION_KEY}&q=${req.query.city}&format=json`,
    headers: { 'referer': 'http://localhost:3001/' }
  };
  axios(config)
    .then(response => {
      console.log('Location Response: ', response.data[0]);
      const locationObj = {
        lat: response.data[0].lat,
        lon: response.data[0].lon,
        country: response.data[0].display_name.split(', ')[response.data[0].display_name.split(', ').length - 1]
      };
      resultObj['search_city'] = response.data[0].display_name.split(',')[0];
      getGasPrices(locationObj)
        .then(result => {
          console.log('Gas Price Promise:', result.data[0]);
          result.data[0] ? resultObj['gas_price'] = result.data[0].Price : resultObj['gas_price'] = 'Gas prices not available.';
          console.log('Dataset: ', Dataset);
          console.log('resultObj Object: ', { city: resultObj.search_city });

          try {
            Dataset.find({ city: { $regex: `(?i)${resultObj.search_city}(?-i)` } })
              .then(response => {
                if (response.length > 0) {
                  resultObj.city = response[0].city;
                  resultObj.col_idx = response[0].col_idx;
                  resultObj.rent_idx = response[0].rent_index;
                  resultObj.col_plus_rent_idx = response[0].col_plus_idx;                  ;
                  resultObj.groceries_idx = response[0].groceries_idx;
                  resultObj.restaurant_idx = response[0].restaurant_idx;
                  resultObj.local_purchasing_pwr_idx = response[0].local_purchasing_pwr_idx;
                  res.send(resultObj);
                  console.log('resultObj: ', resultObj);
                }
                else {
                  res.send('City data not found.');
                }
              });
          } catch (error) {
            console.log('Database query error:', error);
          }
        });
    })
    .catch(error => {
      console.log(error);
      res.send(error);
    });
};

const getGasPrices = (locationObj) => {
  try {
    let isUSA = false;

    if (locationObj.country === 'USA') {
      isUSA = true;
    }
    const url = `https://www.gasbuddy.com/gaspricemap/county?lat=${locationObj.lat}&lng=${locationObj.lon}&usa=${isUSA}`;
    console.log(url);
    return axios.post(url);
  } catch (error) {
    console.log('the catch has been triggered! Error: ', error);
  }
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

Handler.handleGetUser = (req, res) => {
  console.log('Getting the user');
  res.send(req.user);
};

Handler.saveCity = async (req,res, next) => {
  console.log('req.body:', req.body);
  console.log(req.user);
  
  try{
    const savedCity = await Results.create({...req.body, user_email: req.user.email, time_stamp: Date.now() });
    res.status(201).send(savedCity);
  } catch(e) {
    console.log('Save City failed!');
    next(e);
  }
}

module.exports = Handler;
