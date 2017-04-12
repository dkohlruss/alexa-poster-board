const request = require('request-promise');
const secrets = require('../constants/secrets');

const getId = function(increase) {
  console.log("GET ID");
  return new Promise((resolve, reject) => {
    request({
      url: 'http://www.stateful.co/c/confessionCount/inc',
      method: 'GET',
      qs: {
        value: increase
      },
      headers: {
        'X-Sttc-URN': secrets.urn,
        'X-Sttc-Token': secrets.token
      }
    })
    .then((response) => {
      let Id = parseInt(response);
      resolve(Id);
    })
    .catch((err) => {
      reject(err);
    });
  });
}


module.exports = getId;
