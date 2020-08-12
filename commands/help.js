const admin = require('firebase-admin');
const Discord = require('discord.js');
const { defaultPrefix } = require('../config.json');

const db = admin.firestore();

module.exports = {
	name: 'help',
	description: 'Lists all Application Bot commands.',
	async execute(message, _) {
		const { commands } = message.client;

		const guildRef = db.collection('guilds').doc(message.guild.id);
		const guildDoc = await guildRef.get();
	
		var prefix = defaultPrefix;
	
		if (guildDoc.exists) {
			if (guildDoc.data().prefix != undefined) {
				prefix = guildDoc.data().prefix;
			}
		}

		const helpEmbed = new Discord.MessageEmbed()
			.setColor('#00ff00')
			.setTitle('Application Bot Help')
			.setDescription(commands.map(command => `${prefix}${command.name} - ${command.description}`).join('\n'))
			.setTimestamp()
			.setFooter(message.author.tag, message.author.displayAvatarURL());
		
		message.channel.send(helpEmbed);
	},
};