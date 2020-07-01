var express = require('express');
var router = express.Router();
const jsonFile = require('jsonfile');
const actors = require('../controllers/actors');
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
	let filterById = [];
	filterById = data.filter((event) => Number(event.actor.id) === Number(id));

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

router.get('/', async function (request, response) {
	try {
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
		let finalData = new Array();

		data = events;
		const actorIds = [...new Set(data.map((e) => e.actor.id))]; //get unique actor ids
		console.log({ actorIds });
		actorIds.map((id) => {
			const obj = new Object();
			obj.id = id;
			let actorEvents = [];
			actorEvents = data.filter((event) => Number(event.actor.id) === Number(id));
			obj.events = actorEvents;
			finalData.push(obj);
		});
		finalData = sortByNumberOfEvents(finalData);
		finalData = sortByCreatedAt(finalData);
		finalData = sortByLogin(finalData);
		return response.status(200).send({ actorsData: finalData });
	} catch (e) {
		console.log('here', e);
		return response.status(400).send('Something went wrong');
	}
});

function sortByNumberOfEvents(actorsData) {
	try {
		actorsData.sort((a, b) => {
			return b.events.length - a.events.length;
		});
		return actorsData;
	} catch (e) {
		throw e;
	}
}

function sortByCreatedAt(actorsData) {
	actorsData.sort((a, b) => {
		if (a.events.length === b.events.length) {
			a.events.sort((a, b) => {
				let fa = a.created_at;
				fb = b.created_at;

				if (fa < fb) {
					return 1;
				}
				if (fa > fb) {
					return -1;
				}
				return 0;
			});

			b.events.sort((a, b) => {
				let fa = a.created_at;
				fb = b.created_at;

				if (fa < fb) {
					return 1;
				}
				if (fa > fb) {
					return -1;
				}
				return 0;
			});
		}
	});
	return actorsData;
}

function sortByLogin(actorsData) {
	actorsData.sort((a, b) => {
		if (a.events.length === b.events.length) {
			a.events.sort((a, b) => {
				let fa = a.created_at;
				fb = b.created_at;

				if (fb === fa) {
					let sa = a.actor.login;
					let sb = b.actor.login;

					if (sa < sb) {
						return 1;
					}
					if (sa > sb) {
						return -1;
					}
					return 0;
				}
			});

			b.events.sort((a, b) => {
				let fa = a.created_at;
				fb = b.created_at;

				if (fb === fa) {
					let sa = a.actor.login;
					let sb = b.actor.login;

					if (sa < sb) {
						return 1;
					}
					if (sa > sb) {
						return -1;
					}
					return 0;
				}
			});
		}
	});
	return actorsData;
}

module.exports = router;
