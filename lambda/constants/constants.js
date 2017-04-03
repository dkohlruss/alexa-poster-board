var constants = Object.freeze({
  //App ID TODO: Set Your App ID before publishing
  appId: '',

  // DynamoDB Table name
  dynamoDBTableName: 'Confessions',
  confessionDBTableName: 'ConfessionList',

  // SkilL States
  states: {
    ONBOARDING: '',
    TUTORIAL: '_TUTORIAL',
    MAIN: '_MAIN',
    TUTCONFESS: '_TUTORIAL_CONFESS',
    TUTRECORDING: '_TUTORIAL_RECORDING',
    RECORDING: '_RECORDING',
    LISTENING: '_LISTENING',
    VOTING: '_VOTING',
    SAVING: '_SAVING'
  },

  key: SECRETEKEYGOESHERE
});

module.exports = constants;
