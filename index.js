
const coffeebot = require('./lib/coffeebot');
const dotenv = require('dotenv');

dotenv.load({
	silent: true
});

const bot = coffeebot({
	log: console,
	port: process.env.PORT || 3000,
	slackWebhookUrl: process.env.SLACK_WEBHOOK_URL
});
