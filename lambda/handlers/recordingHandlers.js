const Alexa = require('alexa-sdk');
const constants = require('../constants/constants');

const ping = '<audio src="https://s3.amazonaws.com/dkohlruss/ping.mp3" />';

const recordingHandlers = Alexa.CreateStateHandler(constants.states.RECORDING, {

  'LaunchRequest': function() {
    this.handler.state = constants.states.MAIN;
    this.emitWithState('LaunchRequest');
  },

  'InputIntent': function() {
    const input = this.event.request.intent.slots.input.value;
    this.attributes['input'] = input;

    this.handler.state = constants.states.SAVING;
    this.emit(':ask', `The Bort I heard was: ${input}. You can save this, <phoneme alphabet="ipa" ph="rəˈkɔrd">record</phoneme> again, or return
              to the main menu.`, `You can either save your Bort, <phoneme alphabet="ipa" ph="rəˈkɔrd">record</phoneme> again, or
              go back to the main menu.`);
  },

  'MenuIntent': function() {
    this.handler.state = constants.states.MAIN;
    this.emit(':ask', `Returning to the main menu. Would you like to listen to a popular Bort, submit a new Bort,
          or get help with additional options?`, `You can listen to a Bort, submit a Bort, or ask for help.`);
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
    // Will save the state when user times out
    this.emit(':saveState', false);
  },

  'AMAZON.HelpIntent': function() {
    this.emit(':ask', `You're currently recording a bort. To record the Bort, all you have to do is say
              it.  You can also return to the main menu by saying: main menu.`, `Try to say your Bort again,
              or go back to the main menu. You can also exit by saying: Stop`);
  },

  'Unhandled': function() {
    this.emit(':ask', `I didn't quite get what you said. You'll have to repeat your Bort or go back to
              the main menu.`, `Try to say your Bort again, or go back to the main menu. You can also
              exit by saying: Stop`);
  }

});


module.exports = recordingHandlers;
