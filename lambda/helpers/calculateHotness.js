const Alexa = require('alexa-sdk');
const constants = require('../constants/constants');
const AWS = require('aws-sdk');
const doc = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

const calculateHotness = function(data) {
  console.log("HOTNESS CALCULATED");
  let confessionNum = data.Attributes.Id;
  let points = data.Attributes.ups - data.Attributes.downs + 2;
  let now = Date.now();
  let hoursPassed = Math.abs(now - data.Attributes.date) / 36e5;
  let hrsPlusThree = hoursPassed + 3; // For base formua, see top comment
  let theNewHotness = points / Math.pow(hrsPlusThree, 1.1); // Formula modified from HackerNews

  let params = {
      TableName: 'ConfessionList',
      Key:{
          Id: confessionNum
      },
      UpdateExpression: `set hotness = :val`,
      ExpressionAttributeValues:{
          ':val': theNewHotness,
      },
      ReturnValues:`ALL_NEW`,
  };

  doc.update(params, (err, data) => {
      if (err) {
          console.log('Update err: ' + JSON.stringify(err, null, 4));
      } else {
          console.log('Update success: ' + JSON.stringify(data, null, 4));
      }
  });
};

module.exports = calculateHotness;
