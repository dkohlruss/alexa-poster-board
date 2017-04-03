const request = require('request-promise');

const getPostal = function(token) {
  return new Promise((resolve, reject) => {
    request({
      url: 'https://api.amazon.com/user/profile',
      method: 'GET',
      qs: {
        'access_token': token
      }
    })
    .then((response, body) => {
      resolve(JSON.parse(response));
    })
    .catch((err) => {
      reject(err);
    });
  });
}


module.exports = getPostal;
