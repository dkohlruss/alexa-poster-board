const Alexa = require('alexa-sdk');
const constants = require('../constants/constants');
const getId = require('../helpers/getId');
const calculateHotness = require('../helpers/calculateHotness');

const ping = '<audio src="https://s3.amazonaws.com/dkohlruss/ping.mp3" />';

// DB constants
const AWS1 = require('aws-sdk');
const doc = new AWS1.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

const savingHandlers = Alexa.CreateStateHandler(constants.states.SAVING, {

  'LaunchRequest': function() {
    console.log('SAVING LAUNCHREQUEST');
    this.handler.state = constants.states.MAIN;
    this.emitWithState('LaunchRequest');
  },

  'RerecordIntent': function() {
    console.log('SAVING RERECORDINTENT');
    this.handler.state = constants.states.RECORDING;
    this.emit(':ask', `Let's try again.  Just say your Bort after the beep and it will be
              recorded. ${ping}`, `I didn't get your Bort, please try again after the beep. ${ping}`);
  },

  'SaveIntent': function() {
    console.log('SAVING SAVEINTENT');
      let input = this.attributes['input'];
      let lat = this.attributes['lat'];
      let lng = this.attributes['lng'];
      getId(1).then((newId) => {
        let params = {
            Item: {
                    'live': 'yes',
                    'Id': newId,
                    'quote': input,
                    'ups': 1,
                    'downs': 0,
                    'date': Date.now(),
                    'lat': lat,
                    'lng': lng
                },
            TableName: constants.confessionDBTableName,
            };

        doc.put(params, (err, data) => {
            if (err) {
                console.log('Put error: ' + JSON.stringify(err, null, 4));
            } else {
              if (!this.attributes['recorded']) {
                this.attributes['recorded'] = [newId];
              } else {
                this.attributes['recorded'].push(newId);
              }
              calculateHotness({  // Feeding in data manually because data doesn't like to be returned on Put
                Attributes: {     // Initial Hotness rating is ~0.3
                  Id: newId,
                  ups: 1,
                  downs: 0,
                  date: Date.now()
                }
              });
              this.handler.state = constants.states.MAIN;
              this.emit(':ask', `Your latest Bort: ${input} <break /> has been saved and can now be voted on by others.
                        Main menu. Would you like to listen to a popular Bort, submit a new Bort, or get help with
                        additional options?`, `You can listen to a Bort, submit a Bort, or ask for help.`);
          }
        });

      }).catch((err) => {
        console.log('Err generating Id: ' + err);
      });
  },

  'MenuIntent': function() {
    console.log('SAVING MENUINTENT');
    this.handler.state = constants.states.MAIN;
    this.emitWithState('MenuIntent');
  },

  'AMAZON.StopIntent': function() {
    console.log('SAVING STOPINTENT');
    // State automatically saved with tell emit
    this.emit(':tell', 'Goodbye!');
  },

  'AMAZON.CancelIntent': function() {
    console.log('SAVING CANCELINTENT');
    this.handler.state = constants.states.MAIN;
    this.emitWithState('MenuIntent');
  },

  'SessionEndedRequest': function() {
    console.log('SAVING SESSIONENDEDREQUEST');
    // Will save the state when user times out
    this.emit(':saveState', false);
  },

  'AMAZON.HelpIntent': function() {
    console.log('SAVING HELPINTENT');
    let input = this.attributes['input'];
    this.emit(':ask', `You are currently in the saving options for your Bort.
              The Bort currently in memory is: ${ping} ${input}.
              The commands available to you are: save, rerecord, and main menu.`,
              `The commands available to you are: save, rerecord, and main menu.`);
  },

  'Unhandled': function() {
    console.log('SAVING UNHANDLED');
    this.emitWithState('AMAZON.HelpIntent');
  }

});


module.exports = savingHandlers;
