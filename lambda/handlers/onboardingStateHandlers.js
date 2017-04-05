const Alexa = require('alexa-sdk');
const constants = require('../constants/constants');
const getPostal = require('../helpers/getPostal');
const getAddress = require('../helpers/getAddress');
const getLocationData = require('../helpers/getLocationData');
const setUserLocation = require('../helpers/setUserLocation');

const ping = '<audio src="https://s3.amazonaws.com/dkohlruss/ping.mp3" />';

const onboardingHandlers = Alexa.CreateStateHandler(constants.states.ONBOARDING, {

  'NewSession': function() {
    this.attributes['listened'] = [];
    this.attributes['recorded'] = [];
    let deviceId = this.event.context.System.device.deviceId;
    let consentToken = this.event.context.System.user.permissions.consentToken;

    if (!consentToken || consentToken === undefined) {
      this.emit(':tell', 'Please enable Location permissions for this skill in the Amazon Alexa app.');
    }

    getAddress(deviceId, consentToken).then((res) => {
      let fullAddress = `${res.addressLine1} ${res.addressLine2} ${res.addressLine3} ${res.city} ${res.districtOrCounty} ${res.stateOrRegion} ${res.countryCode}`;
      if (!fullAddress) {
        this.emit(':tell', `It looks like you haven't set your address.  You will need to do so in order to use this skill.`);
      }

        this.attributes['address'] = fullAddress;

        getLocationData(fullAddress).then((result) => {
            let locationData = {
              bounds: result.results[0].geometry.bounds,
              location: result.results[0].geometry.location
            };

              this.attributes['lat'] = locationData.location.lat;
              this.attributes['lng'] = locationData.location.lng;

              this.attributes['area'] = setUserLocation(locationData);

              this.handler.state = constants.states.TUTORIAL;
              this.emitWithState('LaunchRequest');
            }).catch((err) => {
              console.log(err);
            });
    }).catch((err) => {
      this.emit(':tell', 'Please check your Location permissions and ensure they are set in the Amazon Alexa app to use this skill.');
      console.log(err);
    });
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
