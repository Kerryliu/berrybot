
var Discord = require("discord.js");
var mybot = new Discord.Client();
var request = require("request");
var Cleverbot = require("cleverbot-node");
var auth = require("./auth.json");

cleverbot = new Cleverbot;

mybot.login(auth.email, auth.pass);
mybot.on("message", function(message){
	var command = message.content.toLowerCase();
	var DoTheMagic = "Yes!";
	if(message.content.indexOf("ding") >= 0) {
		mybot.reply(message, "dong");
	} else if (message.content.charAt(0) == '/') {
		console.log(command);
		switch(command) {
		case "/help":
			var arg = "ew";
			mybot.sendMessage(message.channel, "Sorry, but I don't have the time or the crayons to explain to you. ");
		break;
		case "/pussy":
		case "/cat":
		case "/kitty":
			var arg = "http://random.cat/meow";
		break;
		case "/e621":
			var arg = "https://e621.net/post/index.json?limit=1&page=1&tags=order:random";
		break;
		case "/yandere":
			var arg = "https://yande.re/post/index.json?limit=1&page=1&tags=order:random";
		break;
		case "/konachan":
			var arg = "http://konachan.com/post/index.json?limit=1&page=1&tags=order:random";
		break;
		case "/insult":
			var arg = "http://quandyfactory.com/insult/json";
		break;
		case "/joke":
			var arg = "http://tambal.azurewebsites.net/joke/random";
		break;
		default:
			DoTheMagic = "Nu~";
		}
		if (DoTheMagic == "Yes!") {
			request(arg, function(error, response, body) {
				if (!error && response.statusCode == 200) {
					var result = JSON.parse(body);
					console.log(result);
					if (command == "/pussy" || command == "/cat" || command == "/kitty") {
						mybot.sendMessage(message.channel, result.file);
					} else if (command == "/e621" || command == "/yandere" || command == "/konachan") {
						mybot.sendMessage(message.channel, result[0].file_url + " Score " + result[0].score);
					} else if (command == "/insult") {
						mybot.sendMessage(message.channel, result.insult);
					} else if (command == "/joke") {
						mybot.sendMessage(message.channel, result.joke);
					}

				};
			});
		} else if (DoTheMagic == 'Nu~') {
			console.log("Potato");
			mybot.sendMessage(message.channel, "Invalid Parameter.  /help for list of arguments");
		}
	} else if (message.content.includes("(╯°□°）╯︵ ┻━┻")) {
		console.log("Fix Table");
		mybot.sendMessage(message.channel, "┬──┬◡ﾉ(° -°ﾉ) ");
	} else if(message.content.includes("121398650738835458")) {
		Cleverbot.prepare(function(){
			console.log(message.content);
			cleverbot.write(message.content, function (response) {
				console.log(response.message);
				mybot.reply(message, response.message, true);
			});
		});
	}
});
