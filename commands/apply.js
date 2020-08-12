const admin = require('firebase-admin');
const Discord = require('discord.js');

const db = admin.firestore();

var applicationAnswers = new Map();
var applicationQuestions = new Map();
var applicationInitQuestions = new Map();
var applicationChannels = new Map();

client.on('message', async (message) => {
	if (message.channel.type != 'dm') return;

	if (applicationAnswers.has(message.author.id)) {
		answerQuestion(message.author, message);
	}
});

const startApplication = (user, questions, channel) => {
	applicationAnswers.set(user.id, []);
	applicationQuestions.set(user.id, questions);
	applicationInitQuestions.set(user.id, [...questions]);
	applicationChannels.set(user.id, channel);

	askNextQuestion(user);
};

const askNextQuestion = async (user) => {
	if (applicationQuestions.get(user.id).length == 0) {
		user.send('Thank you for answering all questions. Your application has been sent.');

		var applicationEmbed = new Discord.MessageEmbed()
			.setColor('#00ff00')
			.setTitle('Application')
			.setTimestamp()
			.setFooter(user.tag, user.displayAvatarURL());

		for (var i = 0; i < applicationInitQuestions.get(user.id).length; i++) {
			applicationEmbed.addField(applicationInitQuestions.get(user.id)[i], applicationAnswers.get(user.id)[i]);
		}

		client.channels.fetch(applicationChannels.get(user.id)).then(channel => channel.send(applicationEmbed));

		applicationAnswers.delete(user.id);
		applicationQuestions.delete(user.id);
		applicationInitQuestions.delete(user.id);
		applicationChannels.delete(user.id);

		return;
	}

	user.send(`**${applicationQuestions.get(user.id)[0]}**`);

	applicationQuestions.get(user.id).shift();
}

const answerQuestion = (user, answer) => {
	applicationAnswers.get(user.id).push(answer);

	askNextQuestion(user);
}

module.exports = {
	name: 'apply',
	description: 'Starts your application.',
	async execute(message, _) {
		const guildRef = db.collection('guilds').doc(message.guild.id);
		const guildDoc = await guildRef.get();
	
		var questions;
		var blacklist;
	
		if (guildDoc.exists) {
			if (guildDoc.data().questions != undefined) {
				questions = guildDoc.data().questions;
			}

			if (guildDoc.data().blacklist != undefined) {
				blacklist = guildDoc.data().blacklist;
			}
		}

		if (blacklist != undefined) {
			if (blacklist.includes(message.author.id)) {
				message.react(fail);
	
				return;
			}
		}

		if (questions == undefined) {
			message.channel.send('There are no questions yet.');
		} else {
			if (questions.length == 0) {
				message.channel.send('There are no questions yet.');
			} else {
				const guildRef = db.collection('guilds').doc(message.guild.id);
				const guildDoc = await guildRef.get();
			
				var channel;
			
				if (guildDoc.exists) {
					if (guildDoc.data().channel != undefined) {
						channel = guildDoc.data().channel;
					}
				}

				if (channel == undefined) {
					message.channel.send('There is no application channel yet.');
				} else {
					message.channel.send('Check DMs');

					startApplication(message.author, questions, channel);
				}
			}
		}
	},
};