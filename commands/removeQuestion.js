const admin = require('firebase-admin');

const db = admin.firestore();

module.exports = {
	name: 'removequestion',
	description: 'Removes a question from the application.',
	permission: 'ADMINISTRATOR',
	usage: '<question>',
	async execute(message, args) {
		const guildRef = db.collection('guilds').doc(message.guild.id);
		const guildDoc = await guildRef.get();
	
		var questions;
	
		if (guildDoc.exists) {
			if (guildDoc.data().questions != undefined) {
				questions = guildDoc.data().questions;
			}
		}

		if (questions.includes(args.join(' '))) {
			db.collection('guilds').doc(message.guild.id).set(
				{'questions': admin.firestore.FieldValue.arrayRemove(args.join(' '))}, 
				{merge: true}
			);

			message.channel.send(`Removed question: "${args.join(' ')}".`);
		} else {
			message.channel.send(`Could not find question: "${args.join(' ')}".`);

			return false;
		}
	},
};