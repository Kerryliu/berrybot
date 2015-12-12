var Discord = require("discord.js");
var request = require("request");
var Cleverbot = require("cleverbot-node");
var ytdl = require("ytdl-core");
var YoutubeNode = require("youtube-node");

var auth = require("./auth.json");

var cleverbot = new Cleverbot();
var mybot = new Discord.Client();
var youtubeNode = new YoutubeNode();

//Flags and Counters:
var axeCounter = 0;

//Commands:
var userCommands = {
	"help": function(bot, msg) {
		mybot.reply(msg, "https://github.com/Kerryliu/berrybot");
	},
	"ping": function(bot, msg) {
		bot.reply(msg, "pong");	
	},
	"cat": function(bot, msg) {
		request("http://random.cat/meow", function(error, response, body) {
			if(!error && response.statusCode == 200) {
				var result = JSON.parse(body);
				bot.reply(msg, result.file);
			}
		});
	}, 
	"insult": function(bot, msg) {
		request("http://quandyfactory.com/insult/json", function(error, response, body) {
			if(!error && response.statusCode == 200) {
				var result = JSON.parse(body);
				mybot.reply(msg, result.insult);
			}
		});
	}, 
	"joke": function(bot, msg) {
		request("http://tambal.azurewebsites.net/joke/random", function(error, response, body) {
			if(!error && response.statusCode == 200) {
				var result = JSON.parse(body);
				mybot.reply(msg, result.joke);
			}
		});
	}, 
	"join": function(bot, msg, args) {
		var channel = mybot.channels.get("name", args);
		mybot.joinVoiceChannel(channel, function(){
			mybot.reply(msg, "Joining: " + channel);
		});
	},
	"testvoice": function(bot, msg) {
		try {
			mybot.voiceConnection.stopPlaying();
			mybot.voiceConnection.playFile("./a.mp3");
		} catch (err) {
			mybot.reply(msg, "Put me in a voice channel first :'(");
		}
	},
	"singvid": function(bot, msg, args) {
		youtubeNode.search(args, 1, function(error, result) {
			if (error) {
				mybot.reply(msg, "Something went wrong. ");
			} else {
				var url = "http://www.youtube.com/watch?v=" + result.items[0].id.videoId;
				if (args.substr(0,4) != "http") {
					mybot.reply(msg, url);
				}
				try {
					mybot.voiceConnection.stopPlaying();
					mybot.voiceConnection.playRawStream(ytdl(url));
				} catch (err) {
					if (err instanceof TypeError){
						mybot.reply(msg, "Put me in a voice channel first :'(");
					} else {
						mybot.reply(msg, "Missing or invalid video URL.");
					}
				}
			}
		});
	},
	"shutup": function(bot, msg) {
		try{
			mybot.voiceConnection.stopPlaying();
		} catch (err) {
			mybot.reply(msg, "I'm mute right now...");
		}
	},
	"goaway": function(bot, msg) {
		mybot.leaveVoiceChannel(function() {
			mybot.reply(message, "Bye... :(");
		});
	}
};

//Logins:
mybot.login(auth.email, auth.pass);
youtubeNode.setKey(auth.youtube);

//Bot start:
mybot.on("message", function(message) {
	//Probably a better way to parse...
	var temp = message.content.toLowerCase();
	var words = temp.split(' ');
	var firstWord = words[0];
	var args = message.content.substr(message.content.indexOf(" ") + 1);

	//console.log(message.author.username + ": " + message.content);

	//Commands:
	if(firstWord.charAt(0) == '/') {
		var command = firstWord.slice(1);
		try{
			userCommands[command](mybot, message, args);
		} catch (err) {
			mybot.reply(message, "Invalid command");
		}
	}
	//Automated functions:
	else {
		if(firstWord.substr(0,7) == "(╯°□°）╯") {
			mybot.sendMessage(message.channel, "┬──┬◡ﾉ(° -°ﾉ) ");
		} else if(firstWord == "and") {
			axeCounter++;
			if(counter > 1) {
				mybot.reply(message, "And my axe!");
				axeCounter = 0;
			}
		} else if(firstWord.substr(0,3) == "ayy") {
			mybot.reply(message, "lmao");
		} else if (message.content.includes(":(")) {
			mybot.reply(message, "Don't be sad, have a smiley face: :)");
		} else if(message.content.includes("121398650738835458")) { //Uses unique username id for bot
			mybot.startTyping(message.channel);
			Cleverbot.prepare(function(){
				cleverbot.write(message.content, function (response) {
					mybot.reply(message, response.message, true);
					mybot.stopTyping(message.channel);
				});
			});
		} else {
			//My axe!
			if (axeCounter > 0) {
				axeCounter--;
			}
		}
	}
});
