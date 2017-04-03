const Alexa = require('alexa-sdk');
const constants = require('../constants/constants');

const ping = '<audio src="https://s3.amazonaws.com/dkohlruss/ping.mp3" />';

const tutorialConfessionHandlers = Alexa.CreateStateHandler(constants.states.TUTCONFESS, {
  'LaunchRequest': function() {
    this.emit(':ask', `Now it's time to submit your first Bort.  Say something
    like <break />Say a Bort<break /> or <break />submit a Bort<break />`,
    `To continue, say something like <break />tell a Bort<break /> or <break />
    submit a Bort`);
  },

  'SubmitIntent': function() {
    this.handler.state = constants.states.TUTRECORDING;
    this.emit(':ask', `Ok, I'm going to <phoneme alphabet='x-sampa' ph='"'>record</phoneme> your Bort.  After the beep, you have a few
    seconds to record the Bort. <break /> ${ping}`, `I didn't catch everything you said or you took
    too long, please try again after the beep. <break />  ${ping}`);
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
    this.emit(':ask', 'You are currently learning how to submit Borts. The commands available to you are: Submit, and skip.', 'The commands available to you are: Submit, and skip.');
  },

  'Unhandled': function() {
    this.emitWithState('AMAZON.HelpIntent');
  }

});

module.exports = tutorialConfessionHandlers;
