'use strict';
const Promise = require('bluebird');
const config = require('config');
const mongoose = require('mongoose');
const mongodbUri = config.dbConfig;


// set for job runtime environment
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

/**
 * currency schema for mongoose
 */
const Currency_Schema = mongoose.Schema({
  from: String,
  to: String,
  rate: Number,
  created_at: Date
});

// Currency mongoose ROM model
const Currency = mongoose.model('currencies', Currency_Schema);

// connect to mongoDB
mongoose.connect(mongodbUri, options);


// if error will reject
mongoose.connection.on('error', function (error) {
  return  new Pormise.reject(error);
});


/**
 * to save currency data in Currency model
 * @param data
 * @returns {bluebird|exports|module.exports}
 */
function save(data) {
  return new Promise(function (resolve, reject) {


    // set to mongoDB
    (new Currency(data)).save(function (err, result) {
      if (err) {
        return reject(err);
      }
      resolve(result);
    });
  });
}
exports.save = save;
