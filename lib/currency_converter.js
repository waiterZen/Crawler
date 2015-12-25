'use strict';
const Promise = require('bluebird');
const request = require('request');
const cheerio = require('cheerio');

/**
 * CurrencyConverter is for crawler rate from xe.com
 */
class CurrencyConverter {
  /**
   * @constructor
   * @param {string} from - currency code
   * @param {string} to - currency code
   * @param {string} url - url to crawl
   */
  constructor(from, to, url) {
    this.from = from;
    this.to = to;
    this.url = url || `http://www.xe.com/currencyconverter/convert/?Amount=1&From=${from}&To=${to}`;
  }

  /**
   * call for crawl data from ex.com
   * @returns {bluebird|exports|module.exports} Promise - bluebird style promise
   */
  run() {
    const self = this;
    return new Promise(function crawlPage(resolve, reject) {
      request.get(self.url, function (error, response, body) {
        if (error) {
          return reject(error);
        }

        if (response.statusCode === 200) {
          const $ = cheerio.load(body);
          const dom_value = $('.uccRes').children('.rightCol').text();
          const result = {
            from: self.from,
            to: self.to,
            created_at: new Date(),
            rate: dom_value && dom_value.trim().split('\ ')[0]
          };
          // check the rate
          isNaN(parseFloat(result.rate)) ? reject('can not get valid rate value') : resolve(result);
        } else {
          reject(`response code ${response.statusCode}`);
        }
      });
    });
  }
}

module.exports = CurrencyConverter;
