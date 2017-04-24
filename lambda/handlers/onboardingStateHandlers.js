const Alexa = require('alexa-sdk');
const constants = require('../constants/constants');
const getAddress = require('../helpers/getAddress');
const getLocationData = require('../helpers/getLocationData');
const setAddress = require('../helpers/setAddress');
const setUserLocation = require('../helpers/setUserLocation');

const ping = '<audio src="https://s3.amazonaws.com/dkohlruss/ping.mp3" />';

const onboardingHandlers = Alexa.CreateStateHandler(constants.states.ONBOARDING, {

  'NewSession': function() {
    console.log('ONBOARDING NEWSESSION');
    console.log("context: ");
    console.log(JSON.stringify(this.event, null, 4));
    this.attributes['listened'] = [];
    this.attributes['recorded'] = [];

    try {
      let deviceId = this.event.context.System.device.deviceId;
      console.log('device: ' + deviceId);

      console.log('other consent token: ' + this.event.session.user.permissions.consentToken);
      let consentToken = this.event.context.System.user.permissions.consentToken;

      console.log('consentToken: ' + consentToken);

      getAddress(deviceId, consentToken).then((res) => {
        let fullAddress = setAddress(res);
        if (!fullAddress) {
          this.emit(':tell', `It looks like you haven't set your address.  You will need to do so in order to use this skill.`);
        } else {
          this.attributes['address'] = fullAddress;
          getLocationData(fullAddress).then((result) => {
            let location = result.results[0].geometry.location;
            this.attributes['lat'] = location.lat;
            this.attributes['lng'] = location.lng;

            this.attributes['area'] = setUserLocation(location);

            this.handler.state = constants.states.TUTORIAL;
            this.emitWithState('LaunchRequest');
          }).catch((err) => {
            console.log('Error: ' + err);
            this.emit(':tellWithPermissionCard', 'There was a problem getting the address from your Amazon account.  Please check your default Amazon address, as well as your location permissions in the Amazon Alexa app to use this skill.', constants.ALL_ADDRESS_PERMISSION);
          }); // End of getLocation Promise
        }
      }).catch((err) => {
        console.log(err);
        this.emit(':tellWithPermissionCard', 'Please check your location permissions and ensure they are set in the Amazon Alexa app to use this skill.', constants.ALL_ADDRESS_PERMISSION);
      }); // End of getAddress promise
    } catch(err) {
      console.log('No consent token found: ' + err);
      this.emit(':tellWithPermissionCard', 'There was a problem retrieving your address information.  Please ensure your location permissions are set in your Alexa app.', constants.ALL_ADDRESS_PERMISSION);
    }
  },

  'LaunchRequest': function() {
    console.log('ONBOARDING LAUNCHREQUEST');
    this.emitWithState('NewSession');
  },

  'SessionEndedRequest': function() {
    console.log('ONBOARDING SESSIONENDEDREQUEST');
    this.emit(':tell', 'Goodbye!');
  },

  'Unhandled': function() {
    console.log('ONBOARDING UNHANDLED');
    this.emitWithState('NewSession');
  }

});

module.exports = onboardingHandlers;
