const admin = require('firebase-admin');

const db = admin.firestore();

module.exports = {
	name: 'deny',
	description: 'Denies someone and sends the given message to them.',
	permission: 'MENTION_EVERYONE',
	usage: '<user> <reason>',
	execute(message, args) {
		const reason = args.slice(1).join(' ');
		const user = client.users.cache.find(user => user.username === args[0] || user.tag === args[0] || user.id === args[0] || `<@${user.id}>` === args[0]);

		user.send(`You were denied: ${reason}`);

		message.channel.send(`Denied ${user}.`);
	},
};