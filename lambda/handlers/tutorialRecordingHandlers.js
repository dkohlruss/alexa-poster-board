const Alexa = require('alexa-sdk');
const constants = require('../constants/constants');

const ping = '<audio src="https://s3.amazonaws.com/dkohlruss/ping.mp3" />';

const tutorialRecordingHandlers = Alexa.CreateStateHandler(constants.states.TUTRECORDING, {
  'LaunchRequest': function() {
    this.emit(':ask', `You are about to record a Bort as a part of the tutorial.  Don't worry,
              this Bort won't be saved, it's just for pretend.  Just say it after the beep and
              it will be recorded. ${ping}`, `Tell me your Bort, please. ${ping}`);
  },

  'InputIntent': function() {
    const input = this.event.request.intent.slots.input.value;

    this.handler.state = constants.states.MAIN;
    this.emit(':ask', `You said: ${input}. Since this is just the tutorial, it won't be saved.
              You can come back to the tutorial at any time by saying <break /> tutorial <break />
              in the main menu.  Main Menu: Would you like to listen to a Bort,
              or submit a Bort?  You can also ask for more information about this skill.`,
              `Would you like to listen to a Bort, submit a Bort, or get more information about Bort?`);
  },

  'TutorialSkipIntent': function() {
    this.handler.state = constants.states.MAIN;
    this.emitWithState('LaunchRequest');
  },

  'AMAZON.StopIntent': function() {
    // State automatically saved with tell emit
    this.emit(':tell', 'Goodbye!');
  },

  'AMAZON.CancelIntent': function() {
    // State automatically saved with tell emit
    this.emit(':tell', 'Goodbye!');
  },

  'SessionEndedRequest': function() {
    // Will save the state when user times out
    this.emit(':saveState', true);
  },

  'AMAZON.HelpIntent': function() {
    this.emit(':ask', 'You are currently submitting a sample Bort as a part of the tutorial. If you are hearing this after trying to submit a Bort, please try again. You can either state a sample Bort or skip the tutorial.', 'You can either skip the tutorial or state a sample Bort.');
  },

  'Unhandled': function() {
    this.emitWithState('AMAZON.HelpIntent');
  }

});

module.exports = tutorialRecordingHandlers;
