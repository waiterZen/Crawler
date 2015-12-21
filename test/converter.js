'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
const converter = require('../lib/converter');

chai.use(chaiAsPromised);
describe('get currency data', function () {
  // it's slow when curl data in mainland China;
  this.timeout(15000);

  it('get new converter object', function (done) {
    let converterInstance = new converter('HKD', 'USD');

    converterInstance.run().then(function (result) {
      console.log(`get current rate:`,result);
      expect(result).not.to.be.null;
      expect(result.rate).to.be.above(0);
      done();
    }).catch((e)=>{console.log(e);});
  });

});
