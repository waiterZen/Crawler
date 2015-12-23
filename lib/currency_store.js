'use strict';
const Promise = require('bluebird');
const config = require('config');
const mongoose = require('mongoose');
const mongodbUri = config.dbConfig;

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


function save(data){
  return new Promise(function(resolve, reject){
    const currencySchema = mongoose.Schema({
      from: String,
      to: String,
      rate: Number,
      created_at: Date
    });
    const Currency = mongoose.model('currencies', currencySchema);

    mongoose.connection.on('error', function(error){
       reject(error);
    });

    mongoose.connect(mongodbUri, options);
    (new Currency(data)).save(function(err,result){
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });

}

exports.save = save;