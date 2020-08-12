const admin = require('firebase-admin');

const db = admin.firestore();

module.exports = {
	name: 'setacceptmessage',
	description: 'Sets the message that shows up when someone gets accepted.',
	permission: 'ADMINISTRATOR',
	usage: '<message>',
	execute(message, args) {
		db.collection('guilds').doc(message.guild.id).set(
			{'acceptMessage': args.join(' ')}, 
			{merge: true}
		);

		message.channel.send(`Accept message is now: "${args.join(' ')}".`);
	},
};