const Alexa = require('alexa-sdk');
const constants = require('../constants/constants');

const ping = '<audio src="https://s3.amazonaws.com/dkohlruss/ping.mp3" />';

const tutorialConfessionHandlers = Alexa.CreateStateHandler(constants.states.TUTCONFESS, {
  'LaunchRequest': function() {
    console.log('TUTCONFESS LAUNCHREQUEST');
    this.emit(':ask', `Now it's time to submit your first post.  Say something
    like <break />submit a post<break /> or <break />post a post<break />`,
    `To continue, say something like <break />tell a post<break /> or <break />
    submit a post`);
  },

  'SubmitIntent': function() {
    console.log('TUTCONFESS SUBMITINTENT');
    this.handler.state = constants.states.TUTRECORDING;
    this.emit(':ask', `Ok, I'm going to <phoneme alphabet='x-sampa' ph='"'>record</phoneme> your post.  After the beep, you have a few
    seconds to record the post. <break /> ${ping}`, `I didn't catch everything you said or you took
    too long, please try again after the beep. <break />  ${ping}`);
  },

  'TutorialSkipIntent': function() {
    console.log('TUTCONFESS TUTORIALSKIPINTENT');
    this.handler.state = constants.states.MAIN;
    this.emitWithState('LaunchRequest');
  },

  'AMAZON.StopIntent': function() {
    console.log('TUTCONFESS STOPINTENT');
    // State automatically saved with tell emit
    this.emit(':tell', 'Goodbye!');
  },

  'AMAZON.CancelIntent': function() {
    console.log('TUTCONFESS CANCELINTENT');
    // State automatically saved with tell emit
    this.emit(':tell', 'Goodbye!');
  },

  'SessionEndedRequest': function() {
    console.log('TUTCONFESS SESSIONENDEDREQUEST');
    // Will save the state when user times out
    this.emit(':saveState', true);
  },

  'AMAZON.HelpIntent': function() {
    console.log('TUTCONFESS HELPINTENT');
    this.emit(':ask', 'You are currently learning how to submit posts. The commands available to you are: Submit, and skip.', 'The commands available to you are: Submit, and skip.');
  },

  'Unhandled': function() {
    console.log('TUTCONFESS UNHANDLED');
    this.emitWithState('AMAZON.HelpIntent');
  }

});

module.exports = tutorialConfessionHandlers;
