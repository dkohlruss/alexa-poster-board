const Alexa = require('alexa-sdk');
const constants = require('../constants/constants');
const getAddress = require('../helpers/getAddress');
const getLocationData = require('../helpers/getLocationData');
const setAddress = require('../helpers/setAddress');
const setUserLocation = require('../helpers/setUserLocation');

const ping = '<audio src="https://s3.amazonaws.com/dkohlruss/ping.mp3" />';
// DB constants
const AWS1 = require('aws-sdk');
const doc = new AWS1.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

const mainStateHandlers = Alexa.CreateStateHandler(constants.states.MAIN, {

  'LaunchRequest': function() {
    console.log('MAIN LAUNCHREQUEST');

    try {
      let deviceId = this.event.context.System.device.deviceId;
      console.log('device: ' + deviceId);
      console.log('other consent token: ' + this.event.session.user.permissions.consentToken);
      let consentToken = this.event.context.System.user.permissions.consentToken;
      console.log('consentToken: ' + consentToken);

      getAddress(deviceId, consentToken).then((res) => {
        let fullAddress = setAddress(res);
        if (!this.attributes['address'] || this.attributes['address'] !== fullAddress) {
          if (!fullAddress) {
            this.emit(':tell', `It looks like you haven't set your address.  You will need to do so in order to use this skill.`);
          } else {
            getLocationData(fullAddress).then((result) => {
                let location = result.results[0].geometry.location;
                let lat = location.lat;
                let lng = location.lng;
                let area = setUserLocation(location);
                this.attributes['address'] = fullAddress;
                this.attributes['lat'] = lat;
                this.attributes['lng'] = lng;
                this.attributes['area'] = area;

                this.emit(':ask', `Welcome to Bulletin Board. Would you like to listen to a popular message, submit a new message,
                      or get help with additional options?`, `You can listen to a message, submit a message, or ask for help.`);

                }).catch((err) => {
                  console.log('Address error: ' + err);
                  this.emit(':tellWithPermissionCard', 'There was a problem getting the address from your Amazon account.  Please check your default Amazon address, as well as your location permissions in the Amazon Alexa app to use this skill.', constants.ALL_ADDRESS_PERMISSION);
                }); // End of getLocation Promise
            }
        } else {
          this.emit(':ask', `Welcome back to Bulletin Board. Would you like to listen to a popular message, submit a new message,
                or get help with additional options?`, `You can listen to a message, submit a message, or ask for help.`);
        }
      }).catch((err) => {
        console.log(err);
        this.emit(':tellWithPermissionCard', 'Please check your Location permissions and ensure they are set in the Amazon Alexa app to use this skill.', constants.ALL_ADDRESS_PERMISSION);
      });
    } catch(err) {
      console.log('No consent token found: ' + err);
      this.emit(':tellWithPermissionCard', 'There was a problem retrieving your address information.  Please ensure your location permissions are set in your Alexa app.', constants.ALL_ADDRESS_PERMISSION);
    }
  },

  'MenuIntent': function() {
    console.log('MAIN MENUINTENT');
    this.emit(':ask', `Main menu. Would you like to listen to a popular message, submit a new message,
          or get help with additional options?`, `You can listen to a message, submit a message, or ask for help.`);
  },

  'ListenIntent': function() {
    console.log('MAIN LISTENINTENT');
    this.handler.state = constants.states.LISTENING;
    this.emitWithState('ListenIntent');
  },

  'SubmitIntent': function() {
    console.log('MAIN SUBMITINTENT');
    this.handler.state = constants.states.RECORDING;
    this.emit(':ask', `Let's record a message.  Speak your message after the beep. ${ping}`,
              `I didn't get your message, please try again after the beep. ${ping}`);
  },

  'AboutIntent': function() {
    console.log('MAIN ABOUTINTENT');
    const imageObj = {
      smallImageUrl: 'https://s3.amazonaws.com/dkohlruss/smallImg.jpg',
      largeImageUrl: 'https://s3.amazonaws.com/dkohlruss/largeImg.jpg'
    };
    this.emit(':askWithCard', `The Bullentin Board skill was developed by David Kohlruss and is meant to
              be for entertainment purposes only. For more information, visit the developer's site, linked in
              your Alexa app.  Main menu: Would you like to listen to a message, submit a message,
              or get help with additional options?`,
              `You can listen to a message, submit a message, or ask for help.`,
              `About`,
              `Hi! I'm David Kohlruss, the guy who developed this skill.  If you would like to get in touch with me, check out the official Bulletin Board twitter @BortAlexa or visit http://dkohlruss.github.io`, imageObj);
  },

  'StatisticsIntent': function() {
    console.log('MAIN STATISTICSINTENT');
    let recorded = 0;
    let recordedLength = 0;
    if (this.attributes['recorded']) {
      recorded = this.attributes['recorded'].sort((a, b) => {
        return a-b;
      });
      recordedLength = recorded.length;
    }

    let listenedLength = this.attributes['listened'].length || 0;
    let totalUps = 0;
    let totalDowns = 0;
    let highestUps = 0;
    let highestDowns = 0;
    let hottest = 0;
    let hottestQuote = '';

    if (recordedLength === 0) {
      this.handler.state = constants.states.MAIN;
      this.emit(':ask', `Here is your report: You have listened to ${listenedLength} messages,
              and recorded ${recordedLength} messages. Main menu: Would you like to listen to a message, submit a message,
              or get help with additional options?`, `You can listen to a message, submit a message, or ask for help.`);
    } else {
      let ids = [];
      recorded.forEach((id) => {
        ids.push({
          Id: id
        });
      });



      let params = {
        'RequestItems': {
          'ConfessionList': {
            Keys: ids
          }
        }
      };


      doc.batchGet(params, (err, data) => {
        if (err) {
          console.log('Get error: ' + JSON.stringify(err, null, 4));
        } else {
          let results = data.Responses.ConfessionList;

          results.forEach((result) => {
            console.log(JSON.stringify(result, null, 4));
            totalUps += result.ups;
            totalDowns += result.downs;
            if (result.hotness >= hottest) {
              hottest = result.hotness;
              highestUps = result.ups;
              highestDowns = result.downs;
              hottestQuote = result.quote;
            }
          });
          this.handler.state = constants.states.MAIN;

          let pluralMap = [listenedLength, recordedLength, highestUps, highestDowns, totalUps, totalDowns];
          let plural = Array(pluralMap.length).fill('');

          for (let i = 0; i < plural.length; i++) {
            if (pluralMap[i] != 1) {
              plural[i] = 's';
            }
          }
          this.emit(':ask', `Here is your report: You have listened to ${listenedLength} message${plural[0]}
                  and recorded ${recordedLength} message${plural[1]}. Your best message of all time is: ${hottestQuote} <break /> with
                  ${highestUps} upvote${plural[2]} and ${highestDowns} downvote${plural[3]}.  In total, your messages have received ${totalUps}
                  upvote${plural[4]} and ${totalDowns} downvote${plural[5]}.  Main menu: Would you like to listen to a message, submit a message,
                  or get help for additional options?`, `You can listen to a message, submit a message, or ask for help.`);
        }
      });
    };
  },

  'TutorialIntent': function() {
    console.log('MAIN TUTORIALINTENT');
    this.handler.state = constants.states.TUTORIAL;
    this.emitWithState('NewSession');
  },

  'AMAZON.StopIntent': function() {
    console.log('MAIN STOPINTENT');
    // State automatically saved with tell emit
    this.emit(':tell', 'Goodbye!');
  },

  'AMAZON.CancelIntent': function() {
    console.log('MAIN CANCELINTENT');
    // State automatically saved with tell emit
    this.emit(':tell', 'Goodbye!');
  },

  'SessionEndedRequest': function() {
    console.log('MAIN SESSIONENDEDREQUEST');
    // Will save the state when user times out
    this.emit(':saveState', true);
  },

  'AMAZON.HelpIntent': function() {
    console.log('MAIN HELPINTENT');
    this.emit(':ask', `You are currently in the main menu. You can listen to a message, record a message,
              go to the tutorial, get your account statistics, find out more about this skill. You
              can also exit at any time by saying: Stop. Which would you like to do?`,
              `You are currently in the main menu. The commands available to you are: listen, submit,
              statistics, tutorial, and about. You can also exit at any time by saying: Stop.`);
  },

  'Unhandled': function() {
    console.log('MAIN UNHANDLED');
    this.emitWithState('AMAZON.HelpIntent');
  }

});


module.exports = mainStateHandlers;
