const request = require('request-promise');

const getAddress = function(deviceId, token) {

  let url = `https://api.amazonalexa.com/v1/devices/${deviceId}/settings/address`;
  let auth = `Bearer Atc|${token}|`;
  return new Promise((resolve, reject) => {
    request({
      url: url,
      method: 'GET',
      qs: {
        'authorization': auth
      }
    })
    .then((response, body) => {
      resolve(response);
    })
    .catch((err) => {
      reject(err);
    });
  });
}


module.exports = getAddress;
