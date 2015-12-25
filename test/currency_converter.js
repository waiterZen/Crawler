'use strict';

const chai = require('chai');
const chai_as_promised = require('chai-as-promised');
const expect = chai.expect;
const converter = require('../lib/currency_converter');

chai.use(chai_as_promised);

describe('get currency data', function () {
  // it's slow when curl data in mainland China;
  this.timeout(15000);

  it('get new converter object', function (done) {
    let converter_instance = new converter('HKD', 'USD');

    converter_instance.run().then(function (result) {
      console.log(`result: ${JSON.stringify(result)}`);
      expect(result).not.to.be.null;
      expect(result.rate).to.be.above(0);
      done();
    });
  });

  it('expect throw error with wrong url', function (done) {
    let converter_instance = new converter('HKD', 'USD', 'http://news.ycombinator.com');
    converter_instance.run().then(function(){
      throw new Error("Expected rejected, it should not be fulfilled");
    }).catch(function(e){
      expect(new Error(e)).to.eql(new Error('can not get valid rate value'));
      done();
    });
  });

});
