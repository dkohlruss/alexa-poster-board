const Alexa = require('alexa-sdk');
const constants = require('../constants/constants');
const calculateHotness = require('../helpers/calculateHotness');

const ping = '<audio src="https://s3.amazonaws.com/dkohlruss/ping.mp3" />';

// DB constants
const AWS1 = require('aws-sdk');
const doc = new AWS1.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

const votingHandlers = Alexa.CreateStateHandler(constants.states.VOTING, {

  'LaunchRequest': function() {
    this.handler.state = constants.states.MAIN;
    this.emitWithState('LaunchRequest');
  },

  'UpVotingIntent': function() {
    // Index of confession
    let confessionNum = this.attributes['confessionNum'];

    let params = {
        TableName: constants.confessionDBTableName,
        Key:{
            Id: confessionNum,
        },
        UpdateExpression: `set ups = ups + :val`,
        ExpressionAttributeValues:{
            ':val':1,
        },
        ReturnValues:`ALL_NEW`,
    };

    doc.update(params, (err, data) => {
        if (err) {
            console.log('Update err: ' + JSON.stringify(err, null, 4));
        } else {
            calculateHotness(data);
            this.handler.state = constants.states.MAIN;
            this.emit(':ask', `Thanks for voting! Main menu. Would you like to listen to a popular Bort, submit a new Bort,
                  or get help with additional options?`, `You can listen to a Bort, submit a Bort, or ask for help.`);
        }
    });
  },

  'DownVotingIntent': function() {
    // Index of confession
    let confessionNum = this.attributes['confessionNum'];

    let params = {
        TableName: constants.confessionDBTableName,
        Key:{
            Id: confessionNum,
        },
        UpdateExpression: `set downs = downs + :val`,
        ExpressionAttributeValues:{
            ':val':1,
        },
        ReturnValues:`ALL_NEW`,
    };

    doc.update(params, (err, data) => {
        if (err) {
            console.log('Update err: ' + JSON.stringify(err, null, 4));
        } else {
            calculateHotness(data);
            this.handler.state = constants.states.MAIN;
            this.emit(':ask', `Thanks for voting! Main menu. Would you like to listen to a popular Bort, submit a new Bort,
                  or get help with additional options?`, `You can listen to a Bort, submit a Bort, or ask for help.`);
        }
    });


  },

  'MenuIntent': function() {
    this.handler.state = constants.states.MAIN;
    this.emitWithState('MenuIntent');
  },

  'AMAZON.StopIntent': function() {
    // State automatically saved with tell emit
    this.emit(':tell', 'Goodbye!');
  },

  'AMAZON.CancelIntent': function() {
    this.handler.state = constants.states.MAIN;
    this.emitWithState('LaunchRequest');
  },

  'SessionEndedRequest': function() {
    this.emit(':saveState', false);
  },

  'AMAZON.HelpIntent': function() {
    this.emit(':ask', `You are currently voting on the Bort you just heard. This helps
              keep things fresh for you and other users of this skill. The commands available
              to you are: upvote, downvote, and main menu.`, `The commands available to you are: upvote,
              downvote, and main menu. You can also exit at any time by saying: Stop`);
  },

  'Unhandled': function() {
    this.emitWithState('AMAZON.HelpIntent');
  }

});


module.exports = votingHandlers;
