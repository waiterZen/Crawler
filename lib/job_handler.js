'use strict';

const _ = require('lodash');
const converter = require('./currency_converter');
const currency_store = require('./currency_store');
const Promise = require('bluebird');

/**
 *  jobhandle is plugin for producer_worker.js to handel beanstalkd task.
 *  more info: https://github.com/ceejbot/fivebeans#handlers
 *
 */
class JobHandler {
  /**
   * @constructor
   * type is for beanstalkd payload
   * @param {string} [max_fulfil] - the times need to fulfil.
   * @param {string} [max_reject] - the max times can fail.
   * @param {string} [period] - the normal period should request for rate.
   * @param {string} [fail_retry] - the period after a fail request should try a new request.
   **/
  constructor(max_fulfil, max_reject, period, fail_retry) {
    this.type = 'convert';
    this.Max_Fulfil = max_fulfil;
    this.Max_Reject = max_reject;
    this.Period = period; // default each crawler request period is 6000ms
    this.Fail_Retry = fail_retry; // will retry 3000ms later when fail

  }

  /**
   * work
   * main entrance for handler work
   * @param {object} pay_load - parse from the beanstalk job payload string
   * @param {object} call_back - function object: call_back(action)
   *
   * call_back
   * @param {string} [action] - 'success' | 'bury'
   */
  work(pay_load, call_back) {
    let self = this;
    Promise.coroutine(function* runJob() {
      let fulfil = 0;
      let reject = 0;
      let delay_time = 0;  //delay in the rest of each 6000ms period

      // at most will try Max_Fulfil + Max_Reject times to crawl
      for (let i = 0; i <= self.Max_Fulfil + self.Max_Reject; i++) {
        // check finish or fail
        // action = 'success' when finish Max_Fulfil times fetch
        // action = 'bury' when need to stop the job after fail 3 times
        if (fulfil === self.Max_Fulfil || reject === self.Max_Reject) {
          const action = (fulfil === self.Max_Fulfil) ? 'success' : 'bury';
          return call_back(action);
        }

        // delay for each next period start.
        console.log('will delay:', delay_time);
        yield Promise.delay(delay_time);
        console.log('finish delay');

        // start to run
        console.log('==========================================================');
        console.log('Job run times:', i, ' fulfil:', fulfil, ' reject:', reject);
        console.log('==========================================================');
        let start = new Date();
        delay_time = self.Period;
        console.log('starting');

        try{
          // 1. get rate from ex.com
          let data = yield (new converter(pay_load.from, pay_load.to)).run();
          console.log("finishing get rate.");
          console.log('get rate:', data);

          // 2. save to mongoDB
          if(data && data.rate){
            yield currency_store.save(data);
            console.log('saved to mongoDB~!');
            fulfil += 1;
          }

          // recalc next time to run
          delay_time = delay_time -  ((new Date()).getTime() -  start.getTime());
        }catch(e){
          // if catch converter error, or save mongodb error
          console.log("catch error:",e);
          reject += 1;
          delay_time = self.Fail_Retry;
        };
      };
    })();
  }

}




module.exports = JobHandler;

