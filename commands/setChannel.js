const admin = require('firebase-admin');

const db = admin.firestore();

module.exports = {
	name: 'setchannel',
	description: 'Sets the channel of where the applications go to, when submitted.',
	permission: 'ADMINISTRATOR',
	execute(message, _) {
		db.collection('guilds').doc(message.guild.id).set(
			{'channel': message.channel.id}, 
			{merge: true}
		);

		message.channel.send(`Channel is now: "${message.channel}".`);
	},
};