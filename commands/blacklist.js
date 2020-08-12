const admin = require('firebase-admin');
const Discord = require('discord.js');

const db = admin.firestore();

module.exports = {
	name: 'blacklist',
	description: '(Un)blacklists an user.',
	permission: 'MENTION_EVERYONE',
	usage: '<user>',
	async execute(message, args) {
		const user = client.users.cache.find(user => user.username === args[0] || user.tag === args[0] || user.id === args[0] || `<@${user.id}>` === args[0]);

		const guildRef = db.collection('guilds').doc(message.guild.id);
		const guildDoc = await guildRef.get();
	
		var blacklist;

		if (guildDoc.exists) {
			if (guildDoc.data().blacklist != undefined) {
				blacklist = guildDoc.data().blacklist;
			}
		}

		if (blacklist == undefined) {
			message.channel.send(`Blacklisted ${user}`);

			db.collection('guilds').doc(message.guild.id).set(
				{'blacklist': admin.firestore.FieldValue.arrayUnion(user.id)}, 
				{merge: true}
			);

			return;
		} 

		if (blacklist.includes(user.id)) {
			message.channel.send(`Unblacklisted ${user}`);

			db.collection('guilds').doc(message.guild.id).set(
				{'blacklist': admin.firestore.FieldValue.arrayRemove(user.id)}, 
				{merge: true}
			);
		} else {
			message.channel.send(`Blacklisted ${user}`);

			db.collection('guilds').doc(message.guild.id).set(
				{'blacklist': admin.firestore.FieldValue.arrayUnion(user.id)}, 
				{merge: true}
			);
		}
	},
};