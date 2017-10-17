const Alexa = require('alexa-sdk');
const constants = require('../constants/constants');
const calculateHotness = require('../helpers/calculateHotness');

const ping = '<audio src="https://s3.amazonaws.com/dkohlruss/ping.mp3" />';

// DB constants
const AWS1 = require('aws-sdk');
const doc = new AWS1.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

const votingHandlers = Alexa.CreateStateHandler(constants.states.VOTING, {

  'LaunchRequest': function() {
    console.log('VOTING LAUNCHREQUEST');
    this.handler.state = constants.states.MAIN;
    this.emitWithState('LaunchRequest');
  },

  'UpVotingIntent': function() {
    console.log('VOTING UPVOTINGINTENT');
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
            this.handler.state = constants.states.LISTENING;
            this.emit(':ask', `Thanks for voting! Would you like to listen to another post
                      or return to the main menu?`, `You can listen to a post, return to the main menu, or ask for help.`);
        }
    });
  },

  'DownVotingIntent': function() {
    console.log('VOTING DOWNVOTINGINTENT');
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
            this.handler.state = constants.states.LISTENING;
            this.emit(':ask', `Thanks for voting! Would you like to listen to another post
                      or return to the main menu?`, `You can listen to a post, return to the main menu, or ask for help.`);
        }
    });


  },

  'MenuIntent': function() {
    console.log('VOTING MENUINTENT');
    this.handler.state = constants.states.MAIN;
    this.emitWithState('MenuIntent');
  },

  'AMAZON.StopIntent': function() {
    console.log('VOTING STOPINTENT');
    // State automatically saved with tell emit
    this.emit(':tell', 'Goodbye!');
  },

  'AMAZON.CancelIntent': function() {
    console.log('VOTING CANCELINTENT');
    this.handler.state = constants.states.MAIN;
    this.emitWithState('LaunchRequest');
  },

  'SessionEndedRequest': function() {
    console.log('VOTING SESSIONENDEDREQUEST');
    this.handler.state = constants.states.MAIN;
    this.emit(':saveState', true);
  },

  'AMAZON.HelpIntent': function() {
    console.log('VOTING HELPINTENT');
    this.emit(':ask', `You are currently voting on the post you just heard. This helps
              keep things fresh for you and other users of this skill. The commands available
              to you are: upvote, downvote, and main menu.`, `The commands available to you are: upvote,
              downvote, and main menu. You can also exit at any time by saying: Stop`);
  },

  'Unhandled': function() {
    console.log('VOTING UNHANDLED');
    this.emitWithState('AMAZON.HelpIntent');
  }

});


module.exports = votingHandlers;
