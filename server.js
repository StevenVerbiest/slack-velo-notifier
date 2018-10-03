require('dotenv').config({silent: true});

if (!process.env.BOT_TOKEN) {
    process.exit(1);
}

const express = require('express');
const request = require('request');
require('./src/index.js');

const app = express();
const PORT = 4390;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;

app.listen(PORT, function () {
  console.log('Listening on port ' + PORT);
});

app.get('/', function(req, res) {
  console.log(req.url);
  res.send(req.url);
});

app.post('/report', function(req, res) {
  res.send('/report response');
});

app.get('/oauth', function(req, res) {
  if (!req.query.code) {
    res.status(500);
    res.send({'Error': 'Looks like we\'re not getting code.'});
  } else {
    request({
      url: 'https://slack.com/api/oauth.access',
      qs: {code: req.query.code, client_id: CLIENT_ID, client_secret: CLIENT_SECRET},
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
