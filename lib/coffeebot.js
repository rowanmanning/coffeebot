
const express = require('express');
const post = require('request').post;
const responses = require('../data/responses.json');
const throttle = require('./middleware/throttle');
const fs = require('fs');

module.exports = coffeebot;

function coffeebot(config = {}) {
	const log = config.log;
	const app = express();

	// Button
	app.get('/', (request, response) => {
		fs.createReadStream(`${__dirname}/button.html`).pipe(response);
	});

	// Ping route
	app.post('/ping', throttle(15000), (request, response) => {
		if (request.shouldBeThrottled) {
			return response.send('OK (throttled)');
		}
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
