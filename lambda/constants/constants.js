var constants = Object.freeze({
  //App ID TODO: Set Your App ID before publishing
  appId: 'amzn1.ask.skill.5d7df2d1-6622-4bdd-be5a-02283739cdb1',

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

  ALL_ADDRESS_PERMISSION: ['read::alexa:device:all:address']
});

module.exports = constants;
