'use strict';

const config = require('config');
const _ = require('lodash');
const fivebean_worker = require('fivebeans').worker;
const job_handel = new require('./lib/job_handler');

const TUBE_NAME = config.beansTalkd.tubeName || 'default';

const MAX_FUIFIL = 10;
const MAX_FAIL = 3;
const Period = 60000;
const RETRY = 3000;

const options = {
  id: 'worker:' +  require('crypto').randomBytes(Math.ceil(4)).toString('hex').slice(0,8),
  host: config.beansTalkd.host || '127.0.01',
  port: config.beansTalkd.port || 11300,
  handlers: {
    convert: new job_handel(MAX_FUIFIL, MAX_FAIL, Period, RETRY)
  },
  ignoreDefault: true
};

const worker = new fivebean_worker(options);
worker.start([TUBE_NAME]);

// show event logs
_.forEach(['error', 'close','started', 'stopped',  'info',  'warning',  'job.reserved', 'job.handled', 'job.deleted',  'job.buried'], function(event){
  worker.on(event, function(info){
    console.log(`Event ${event}:`, info ? info : '');
  })
});



