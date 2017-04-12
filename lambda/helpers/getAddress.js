const request = require('request-promise');

const getAddress = function(deviceId, token) {
  let url = `https://api.amazonalexa.com/v1/devices/${deviceId}/settings/address`;
  let auth = `Bearer ${token}`;
  return new Promise((resolve, reject) => {
    request({
      url: url,
      method: 'GET',
      headers: {
        accept: 'application/json',
        authorization: auth
      }
    })
    .then((response) => {
        try {
            console.log("DATA: " + response);
            resolve(JSON.parse(data));
        } catch (err) {
            console.log("ERR: " + err);
            reject(err);
        }
    })
    .catch((err) => {
      console.log("ERR: " + err);
      reject(err);
    });
  });
}

module.exports = getAddress;
