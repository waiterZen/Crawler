'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
const Currency = require('../lib/currencyStore').Currency;

chai.use(chaiAsPromised);
describe('get dataStore', function () {
  this.timeout(15000);

  it('should can save dataStore object', function (done) {
    let s = new Currency({
      from: 'HKN',
      to: 'USD',
      rate: 0.9999,
      created_at: new Date()
    });

    s.save(function(err,result){
      console.log(err,result);
      Currency.find().where('rate').gt(0).exec(function(err,result){
        expect(result).not.to.be.null;
        done();
      });
    });


  });

});
