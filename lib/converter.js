'use strict';
const Promise = require('bluebird');
const request = require('request');
const cheerio = require('cheerio');


class Converter {
  constructor(from, to) {
    this.from = from;
    this.to = to;
    this.url = `http://www.xe.com/currencyconverter/convert/?Amount=1&From=${from}&To=${to}`;
  }

  run() {
    const self = this;
    return new Promise(function visitPage(resolve, reject) {
      request.get(self.url, function (error, response, body) {
        if (error) {
          reject(error);
        }

        if (response.statusCode === 200) {
          const $ = cheerio.load(body);
          const dom_value = $('.uccRes').children('.rightCol').text();
          const rate = dom_value.trim().split('\ ')[0];
          const result = {
            from: self.from,
            to: self.to,
            created_at: new Date(),
            rate: rate
          };
          resolve(result);
        }
      });
    });
  }
}

module.exports = Converter;
