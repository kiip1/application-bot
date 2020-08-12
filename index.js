const admin = require('firebase-admin');
const serviceAccount = require('./firebase.json');
const Discord = require('discord.js');
const { token, id } = require('./config.json');

global.client = new Discord.Client();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: '<Database URL here.>'
});

const db = admin.firestore();

client.on('ready', () => {
	client.user.setActivity('applications', {
		type: 'STREAMING',
		url: 'https://www.twitch.tv/ '
	});

	require('./commands.js');
});

client.login(token);