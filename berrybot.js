var Discord = require("discord.js");
var request = require("request");
var Cleverbot = require("cleverbot-node");
var ytdl = require("ytdl-core");
var YoutubeNode = require("youtube-node");

var auth = require("./auth.json");

//For my axe
var counter = 0;

var cleverbot = new Cleverbot();
var mybot = new Discord.Client();
var youtubeNode = new YoutubeNode();

mybot.login(auth.email, auth.pass);
youtubeNode.setKey(auth.youtube);

mybot.on("message", function(message){
	if(message.content.charAt(0) == '/') {
	//Probably a better way to parse...
	var potato = message.content.toLowerCase();
	var words = potato.split(' ');
	var command = words[0];
	var args = message.content.substr(message.content.indexOf(" ") + 1);

		switch(command) {
			case "/help":
				mybot.reply(message, "https://github.com/Kerryliu/berrybot");
				break;
			case "/pussy":
			case "/cat":
			case "/kitty":
				request("http://random.cat/meow", function(error, response, body) {
					if(!error && response.statusCode == 200) {
						var result = JSON.parse(body);
						mybot.reply(message, result.file);
					}
				});
				break;
			case "/insult":
				request("http://quandyfactory.com/insult/json", function(error, response, body) {
					if(!error && response.statusCode == 200) {
						var result = JSON.parse(body);
						mybot.reply(message, result.insult);
					}
				});
				break;
			case "/joke":
				request("http://tambal.azurewebsites.net/joke/random", function(error, response, body) {
					if(!error && response.statusCode == 200) {
						var result = JSON.parse(body);
						mybot.reply(message, result.joke);
					}
				});
				break;
			case "/join":
					var channel = mybot.channels.get("name", args);
					mybot.joinVoiceChannel(channel, function(){
						mybot.reply(message, "Joining: " + channel);
					});
				break;
			case "/goaway":
				mybot.leaveVoiceChannel(function() {
					mybot.reply(message, "Bye... :(");
				});
				break;
			case "/test":
				mybot.reply(message, message.author.client.voiceConnection);
				break;
			case "/testvoice":
				try {
					mybot.voiceConnection.stopPlaying();
					mybot.voiceConnection.playFile("./a.mp3");
				} catch (err) {
					mybot.reply(message, "Put me in a voice channel first :'(");
				}
				break;
			case "/singvid":
					youtubeNode.search(args, 1, function(error, result) {
						if (error) {
							mybot.reply(message, "Something went wrong. ");
						} else {
							var url = "http://www.youtube.com/watch?v=" + result.items[0].id.videoId;
							if (args.substr(0,4) != "http") {
								mybot.reply(message, url);
							}
							try {
								mybot.voiceConnection.stopPlaying();
								mybot.voiceConnection.playRawStream(ytdl(url));
							} catch (err) {
								if (err instanceof TypeError){
									mybot.reply(message, "Put me in a voice channel first :'(");
								} else {
									mybot.reply(message, "Missing or invalid video URL.");
								}
							}
						}
					});
				break;
			case "/shutup":
				try{
					mybot.voiceConnection.stopPlaying();
				} catch (err) {
					mybot.reply(message, "I'm mute right now...");
				}
				break;
			default:
				mybot.reply(message, "Invalid command.");
				break;
		}

	} else {
		if(message.content == "ping") {
			mybot.reply(message, "pong");
		} else {
			if (message.content == "(╯°□°）╯︵ ┻━┻") {
				mybot.sendMessage(message.channel, "┬──┬◡ﾉ(° -°ﾉ) ");
			} else if(message.content.substr(0,3) == "ayy") {
				mybot.reply(message, "lmao");
			} else if (message.content.substr(0,3) == "and") {
				counter++;
				if(counter > 1) {
					mybot.reply(message, "And my axe!");
					counter = 0;
				}
			} else if (message.content.includes("121398650738835458")) {
				mybot.startTyping(message.channel);
				Cleverbot.prepare(function(){
					cleverbot.write(message.content, function (response) {
						console.log(response.message);
						mybot.reply(message, response.message, true);
						mybot.stopTyping(message.channel);
					});
				});
			} else { //I need a less retarded way of keeping track..
				counter--;
				if(counter < 0) {
					counter = 0;
				}
			}
		}
	}
});
