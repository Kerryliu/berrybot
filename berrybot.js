var Discord = require("discord.js");
var mybot = new Discord.Client();
var request = require("request");
var Cleverbot = require("cleverbot-node");
var auth = require("./auth.json");

var counter = 0;

cleverbot = new Cleverbot;

mybot.login(auth.email, auth.pass);

mybot.on("message", function(message){
	var potato = message.content.toLowerCase();
	var words = potato.split(' ');
	var command = words[0];
	var args = message.content.substr(message.content.indexOf(" ") +1);
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
			case "/id":
				try {
					mybot.reply(message, "\nName: " + mybot.servers[1].channels[args].name + "\nType: " + mybot.servers[1].channels[args].type + "\nID: " + mybot.servers[1].channels[args].id);
				} catch (err) {
					mybot.reply(message, "Invalid Channel Number ");
				}
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
				mybot.voiceConnection.playFile("./a.mp3").then(stream => {
				stream.on("time", time => {
					console.log("Time", time);
				})
			});
				break;
			case "ping":
				mybot.reply(message, "pong");
				break;
			default:
				if (message == "(╯°□°）╯︵ ┻━┻") {
					mybot.sendMessage(message.channel, "┬──┬◡ﾉ(° -°ﾉ) ");
				} else if (message == "STOP IT YOU FOOL") {
					mybot.sendMessage(message.channel, "I DO WHAT I WANT");
				} else if(command.substr(0,3) == "ayy") {
					mybot.reply(message, "lmao");
				} else if (command.substr(0,3) == "and") {
					counter++;
					console.log(counter);
					if(counter > 1) {
						mybot.reply(message, "And my axe!");
						counter = 0;
					}
				} else if (command.includes("121398650738835458")) {
					mybot.startTyping(message.channel);
					Cleverbot.prepare(function(){
						cleverbot.write(message.content, function (response) {
							console.log(response.message);
							mybot.reply(message, response.message, true);
							mybot.stopTyping(message.channel);
						});
					});
				}
				break;
		}
});
