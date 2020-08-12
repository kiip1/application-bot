module.exports = {
	name: 'invite',
	description: 'Gives a link to invite the bot to your own server.',
	execute(message, _) {
		message.channel.send('Invite: https://discord.com/oauth2/authorize?client_id=741196825129648189&permissions=337984&scope=bot');

		return true;
	},
};