const Alexa = require('alexa-sdk');
const constants = require('../constants/constants');

const ping = '<audio src="https://s3.amazonaws.com/dkohlruss/ping.mp3" />';

const recordingHandlers = Alexa.CreateStateHandler(constants.states.RECORDING, {

  'LaunchRequest': function() {
    console.log('RECORDING LAUNCHREQUEST');
    this.handler.state = constants.states.MAIN;
    this.emitWithState('LaunchRequest');
  },

  'InputIntent': function() {
    console.log('RECORDING INPUTINTENT');
    const input = this.event.request.intent.slots.input.value;
    this.attributes['input'] = input;

    this.handler.state = constants.states.SAVING;
    this.emit(':ask', `The post I heard was: ${input}. You can save this, <phoneme alphabet="ipa" ph="rəˈkɔrd">record</phoneme> again, or return
              to the main menu.`, `You can either save your post, <phoneme alphabet="ipa" ph="rəˈkɔrd">record</phoneme> again, or
              go back to the main menu.`);
  },

  'MenuIntent': function() {
    console.log('RECORDING MENUINTENT');
    this.handler.state = constants.states.MAIN;
    this.emit(':ask', `Returning to the main menu. Would you like to listen to a popular meesage, submit a new post,
          or get help with additional options?`, `You can listen to a post, submit a post, or ask for help.`);
  },

  'AMAZON.StopIntent': function() {
    console.log('RECORDING STOPINTENT');
    // State automatically saved with tell emit
    this.emit(':tell', 'Goodbye!');
  },

  'AMAZON.CancelIntent': function() {
    console.log('RECORDING CANCELINTENT');
    this.handler.state = constants.states.MAIN;
    this.emitWithState('LaunchRequest');
  },

  'SessionEndedRequest': function() {
    console.log('RECORDING SESSIONENDEDREQUEST');
    // Will save the state when user times out
    this.emit(':saveState', false);
  },

  'AMAZON.HelpIntent': function() {
    console.log('RECORDING HELPINTENT');
    this.emit(':ask', `You're currently recording a post. To record the post, all you have to do is say
              it.  You can also return to the main menu by saying: main menu.`, `Try to say your post again,
              or go back to the main menu. You can also exit by saying: Stop`);
  },

  'Unhandled': function() {
    console.log('RECORDING UNHANDLED');
    this.emit(':ask', `I didn't quite get what you said. You'll have to repeat your post or go back to
              the main menu.`, `Try to say your post again, or go back to the main menu. You can also
              exit by saying: Stop`);
  }

});


module.exports = recordingHandlers;
