
const express = require('express');
const post = require('request').post;
const responses = require('../data/responses.json');

module.exports = coffeebot;

function coffeebot(config = {}) {
	const log = config.log;
	const app = express();

	// Ping route
	app.post('/ping', (request, response) => {
		post({
			url: config.slackWebhookUrl,
			json: true,
			body: {
				text: randomResponse()
			}
		}, (error, postResponse) => {
			if (error) {
				return response.status(500).send(error.message);
			}
			if (postResponse.statusCode >= 400) {
				return response.status(500).send(postResponse.body);
			}
			response.send('OK');
		});
	});

	// Start the application
	app.listen(config.port, error => {
		if (error) {
			log.error(error.stack);
			process.exit(1);
		}
		log.info('Coffeebot has become self aware');
	});

	return app;
}

function randomResponse() {
	return responses[Math.floor(Math.random() * responses.length)];
}
