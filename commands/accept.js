const admin = require('firebase-admin');

const db = admin.firestore();

module.exports = {
	name: 'accept',
	description: 'Accepts someone and sends the accept message to them.',
	permission: 'MENTION_EVERYONE',
	usage: '<user>',
	async execute(message, args) {
		const user = client.users.cache.find(user => user.username === args[0] || user.tag === args[0] || user.id === args[0] || `<@${user.id}>` === args[0]);

		const guildRef = db.collection('guilds').doc(message.guild.id);
		const guildDoc = await guildRef.get();
	
		var acceptMessage;

		if (guildDoc.exists) {
			if (guildDoc.data().acceptMessage != undefined) {
				acceptMessage = guildDoc.data().acceptMessage;
			}
		}

		if (acceptMessage == undefined) {
			message.channel.send('Accept message is not set.');
			
			return;
		}

		user.send(acceptMessage);

		message.channel.send(`Accepted ${user}.`);
	},
};