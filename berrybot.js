var Discord = require('discord.js');
var request = require('request');
var Cleverbot = require('cleverbot-node');
var ytdl = require('ytdl-core');
var YoutubeNode = require('youtube-node');

var auth = require('./auth.json');

var cleverbot = new Cleverbot();
var mybot = new Discord.Client();
var youtubeNode = new YoutubeNode();

var botID = '121398650738835458';

// Logins:
mybot.login(auth.email, auth.pass);
youtubeNode.setKey(auth.youtube);

// Commands:
var userCommands = {
  help: function (bot, msg) {
    mybot.reply(msg, 'https://github.com/Kerryliu/berrybot');
  },

  ping: function (bot, msg) {
    bot.reply(msg, 'pong');
  },

  cat: function (bot, msg) {
    request('http://random.cat/meow', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var result = JSON.parse(body);
        bot.reply(msg, result.file);
      }
    });
  },

  insult: function (bot, msg) {
    request('http://quandyfactory.com/insult/json', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var result = JSON.parse(body);
        mybot.reply(msg, result.insult);
      }
    });
  },

  joke: function (bot, msg) {
    request('http://tambal.azurewebsites.net/joke/random', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var result = JSON.parse(body);
        mybot.reply(msg, result.joke);
      }
    });
  },

  clock: function (bot, msg) {
    var d = new Date();
    var hours = d.getHours();
    var minutes = '';
    if (d.getMinutes() > 45) {
      minutes = '';
      hours++;
    } else if (d.getMinutes() < 45 && d.getMinutes() > 15) {
      minutes = '30';
    } else {
      minutes = '';
    }

    if (hours > 12) {
      hours -= 12;
    }

    mybot.reply(msg, ':clock' + hours + minutes + ':');
  },

  join: function (bot, msg, args) {
    var channel = mybot.channels.get('name', args);
    mybot.joinVoiceChannel(channel, function () {
      mybot.reply(msg, 'Joining: ' + channel);
    });
  },

  comehere: function (bot, msg, args) {
    var channel = msg.author.voiceChannel;
    mybot.joinVoiceChannel(channel, function () {
      mybot.reply(msg, 'Joining: ' + channel);
    });
  },

  testvoice: function (bot, msg) {
    try {
      mybot.voiceConnection.stopPlaying();
      mybot.voiceConnection.playFile('./a.mp3');
    } catch (err) {
      mybot.reply(msg, 'Something went wrong. ');
    }
  },

  airhorn: function (bot, msg) {
    try {
      mybot.voiceConnection.stopPlaying();
      mybot.voiceConnection.playFile('./horn.mp3');
    } catch (err) {
      var channel = msg.author.voiceChannel;
      mybot.joinVoiceChannel(channel, function () {
        mybot.reply(msg, 'Joining: ' + channel);
        mybot.voiceConnection.stopPlaying();
        mybot.voiceConnection.playFile('./horn.mp3');
      });
    }
  },

  singvid: function (bot, msg, args) {
    try {
      mybot.voiceConnection.stopPlaying();
      youtubeNode.search(args, 1, function (error, result) {
        if (error) {
          mybot.reply(msg, 'Something went wrong. ');
        } else if (typeof result.items[0] == 'undefined') {
          mybot.reply(msg, 'Invalid URL or no search results');
        } else {
          var url = 'http://www.youtube.com/watch?v=' + result.items[0].id.videoId;
          if (args.substr(0, 4) != 'http') {
            mybot.reply(msg, url);
          }

          mybot.voiceConnection.stopPlaying();
          try {
            mybot.voiceConnection.playRawStream(ytdl(url, {
              filter: 'audioonly',
            }));
          } catch (err) {
            mybot.reply(msg, 'Something went wrong. ');
          }
        }
      });
    } catch (err) {
      var channel = msg.author.voiceChannel;
      mybot.joinVoiceChannel(channel, function () {
        mybot.reply(msg, 'Joining: ' + channel);

        // FIXME: This is terrible but I'm lazy
        mybot.voiceConnection.stopPlaying();
        youtubeNode.search(args, 1, function (error, result) {
          if (error) {
            mybot.reply(msg, 'Something went wrong. ');
          } else if (typeof result.items[0] == 'undefined') {
            mybot.reply(msg, 'Invalid URL or no search results');
          } else {
            var url = 'http://www.youtube.com/watch?v=' + result.items[0].id.videoId;
            if (args.substr(0, 4) != 'http') {
              mybot.reply(msg, url);
            }

            mybot.voiceConnection.stopPlaying();
            try {
              mybot.voiceConnection.playRawStream(ytdl(url, {
                filter: 'audioonly',
              }));
            } catch (err) {
              mybot.reply(msg, 'Something went wrong. ');
            }
          }
        });
      });
    }
  },

  shutup: function (bot, msg) {
    try {
      mybot.voiceConnection.stopPlaying();
    } catch (err) {
      mybot.reply(msg, 'I\'m mute right now...');
    }
  },

  goaway: function (bot, msg) {
    mybot.leaveVoiceChannel(function () {
      mybot.reply(msg, 'Bye...');
    });
  },
};

// Bot start:
mybot.on('message', function (message) {
  // FIXME: Probably a better way to parse...
  var temp = message.content.toLowerCase();
  var words = temp.split(' ');
  var firstWord = words[0];
  var args = message.content.substr(message.content.indexOf(' ') + 1);

  // Commands:
  if (firstWord.charAt(0) == '/') {
    var command = firstWord.slice(1);
    try {
      userCommands[command](mybot, message, args);
    } catch (err) {
      console.log(err);
    }
  }

  // Automated functions:
  if (firstWord.substr(0, 7) == '(╯°□°）╯') {
    mybot.sendMessage(message.channel, '┬──┬◡ﾉ(° -°ﾉ) ');
  } else if (firstWord == 'and') {
    mybot.reply(message, 'And my axe!');
  } else if (firstWord.substr(0, 3) == 'ayy') {
    mybot.reply(message, 'lmao');
  } else if (message.content.includes(botID)) { // Uses unique username id for bot
    mybot.startTyping(message.channel);
    Cleverbot.prepare(function () {
      cleverbot.write(message.content, function (response) {
        mybot.reply(message, response.message, true);
        mybot.stopTyping(message.channel);
      });
    });
  }
});

process.on('uncaughtException', function (err) {
  if (err.code == 'ECONNRESET') {
    console.log('Got an ECONNRESET! This is *probably* not an error. Stacktrace:');
    console.log(err.stack);
  } else {
    console.log(err);
    console.log(err.stack);
    process.exit(0);
  }
});
