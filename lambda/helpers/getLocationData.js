const request = require('request-promise');
const constants = require('../constants/constants');
const secrets = require('../constants/secrets');

const getLocationData = function(zip) {
  return new Promise((resolve, reject) => {
    request({
    url: 'https://maps.googleapis.com/maps/api/geocode/json',
    method: 'POST',
    qs: {
      key: secrets.key,
      address: zip
      }
    })
    .then((response) => {
      resolve(JSON.parse(response));
    })
    .catch((err) => {
      console.log('err...');
      console.log(err);
      reject(err);
    });
  });
};

module.exports = getLocationData;
