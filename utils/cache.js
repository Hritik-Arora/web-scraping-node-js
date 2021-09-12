const https = require('https');
const cheerio  = require('cheerio');

const statesIndexToDataMap = {
    0: 'state',
    1: 'activeCases',
    2: 'cured',
    3: 'deaths',
};

let covidData = {};
// Will initialise the interval for scraping covid data
const init = () => {
    // Refreshing the data every 10 minutes
    storeCovidDataInCache();
    setInterval(storeCovidDataInCache, 600000);
};

const storeCovidDataInCache = () => {
    const reqOptions = {
        hostname: 'www.mohfw.gov.in',
        port: 443,
        path: '/',
        method: 'GET'
    };
    const req = https.request(reqOptions, res => {
        let html = '';
        res.on('data', d => {
          html += d;
        });
        res.on('end', () => {
          const $ = cheerio.load(html);
          const statesListStr = $('#state-data').html();
          let startIndex = 0;
          for (let i=1;i<=35;i++) {
            let indexOfState = statesListStr.indexOf(`<td>${i}<\/td>`, startIndex);
            while (true) {
                if (statesListStr[indexOfState] === '>' && statesListStr[indexOfState - 3] === '/') {
                    indexOfState++;
                    break;
                }
                indexOfState++;
            }
            const stateData = {};
            let currIndex = indexOfState;
            for (let j=0;j<4;j++) {
            currIndex+=6;
            const updatedIndex = statesListStr.indexOf('</td>', currIndex);
            const subStr = statesListStr.substring(currIndex, updatedIndex);
            stateData[statesIndexToDataMap[j]] = subStr;
            currIndex = updatedIndex + 5;
            }
            covidData = {
                ...covidData,
                [i]: {...stateData},
            };
            startIndex = currIndex;
          }
        });
      });
      
      req.on('error', error => {
        console.error(error)
      });
      
      req.end();
};

const getCovidDatafromCache = () => {
    return covidData;
};

module.exports = {
    init,
    storeCovidDataInCache,
    getCovidDatafromCache,
};
