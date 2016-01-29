/* Uses the slack button feature to offer a real time bot to multiple teams */
var Botkit = require('botkit');

if (!process.env.token || !process.env.PORT) {
  console.log('Error: Specify token and port in environment');
  process.exit(1);
}

var config = {}
if(process.env.MONGOLAB_URI) {
  var BotkitStorage = require('botkit-storage-mongo');
  config = {
    storage:  BotkitStorage({mongoUri: process.env.MONGOLAB_URI}),
  };
} else {
  config = {
    json_file_store: './db_slackbutton_bot/',
  };
}

var controller = Botkit.slackbot(config);

controller.spawn({
  token: process.env.token
}).startRTM(function(err) {
  if (err) {
    throw new Error(err);
  }
});


// BEGIN EDITING HERE!

controller.hears('hello','direct_message',function(bot,message) {
  bot.reply(message,'Hello!');
});

controller.hears('^stop','direct_message',function(bot,message) {
  bot.reply(message,'Goodbye');
  bot.rtm.close();
});

controller.on('direct_message,mention,direct_mention',function(bot,message) {
  bot.api.reactions.add({
    timestamp: message.ts,
    channel: message.channel,
    name: 'robot_face',
  },function(err) {
    if (err) { console.log(err) }
    bot.reply(message,'I heard you loud and clear boss.');
  });
});

