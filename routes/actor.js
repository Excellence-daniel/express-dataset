var express = require('express');
var router = express.Router();
const jsonFile = require('jsonfile');
const file = '/Users/daniel/Documents/projects/express-dataset/data/events.json';

// Routes related to actor.

router.put('/', async function (request, response) {
	const actorBody = request.body;
	const { id, avatar_url } = actorBody;

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

	console.log(typeof data, 'type data');

	let filterById = [];
	filterById = data.filter((event) => Number(event.actor.id) === Number(id));

	console.log({ filterById });

	if (!filterById.length) {
		return response.status(404).send('Event by this actor not found');
	}

	filterById.map((event) => {
		const index = data.findIndex((e) => e.id === event.id);
		event.actor.avatar_url = avatar_url;
		data[index] = event;
	});

	jsonFile.writeFile(file, data, function (err) {
		if (err) {
			console.log(err);
			return response.status(500).send(err);
		}
		return response.status(200).send('Updated successfully');
	});
});

module.exports = router;
