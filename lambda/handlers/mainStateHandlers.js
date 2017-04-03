const Alexa = require('alexa-sdk');
const constants = require('../constants/constants');
const getPostal = require('../helpers/getPostal');
const getLocationData = require('../helpers/getLocationData');
const setUserLocation = require('../helpers/setUserLocation');

const ping = '<audio src="https://s3.amazonaws.com/dkohlruss/ping.mp3" />';
// DB constants
const AWS1 = require('aws-sdk');
const doc = new AWS1.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

const mainStateHandlers = Alexa.CreateStateHandler(constants.states.MAIN, {

  'LaunchRequest': function() {
    if (this.event.session.user.accessToken == undefined) {
      this.emit(':tellWithLinkAccountCard', `To begin to Bort, please use the companion
                app to authenticate on Amazon.`);
    }

    let token = this.event.session.user.accessToken;

    getPostal(token).then((postalResponse) => {
      if (!this.attributes['postal'] || this.attributes['postal'] !== postalResponse['postal_code']) {
        getLocationData(postalResponse['postal_code']).then((res) => {

          this.attributes['postal'] = postalResponse['postal_code'];

          let locationData = {
            bounds: res.results[0].geometry.bounds,
            location: res.results[0].geometry.location
          };

          this.attributes['lat'] = locationData.location.lat;
          this.attributes['lng'] = locationData.location.lng;

          this.attributes['area'] = setUserLocation(locationData);

          this.emit(':ask', `Welcome to Bort. Would you like to listen to a popular Bort, submit a new Bort,
                or get help with additional options?`, `You can listen to a Bort, submit a Bort, or ask for help.`);
        }).catch((err) => {
          console.log(err);
        });

      } else {
        this.emit(':ask', `Welcome to Bort. Would you like to listen to a popular Bort, submit a new Bort,
              or get help with additional options?`, `You can listen to a Bort, submit a Bort, or ask for help.`);
      }

    }).catch((err) => {
      console.log(err);
    });
  },

  'MenuIntent': function() {
    this.emit(':ask', `Main menu. Would you like to listen to a popular Bort, submit a new Bort,
          or get help with additional options?`, `You can listen to a Bort, submit a Bort, or ask for help.`);
  },

  'ListenIntent': function() {
    this.handler.state = constants.states.LISTENING;
    this.emitWithState('ListenIntent');
  },

  'SubmitIntent': function() {
    this.handler.state = constants.states.RECORDING;
    this.emit(':ask', `Let's record a Bort.  After the beep, it's time to Bort. ${ping}`,
              `I didn't get your Bort, please try again after the beep. ${ping}`);
  },

  'AboutIntent': function() {
    const imageObj = {
      smallImageUrl: 'https://s3.amazonaws.com/dkohlruss/smallImg.jpg',
      largeImageUrl: 'https://s3.amazonaws.com/dkohlruss/largeImg.jpg'
    };
    this.emit(':askWithCard', `The Bort skill was developed by David Kohlruss and is meant to
              be for entertainment purposes only. The name Bort is a portmanteau of bulletin,
              report, and post.  For more information, visit the developer's site, linked in
              your Alexa app.  Main menu: Would you like to listen to a Bort, submit a Bort,
              or get help with additional options?`,
              `You can listen to a Bort, submit a Bort, or ask for help.`,
              `About`,
              `Hi! I'm David Kohlruss, the guy who developed this skill.  If you would like to get in touch with me, check out the official Bort twitter @BortAlexa or visit http://dkohlruss.github.io`, imageObj);
  },

  'SonsNameIntent': function() {
    this.emit(':ask', `I'm flattered that you named your child after a meme.  But I wonder something,
              what kind of person would do that?  Main menu: Would you like to listen to a Bort, submit a Bort,
              or get help with additional options?`, `You can listen to a Bort, submit a Bort, or ask for help.`);
  },

  'StatisticsIntent': function() {
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
      this.emit(':ask', `Here is your re-Bort: You have listened to ${listenedLength} Borts,
              and recorded ${recordedLength} Borts. Main menu: Would you like to listen to a Bort, submit a Bort,
              or get help with additional options?`, `You can listen to a Bort, submit a Bort, or ask for help.`);
    } else {
      let ids = [];
      recorded.forEach((id) => {
        ids.push({
          Id: id
        });
      });

      console.log(ids);

      let params = {
        'RequestItems': {
          'ConfessionList': {
            Keys: ids
          }
        }
      };
      console.log(params);

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
          this.emit(':ask', `Here is your re-Bort: You have listened to ${listenedLength} Bort${plural[0]}
                  and recorded ${recordedLength} Bort${plural[1]}. Your best Bort of all time is: ${hottestQuote} <break /> with
                  ${highestUps} upvote${plural[2]} and ${highestDowns} downvote${plural[3]}.  In total, your Borts have received ${totalUps}
                  upvote${plural[4]} and ${totalDowns} downvote${plural[5]}.  Main menu: Would you like to listen to a Bort, submit a Bort,
                  or get help for additional options?`, `You can listen to a Bort, submit a Bort, or ask for help.`);
        }
      });
    };
  },

  'TutorialIntent': function() {
    this.handler.state = constants.states.TUTORIAL;
    this.emitWithState('NewSession');
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
    this.emit(':ask', `You are currently in the main menu. You can listen to a Bort, record a Bort,
              go to the tutorial, get your account statistics, find out more about this skill. You
              can also exit at any time by saying: Stop.`,
              `You are currently in the main menu. The commands available to you are: listen, submit,
              statistics, tutorial, and about. You can also exit at any time by saying: Stop.`);
  },

  'Unhandled': function() {
    this.emitWithState('AMAZON.HelpIntent');
  }

});


module.exports = mainStateHandlers;
