'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
const producerWorker = require('../lib/producer_worker');

chai.use(chaiAsPromised);
describe('test producerWorker', function () {
  this.timeout(15000);

  it('should can run producerWorker, and got jobId', function (done) {
    const seed = {
      type: 'convert',
      payload: {
        from: 'HKD',
        to: 'USD'
      }
    };

    producerWorker.putSeed(seed).then(function (jobId) {
      console.log('got jobId:', jobId);
      expect(jobId).not.to.be.null;
      done();
    }).catch(function (e) {
      console.log('got error:', e);
    });
  });
});