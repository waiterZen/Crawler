'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const expect = chai.expect;
const currency_store = require('../lib/currency_store');
const assert = require('assert');

chai.use(chaiAsPromised);
describe('get dataStore', function () {
  this.timeout(15000);

  it('should can save dataStore object', function (done) {
    currency_store.save({
      from: 'HKN',
      to: 'USD',
      rate: 0.9999,
      created_at: new Date()
    }).then(function(result){
      expect(result).not.to.be.null;
      expect(result._id).not.to.be.null;
      done();
    });
  });

  it('should can throw Error with wrong data format', function (done) {
    currency_store.save('abc').then(function(){
      throw new Error("Expected rejected, it should not be fulfilled");
    }).catch(function (error){
      expect(error).not.to.be.null;
      done();
    });
  });

});
