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

    getAddress(deviceId, consentToken).then((res) => {
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
      this.emit(':tell', 'Sorry, there was a problem getting your address');
      console.log(err);
    });

    // if (this.event.session.user.accessToken == undefined) {
    //   this.emit(':tellWithLinkAccountCard', `To begin to Bort, please use the companion
    //   app to authenticate on Amazon.`);
    // } else {
    //   let token = this.event.session.user.accessToken;
    //   getPostal(token).then((postalResponse) => {
    //     this.attributes['postal'] = postalResponse['postal_code'];
    //
    //     getLocationData(postalResponse['postal_code']).then((res) => {
    //
    //       let locationData = {
    //         bounds: res.results[0].geometry.bounds,
    //         location: res.results[0].geometry.location
    //       };
    //
    //       this.attributes['lat'] = locationData.location.lat;
    //       this.attributes['lng'] = locationData.location.lng;
    //
    //       this.attributes['area'] = setUserLocation(locationData);
    //
          // this.handler.state = constants.states.TUTORIAL;
          // this.emitWithState('LaunchRequest');
    //     }).catch((err) => {
    //       console.log(err);
    //     });
    //
    //
    //   }).catch((err) => {
    //     console.log(err);
    //   });
    // }
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
