const request = require('request-promise');

const getId = function(increase) {
  return new Promise((resolve, reject) => {
    request({
      url: 'http://www.stateful.co/c/confessionCount/inc',
      method: 'GET',
      qs: {
        value: increase
      },
      headers: {
        'X-Sttc-URN': SECRETURN,
        'X-Sttc-Token': SECRETTOKEN
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
