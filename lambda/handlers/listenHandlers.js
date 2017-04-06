const Alexa = require('alexa-sdk');
const _ = require('lodash');
const constants = require('../constants/constants');
const getId = require('../helpers/getId');

const ping = '<audio src="https://s3.amazonaws.com/dkohlruss/ping.mp3" />';

// DB constants
const AWS1 = require('aws-sdk');
const doc = new AWS1.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

const listenHandlers = Alexa.CreateStateHandler(constants.states.LISTENING, {

  'LaunchRequest': function() {
    this.handler.state = constants.states.MAIN;
    this.emitWithState('LaunchRequest');
  },

  'ListenIntent': function() {
    let lngEast = this.attributes['area'].east;
    let lngWest = this.attributes['area'].west;

    let params = {
      TableName: constants.confessionDBTableName,
      IndexName: 'ConfessionByLng',
      KeyConditionExpression: '#primarykey = :primarykeyval AND #sortkeyname between :west and :east',
      ExpressionAttributeNames: {
        '#primarykey': 'live',
        '#sortkeyname': 'lng',
      },
      ExpressionAttributeValues: {
        ':primarykeyval': 'yes',
        ':east': lngEast,
        ':west': lngWest
      },
      Limit: 50,
      ScanIndexForward: false
    }

    doc.query(params, (err, data) => {
      if (err) {
        console.log('Get error: ' + JSON.stringify(err, null, 4));
      } else {
        let quotes = data.Items;
        let latNorth = this.attributes['area'].north;
        let latSouth = this.attributes['area'].south;

        quotes = _.filter(quotes, function(obj) {
              return (obj.lat <= latNorth && obj.lat >= latSouth);
            });
        quotes = _.sortBy(quotes, [function(obj) { return obj.hotness; }]);

        let listenedArr = this.attributes['listened'];
        for (let i = 0; i < quotes.length; i++) {
          if (listenedArr.indexOf(quotes[i].Id) === -1) {
            // Add Id to user's listened array, set user's confessionNum to Id, play quote, and send to voting
            listenedArr.push(quotes[i].Id);
            this.attributes['confessionNum'] = quotes[i].Id;
            let quote = quotes[i].quote;

            this.handler.state = constants.states.VOTING;
            this.emit(':ask', `Here is your Bort: ${ping} ${quote} <break /> ${ping} <break />
                        Would you like to upvote or downvote this Bort.`, `Would you like to upvote
                        or downvote the Bort you just heard?`);
            break;
          }
        }
        this.handler.state = constants.states.MAIN;
        this.emit(':ask', `You've listened to all available Borts.  Please try again later.  Main menu:
                  Would you like to listen to a Bort, submit a Bort, or get help with additional options?`,
                  `You can listen to a Bort, submit a Bort, or ask for help.`);
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
    this.emitWithState('MenuIntent');
  },

  'SessionEndedRequest': function() {
    // Will save the state when user times out
    this.emit(':saveState', false);
  },

  'AMAZON.HelpIntent': function() {
    this.emit(':ask', `You are currently listening to Borts. You can either listen to a
              Bort, or return to the Main Menu.`, `The commands available to you are:
              listen, and main menu. You can exit at any time by saying: stop`);
  },

  'Unhandled': function() {
    this.emitWithState('AMAZON.HelpIntent');
  }

});


module.exports = listenHandlers;
