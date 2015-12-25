'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
const seed_handler = require('../lib/seed_handler');

chai.use(chaiAsPromised);
describe('test seed_handler', function () {
  this.timeout(15000);

  it('should can run seed_handler, and got jobId', function (done) {
    const seed = {
      type: 'convert',
      payload: {
        from: 'HKD',
        to: 'USD'
      }
    };

    seed_handler.putSeed(seed).then(function (jobId) {
      console.log('got jobId:', jobId);
      expect(jobId).not.to.be.null;
      done();
    }).catch(function (e) {
      console.log('got error:', e);
    });
  });
});