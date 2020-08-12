const admin = require('firebase-admin');

const db = admin.firestore();

module.exports = {
	name: 'addquestion',
	description: 'Adds a question to the application.',
	permission: 'ADMINISTRATOR',
	usage: '<question>',
	execute(message, args) {
		db.collection('guilds').doc(message.guild.id).set(
			{'questions': admin.firestore.FieldValue.arrayUnion(args.join(' '))}, 
			{merge: true}
		);

		message.channel.send(`Added question: "${args.join(' ')}".`);
	},
};