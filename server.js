require('dotenv').config({silent: true});

if (!process.env.BOT_TOKEN) {
    process.exit(1);
}

const express = require('express');
const request = require('request');
const fetch = require('node-fetch');
const cron = require('cron');
const Botkit = require('botkit');

const app = express();
const PORT = process.env.PORT;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const USER_ID = process.env.USER_ID;
const VELO_ADDRESS = process.env.VELO_ADDRESS;
const CRON_TIME = process.env.CRON_TIME;

const controller = Botkit.slackbot({ debug: true});
const CronJob = cron.CronJob;

const bot = controller.spawn({
  token: process.env.BOT_TOKEN
}).startRTM();

const job = new CronJob({
  cronTime: CRON_TIME,
  onTick: function() {
    fetch('https://www.velo-antwerpen.be/availability_map/getJsonObject')
      .then(function(res) {
        return res.json();
      })
      .then(function(json) {
        const station = json.filter(obj => {
          return obj.address === VELO_ADDRESS
        });
        const bikes = station[0].bikes;

        bot.startPrivateConversation({user: USER_ID}, function(err,conversation) {
          conversation.say(':bike: Only ' + bikes + ' bikes left!');
        });
      });
  },
  start: false,
  timeZone: 'Europe/Amsterdam'
});

app.listen(PORT, function () {
  console.log('Listening on port ' + PORT);
});

app.get('/', function(req, res) {
});

app.post('/report', function(req, res) {
  fetch('https://www.velo-antwerpen.be/availability_map/getJsonObject')
    .then(function(res) {
      return res.json();
    })
    .then(function(json) {
      const result = json.filter(obj => {
        return obj.address === VELO_ADDRESS
      });
      const bikes = result[0].bikes;

      res.send(':bike: Only ' + bikes + ' bikes left!');
    });
});

app.get('/oauth', function(req, res) {
  if (!req.query.code) {
    res.status(500);
    res.send({'Error': 'Looks like we\'re not getting code.'});
  } else {
    request({
      url: 'https://slack.com/api/oauth.access',
      qs: {
        code: req.query.code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
      },
      method: 'GET',
    }, function (error, response, body) {
      if (error) {
        console.log(error);
      } else {
        res.json(body);
      }
    });
  }
});

job.start();
