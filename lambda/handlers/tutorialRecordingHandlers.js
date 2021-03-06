const Alexa = require('alexa-sdk');
const constants = require('../constants/constants');

const ping = '<audio src="https://s3.amazonaws.com/dkohlruss/ping.mp3" />';

const tutorialRecordingHandlers = Alexa.CreateStateHandler(constants.states.TUTRECORDING, {
  'LaunchRequest': function() {
    console.log('TUTRECORDING LAUNCHREQUEST');
    this.emit(':ask', `You are about to record a post as a part of the tutorial.  Don't worry,
              this post won't be saved, it's just for pretend.  Just say it after the beep and
              it will be recorded. ${ping}`, `Tell me your post, please. ${ping}`);
  },

  'InputIntent': function() {
    console.log('TUTRECORDING INPUTINTENT');
    const input = this.event.request.intent.slots.input.value;

    this.handler.state = constants.states.MAIN;
    this.emit(':ask', `You said: ${input}. Since this is just the tutorial, it won't be saved.
              You can come back to the tutorial at any time by saying <break /> tutorial <break />
              in the main menu.  Main Menu: Would you like to listen to a post,
              or submit a post?  You can also ask for more information about this skill.`,
              `Would you like to listen to a post, submit a post, or get more information about Poster Board?`);
  },

  'TutorialSkipIntent': function() {
    console.log('TUTRECORDING TUTORIALSKIPINTENT');
    this.handler.state = constants.states.MAIN;
    this.emitWithState('LaunchRequest');
  },

  'AMAZON.StopIntent': function() {
    console.log('TUTRECORDING STOPINTENT');
    // State automatically saved with tell emit
    this.emit(':tell', 'Goodbye!');
  },

  'AMAZON.CancelIntent': function() {
    console.log('TUTRECORDING CANCELINTENT');
    // State automatically saved with tell emit
    this.emit(':tell', 'Goodbye!');
  },

  'SessionEndedRequest': function() {
    console.log('RECORDING SESSIONENDEDREQUEST');
    // Will save the state when user times out
    this.emit(':saveState', true);
  },

  'AMAZON.HelpIntent': function() {
    console.log('RECORDING HELPINTENT');
    this.emit(':ask', 'You are currently submitting a sample post as a part of the tutorial. If you are hearing this after trying to submit a post, please try again. You can either state a sample post or skip the tutorial.', 'You can either skip the tutorial or state a sample post.');
  },

  'Unhandled': function() {
    console.log('RECORDING UNHANDLED');
    this.emitWithState('AMAZON.HelpIntent');
  }

});

module.exports = tutorialRecordingHandlers;
