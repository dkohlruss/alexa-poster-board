const request = require('request-promise');
const secrets = require('../constants/secrets');

const getLocationData = function(address) {
  console.log("GET LOCATION DATA FRMO GOOGLE");
  return new Promise((resolve, reject) => {
    request({
    url: 'https://maps.googleapis.com/maps/api/geocode/json',
    method: 'POST',
    qs: {
      key: secrets.key,
      address
      }
    })
    .then((response) => {
      console.log("RESPONSE: " + response);
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
