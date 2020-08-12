const fs = require('fs');
const admin = require('firebase-admin');
const Discord = require('discord.js');
const { defaultPrefix, success, fail } = require('./config.json');

const db = admin.firestore();

const commandFiles = fs.readdirSync('./commands');

client.commands = new Discord.Collection();

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	client.commands.set(command.name, command);
}

client.on('message', async (message) => {
	if (message.author.bot) return;

	if (message.channel.type == 'dm') return;

	const guildRef = db.collection('guilds').doc(message.guild.id);
	const guildDoc = await guildRef.get();

	var prefix = defaultPrefix;

	if (guildDoc.exists) {
		if (guildDoc.data().prefix != undefined) {
			prefix = guildDoc.data().prefix;
		}
	}

	if (!message.content.startsWith(prefix)) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if (client.commands.has(command)) {
		try {
			const permission = client.commands.get(command).permission;

			if (permission != undefined) {
				if (!message.member.hasPermission(permission) && !message.member.roles.cache.some(role => role.name.toLowerCase() == permission.toLowerCase())) {
					message.channel.send(`You don't have the permission or role "${permission}" which is required for this command.`);

					message.react(fail);

					return;
				}
			}

			const usage = client.commands.get(command).usage;

			var requiredArgs = 0;

			if (usage != undefined) {
				requiredArgs = usage.split(' ').length;
			}

			if (args.length >= requiredArgs) {
				const executionSuccess = client.commands.get(command).execute(message, args);

				if (executionSuccess != undefined) {
					if (!executionSuccess) {
						message.react(fail);

						return;
					}
				}

				message.react(success);
			} else {
				message.channel.send(`Usage: ${prefix}${command} ${usage}`);

				message.react(fail);
			}
		} catch (error) {
			console.error(error);

			message.channel.send('Oops... an error occurred whilst executing that command.');

			message.react(fail);
		}
	} else {
		message.channel.send(`That command couldn\'t be recognised. Type ${prefix}help for help.`);

		message.react(fail);
	}
});

client.on('messageUpdate', (_, newMessage) => {
	const reactions = newMessage.reactions.cache;

	if (reactions.get(success) == undefined || !reactions.get(success).me) {
		if (!(reactions.get(fail) == undefined || !reactions.get(fail).me)) {
			reactions.get(fail).remove();
		}

		client.emit('message', newMessage);
	}
});