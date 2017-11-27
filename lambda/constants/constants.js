var constants = Object.freeze({
	//App ID
	appId: 'amzn1.ask.skill.684a7ced-a776-4011-afef-b7ee65c52610',

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
