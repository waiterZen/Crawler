'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
const job_handler = require('../lib/job_handler');
const seed_handler = require('../lib/seed_handler');


chai.use(chaiAsPromised);

describe('test job_handler', function () {
  // the test would need more time. so set to 10 minutes
  this.timeout(600000);
  before('add new job', function(done){
    const seed = {
      type: 'convert',
      payload: {
        from: 'HKD',
        to: 'USD'
      }
    };

    seed_handler.putSeed(seed).then(function (jobId) {
      console.log('create new jobId:', jobId);
      done();
    });
  });

  it('should can run job_handler', function (done) {
    // set max_fulfil = 2, max_fail = 1, period = 10000ms to accelerate test.
    const handler = new job_handler(2, 1, 10000, 3000);
    // build pay_load for test;
    const pay_load = {from: 'HKD', to: 'USD'};
    handler.work(pay_load, function(result) {
      console.log(result,"finish");
      expect(result).to.equal('success');
      done();
    });
  });

});