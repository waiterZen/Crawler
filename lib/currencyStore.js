'use strict';
const Promise = require('bluebird');
const config = require('config');
const mongoose = require('mongoose');
const mongodbUri = config.dbConfig;


// for job setting
const options = {
  server: {
    socketOptions: {
      keepAlive: 1,
      connectTimeoutMS: 30000
    }
  },
  replset: {
    socketOptions: {
      keepAlive: 1,
      connectTimeoutMS: 30000
    }
  }
};

mongoose.connect(mongodbUri, options);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

const currencySchema = mongoose.Schema({
  from: String,
  to: String,
  rate: Number,
  created_at: Date
});

const Currency = mongoose.model('currencies', currencySchema);

exports.Currency = Currency;