'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
const producerWorker = require('../lib/producerWorker');

chai.use(chaiAsPromised);
describe('test producerWorker', function () {
  this.timeout(15000);

  it('should can save run producerWorker', function (done) {
    const seed = {
      type: 'convert',
      payload:{
        from: 'HKN',
        to: 'USD'
      }
    };
    producerWorker.putSeed(seed).then(function(jobId){
      console.log("got jobId:", jobId);
      expect(jobId).not.to.be.null;
      done();
    }).catch(function(e) {
      console.log("got error:", e);
    });
  });

});
