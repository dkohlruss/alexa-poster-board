const Alexa = require('alexa-sdk');
const constants = require('../constants/constants');

const ping = '<audio src="https://s3.amazonaws.com/dkohlruss/ping.mp3" />';

const tutorialHandlers = Alexa.CreateStateHandler(constants.states.TUTORIAL, {

  'LaunchRequest': function() {
    console.log('TUTORIAL LAUNCHREQUEST');
    this.emit(':ask', `This is Bulletin Board, the interactive skill that lets you share and listen
                      to messages from anonymous Alexa users in your area. Since you're new or requested help,
                      let's go through a quick tutorial.  We will start by listening to a message.  Say
                      something like <break /> Listen to a message <break /> or just <break />listen.  You
                      can also skip this tutorial by saying <break />skip<break /> or <break />Skip this
                      tutorial.`, `Would you like to continue this tutorial, or skip it?`);
  },

  'ListenIntent': function() {
    console.log('TUTORIAL LISTENINTENT');
    this.emit(':ask', `You'll now be presented with a message: ${ping} In all honesty, I just don't think
                      Game of Thrones is very good. ${ping} <break />
                      What a scandalous message! You can now upvote or downvote this message by saying something like <break />
                      Upvote<break /> or <break />Thumbs down<break /> or just <break />I like it.`,
                      `Would you like to upvote or downvote this message?`);
  },

  'UpVotingIntent': function() {
    console.log('TUTORIAL UPVOTINGINTENT');
    this.handler.state = constants.states.TUTCONFESS;
    this.emit(':ask', `You've upvoted this message, that increases its overall score and makes it more
                      likely to be heard by others. Now it's time to submit your own message, just for fun.  Say something
                      like <break />Submit a message<break /> or <break />post a message<break />.`, `To continue, say something
                      like <break />post a message<break /> or <break /> submit my message.`);
  },

  'DownVotingIntent': function() {
    console.log('TUTORIAL DOWNVOTINGINTENT');
    this.handler.state = constants.states.TUTCONFESS;
    this.emit(':ask', `You've downvoted this message, that decreases its overall score and makes it less
                      likely to be heard by others. Now it's time to submit your own message, just for fun.  Say something
                      like <break />Say a message<break /> or <break />tell a message<break />.`, `To continue, say something
                      like <break />post a message<break /> or <break /> submit my message.`);
  },

  'TutorialContinueIntent': function() {
    console.log('TUTORIAL CONTINUEINTENT');
    this.handler.state = constants.states.TUTCONFESS;
    this.emitWithState('LaunchRequest');
  },

  'TutorialSkipIntent': function() {
    console.log('TUTORIAL SKIPINTENT');
    this.handler.state = constants.states.MAIN;
    this.emitWithState('MenuIntent');
  },

  'AMAZON.StopIntent': function() {
    console.log('TUTORIAL STOPINTENT');
    // State automatically saved with tell emit
    this.emit(':tell', 'Goodbye!');
  },

  'AMAZON.CancelIntent': function() {
    console.log('TUTORIAL CANCELINTENT');
    // State automatically saved with tell emit
    this.emit(':tell', 'Goodbye!');
  },

  'SessionEndedRequest': function() {
    console.log('TUTORIAL SESSIONENDEDREQUEST');
    // Will save the state when user times out
    this.emit(':saveState', true);
  },

  'AMAZON.HelpIntent': function() {
    console.log('TUTORIAL HELPINTENT');
    this.emit(':ask', `Bulletin Board is an interactive, anonymous, localized messaging system.
    You are currently in the tutorial. The commands available to you are: listen, skip,
    continue, up vote, and down vote. You can also exit at any time by saying <break /> stop.
    Which would you like to do?`, `The commands available to you are: listen, skip, continue,
    up vote, and down vote. Which would you like to do?`);
  },

  'Unhandled': function() {
    console.log('TUTORIAL UNHANDLED');
    this.emitWithState('AMAZON.HelpIntent');
  }

});


module.exports = tutorialHandlers;
