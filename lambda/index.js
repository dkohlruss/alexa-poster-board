const Alexa = require('alexa-sdk');
const constants = require('./constants/constants.js');
const onboardingStateHandlers = require('./handlers/onboardingStateHandlers');
const tutorialHandlers = require('./handlers/tutorialHandlers');
const tutorialConfessionHandlers = require('./handlers/tutorialConfessionHandlers');
const tutorialRecordingHandlers = require('./handlers/tutorialRecordingHandlers');
const mainStateHandlers = require('./handlers/mainStateHandlers');
const listenHandlers = require('./handlers/listenHandlers');
const votingHandlers = require('./handlers/votingHandlers');
const recordingHandlers = require('./handlers/recordingHandlers');
const savingHandlers = require('./handlers/savingHandlers');

exports.handler = function(event, context, callback) {
  var alexa = Alexa.handler(event, context);

  alexa.appId = constants.appId;
  alexa.dynamoDBTableName = constants.dynamoDBTableName;

  alexa.registerHandlers(
    onboardingStateHandlers,
    tutorialHandlers,
    tutorialConfessionHandlers,
    tutorialRecordingHandlers,
    mainStateHandlers,
    listenHandlers,
    votingHandlers,
    recordingHandlers,
    savingHandlers
  );

  alexa.execute();
};
