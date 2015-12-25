'use strict';

const seed_handler = new require('./lib/seed_handler');

const seed = {
  type: 'convert',
  payload: {
    from: 'HKD',
    to: 'USD'
  }
};

seed_handler.putSeed(seed).then(function (jobId) {
  console.log('got jobId:', jobId);
}).catch(function (e) {
  console.log('got error when produce seed:', e);
});


