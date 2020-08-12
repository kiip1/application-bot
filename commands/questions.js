const admin = require('firebase-admin');
const Discord = require('discord.js');

const db = admin.firestore();

module.exports = {
	name: 'questions',
	description: 'Lists the questions of the application.',
	async execute(message, _) {
		const guildRef = db.collection('guilds').doc(message.guild.id);
		const guildDoc = await guildRef.get();
	
		var questions;
	
		if (guildDoc.exists) {
			if (guildDoc.data().questions != undefined) {
				questions = guildDoc.data().questions;
			}
		}

		if (questions == undefined) {
			message.channel.send('There are no questions yet.');
		} else {
			if (questions.length == 0) {
				message.channel.send('There are no questions yet.');
			} else {
				const questionsEmbed = new Discord.MessageEmbed()
					.setColor('#00ff00')
					.setTitle('Application Questions')
					.setDescription(questions.map(question => `- ${question}`).join('\n'))
					.setTimestamp()
					.setFooter(message.author.tag, message.author.displayAvatarURL());
			
				message.channel.send(questionsEmbed);
			}
		}
	},
};