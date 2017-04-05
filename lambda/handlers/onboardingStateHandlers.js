const Alexa = require('alexa-sdk');
const constants = require('../constants/constants');
const getAddress = require('../helpers/getAddress');
const getLocationData = require('../helpers/getLocationData');
const setAddress = require('../helpers/setAddress');
const setUserLocation = require('../helpers/setUserLocation');

const ping = '<audio src="https://s3.amazonaws.com/dkohlruss/ping.mp3" />';

const onboardingHandlers = Alexa.CreateStateHandler(constants.states.ONBOARDING, {

  'NewSession': function() {
    this.attributes['listened'] = [];
    this.attributes['recorded'] = [];
    let deviceId = this.event.context.System.device.deviceId;
    let consentToken = this.event.context.System.user.permissions.consentToken;

    console.log(consentToken);
    if (!consentToken) {
      console.log('No consent token found.  Value: ' + consentToken);
      this.emit(':tellWithPermissionCard', 'Please enable Location permissions for this skill in the Amazon Alexa app.', constants.ALL_ADDRESS_PERMISSION);
    } else {

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
            console.log(err);
          }); // End of getLocation Promise
        }
      }).catch((err) => {
        this.emit(':tellWithPermissionCard', 'Please check your Location permissions and ensure they are set in the Amazon Alexa app to use this skill.');
        console.log(err);
      }); // End of getAddress promise
    }
  },

  'Unhandled': function() {
    if (!this.attributes['listened']) {
      this.attributes['listened'] = [0];
    }
    this.handler.state = constants.states.TUTORIAL;
    this.emitWithState('LaunchRequest')
  }

});

module.exports = onboardingHandlers;
