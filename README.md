# XECrawler
XECrawler is for crawling rate value betweent two currenies from xe.com (Example:[HKD =>USD](http://www.xe.com/currencyconverter/convert/?Amount=1&From=HKD&To=USD))




## Install modules
```
npm install
```
## Run test case
```
npm test
```

## Run producer worker 
```
node producer_worker.js 
```
Will create a new seed.

## Run consumer worker
```
node consumer_worker.js
```
Will get a job from beanstalkd and run job handler.


