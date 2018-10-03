const Botkit = require('botkit')
const controller = Botkit.slackbot({debug: false})

controller
  .spawn({
    token: process.env.BOT_TOKEN
  })
  .startRTM(function (err) {
    if (err) {
      throw new Error(err);
    }
 });

controller.hears(
  ['hello', 'hi'], ['direct_message', 'direct_mention', 'mention'],
  function (bot, message) { bot.reply(message, ':rocket:') });
