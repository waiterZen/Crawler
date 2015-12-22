'use strict';

const _ = require('lodash');
const config = require('config');
const Promise = require('bluebird');
const fiveBeans = require('fivebeans');

const TubeName = config.beansTalkd.tubeName || 'default';
const host = config.beansTalkd.host || '127.0.01';
const port = config.beansTalkd.port || 11300;
const client = new fiveBeans.client(host, port);

const Priority = 0;
const Delay = 0;
const TTR = 60 * 15; // allow time to run, default to 15 minutes

const putSeed = function(seed) {

  return new Promise(function (resolve, reject) {
    client.on('connect', function () {
      client.use(TubeName, function (useError, tubename) {
        if(useError){
          reject(useError);
        }
        client.put(Priority, Delay, TTR, JSON.stringify(seed), function (putError, jobId) {
          if (putError) {
            reject(putError);
          }
          resolve(jobId);
        });
      });
    });
    client.connect();
  });
};
exports.putSeed = putSeed;
