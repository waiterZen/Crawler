'use strict';

const _ = require('lodash');
const config = require('config');
const Promise = require('bluebird');
const fivebeans = require('fivebeans');

const TUBE_NAME = config.beansTalkd.tubeName || 'default';
const HOST = config.beansTalkd.host || '127.0.01';
const PORT = config.beansTalkd.port || 11300;


// BeansTalk job setting
// more info: https://github.com/ceejbot/fivebeans#put
const PRIORITY = 0;
const DELAY = 0;
const TTR = 60 * 15; // allow time to run, default to 15 minutes
const client = new fivebeans.client(HOST, PORT);


/**
 * to put Seed to Beanstalk
 * @param {object} seed - job info
 * @param {string} [seed.type]-  job type tag, here we default set to 'convert'
 * @param {object} [seed.payload]-  job payload object, contain info the job need.
 * @param {string} [seed.payload.from]-  currency code
 * @param {string} [seed.payload.to]-  currency code
 * @returns {bluebird|exports|module.exports} - bluebird style promise
 */

const putSeed = function putSeed(seed) {
  return new Promise(function (resolve, reject) {
    // 1. connect to Beanstalk
    client.on('connect', function () {
      // 2. use specfic tube;
      client.use(TUBE_NAME, function (useError, tubename) {
        if (useError) {
          return reject(useError);
        }
        // 3. put job
        client.put(PRIORITY, DELAY, TTR, JSON.stringify(seed), function (putError, jobId) {
          if (putError) {
            return reject(putError);
          }
          resolve(jobId);
          // 4. end the connection
          client.end();
        });
      });
    });
    //trigger connection
    client.connect();
  });
};
exports.putSeed = putSeed;
