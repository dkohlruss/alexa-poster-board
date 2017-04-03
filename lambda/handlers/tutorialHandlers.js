const Alexa = require('alexa-sdk');
const constants = require('../constants/constants');

const ping = '<audio src="https://s3.amazonaws.com/dkohlruss/ping.mp3" />';

const tutorialHandlers = Alexa.CreateStateHandler(constants.states.TUTORIAL, {

  'LaunchRequest': function() {
    this.emit(':ask', `This is Bort, the interactive skill that lets you share and listen
                      to messages, called Borts, from anonymous Alexa users. Borts are short messages,
                      and they can be jokes, or confessions, or quips. Since you're new at Borting it up,
                      let's go through a quick tutorial.  We will start by listening to a Bort.  Say
                      something like <break /> Listen to a Bort <break /> or just <break />listen.  You
                      can also skip this tutorial by saying <break />skip<break /> or <break />Skip this
                      tutorial.`, `Would you like to continue this tutorial, or skip it?`);
  },

  'ListenIntent': function() {
    this.emit(':ask', `You'll now be presented with a Bort: ${ping} In all honesty, I just don't think
                      Game of Thrones is very good. ${ping} <break />
                      What a scandalous Bort! You can now upvote or downvote this Bort by saying something like <break />
                      Upvote<break /> or <break />Thumbs down<break /> or just <break />I like it.`,
                      `Would you like to upvote or downvote this Bort?`);
  },

  'UpVotingIntent': function() {
    this.handler.state = constants.states.TUTCONFESS;
    this.emit(':ask', `You've upvoted this Bort, that increases its overall score and makes it more
                      likely to be heard by others. Now it's time to submit your own Bort, just for fun.  Say something
                      like <break />Say a Bort<break /> or <break />tell a Bort<break />.`, `To continue, say something
                      like <break />tell a Bort<break /> or <break /> submit my Bort.`);
  },

  'DownVotingIntent': function() {
    this.handler.state = constants.states.TUTCONFESS;
    this.emit(':ask', `You've downvoted this Bort, that decreases its overall score and makes it less
                      likely to be heard by others. Now it's time to submit your own Bort, just for fun.  Say something
                      like <break />Say a Bort<break /> or <break />tell a Bort<break />.`, `To continue, say something
                      like <break />tell a Bort<break /> or <break /> submit my Bort.`);
  },

  'TutorialContinueIntent': function() {
    this.handler.state = constants.states.TUTCONFESS;
    this.emitWithState('LaunchRequest');
  },

  'TutorialSkipIntent': function() {
    this.handler.state = constants.states.MAIN;
    this.emitWithState('MenuIntent');
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
    this.emit(':ask', `You are currently in the tutorial. The commands available to you are: listen, skip, continue, up vote, and down vote.`, `The commands available to you are: listen, skip, continue, up vote, and down vote.`);
  },

  'Unhandled': function() {
    this.emitWithState('AMAZON.HelpIntent');
  }

});


module.exports = tutorialHandlers;
