'use strict';

const config = require('config');
const _ = require('lodash');
const consumerWorker = require('fivebeans').worker;
const TubeName = config.beansTalkd.tubeName || 'default';
const jobHandler = new require('./job_handler');



function EmitKeysHandler()
{
  this.type = 'convert currency';
}
EmitKeysHandler.prototype.work = function(payload, callback)
{
  var keys = Object.keys(payload);
  for (var i = 0; i < keys.length; i++)
    console.log(keys[i]);
  callback('success');
}


const options = {
  id: TubeName,
  host: config.beansTalkd.host || '127.0.01',
  port: config.beansTalkd.port || 11300,
  handlers: {
    convert: new jobHandler()
  },
  ignoreDefault: true
}

const worker = new consumerWorker(options);
worker.start([TubeName]);

_.forEach(['error', 'close','started', 'stopped',  'info',  'warning',  'job.reserved', 'job.handled', 'job.deleted',  'job.buried'], function(event){
  worker.on(event, function(a,b){
    console.log(`in ${event}`, a, b);

  })
});



