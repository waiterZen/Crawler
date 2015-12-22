'use strict';

const _ = require('lodash');
const config = require('config');
const Promise = require('bluebird');
const converter = require('./converter');
const Currency = require('./currencyStore').Currency;

const MaxFulfil = 10;
const MaxReject = 3;
const Period = 6000;



function jobHandler() {
  this.type = 'convert currency';
}

jobHandler.prototype.work = function (payload, callback) {

    Promise.coroutine(function *(){
      let fulfil = 0;
      let reject = 0;
       for( let i = 0; i <= 10; i++){
         console.log("time:", i, " fulfil:", fulfil, " reject:", reject);
         if(fulfil === 10){
           return callback('success');
         }
         if(reject === 3){
           return callback('bury');
         }

         let converterInstance = new converter(payload.from, payload.to);
         let start = new Date();
         let delayTime = Period;
         console.log("starting");
         let data = yield converterInstance.run();
         console.log("finishing");

         if(data){
           fulfil += 1;
           let currencyInstance = new Currency(data);
           yield currencyInstance.save();
           console.log('saved~!');
           delayTime = delayTime -  ((new Date()).getTime() -  start.getTime());

         }else{
           reject += 1;
           delayTime = 3000;
         }
         console.log('get convert:', data);
         console.log('will delay:', delayTime);
         yield Promise.delay(delayTime);
         console.log('finish delay');
       }
      })().catch(function(e){
        console.log("finally catch:",e);
      });


}


module.exports = jobHandler;

