var express = require('express');
const jsonFile = require('jsonfile');
const { response } = require('../app');
const { resolve, reject } = require('bluebird');
const { json } = require('body-parser');
var router = express.Router();
const file = '/Users/daniel/Documents/projects/express-dataset/data/events.json';

// Routes related to event

function checkIfEventIsValid(event) {
	const { id, type, actor, repo, created_at } = event;
	if (!id || !type || !actor || !repo || !created_at) {
		return false;
	}
	return true;
}

router.post('/', async function (request, response) {
	const event = request.body;

	const isValidEvent = checkIfEventIsValid(event);
	if (!isValidEvent) {
		return response.status(406).send('Invalid Event Object');
	}

	let body = new Array();
	let existingEvents = await new Promise((resolve, reject) => {
		jsonFile.readFile(file, async function (err, obj) {
			let res = obj;
			if (res === undefined) {
				res = [];
			}
			resolve(res);
			if (err) reject(err);
		});
	});

	body = existingEvents;

	const hasDuplicate = body.some((e) => e.id === event.id);

	if (hasDuplicate) {
		return response.status(400).send('Duplicate Event. Cannot write to file.');
	}

	body.push(event);
	jsonFile.writeFile(file, body, function (err) {
		if (err) {
			console.log(err);
			return response.status(500).send(err);
		}
		return response.status(201).send('Written event successfully');
	});
});

router.delete('/', function (request, response) {
	jsonFile.writeFileSync(file, []);
	return response.status(200).send('json file deleted');
});

router.get('/actors/:id', async function (request, response) {
	const { id } = request.params;
	let data = new Array();
	let events = await new Promise((resolve, reject) => {
		jsonFile.readFile(file, async function (err, obj) {
			let res = obj;
			if (res === undefined) {
				res = [];
			}
			resolve(res);
			if (err) reject(err);
		});
	});

	data = events;
	if (!data.length) {
		return response.status(200).send('Event list is empty');
	}

	let actorEvents = [];
	actorEvents = data.filter((event) => Number(event.actor.id) === Number(id));
	return response.status(200).send({ actorEvents });
});

router.get('/', async function (request, response) {
	let data = new Array();
	let events = await new Promise((resolve, reject) => {
		jsonFile.readFile(file, async function (err, obj) {
			let res = obj;
			if (res === undefined) {
				res = [];
			}
			resolve(res);
			if (err) reject(err);
		});
	});

	data = events;
	return response.status(200).send({ data });
});
module.exports = router;
