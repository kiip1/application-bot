const admin = require('firebase-admin');

const db = admin.firestore();

module.exports = {
	name: 'prefix',
	description: 'Sets the prefix of the bot.',
	permission: 'ADMINISTRATOR',
	usage: '<prefix>',
	execute(message, args) {
		db.collection('guilds').doc(message.guild.id).set(
			{'prefix': args[0]}, 
			{merge: true}
		);

		message.channel.send(`Prefix is now: "${args[0]}".`);
	},
};