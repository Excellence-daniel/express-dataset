var express = require('express');
var router = express.Router();

// Route related to delete events

router.get('/events', function (req, res, next) {
	const data = {};
	res.send('done').status(200);
});

router.delete('/', function (req, res) {
	res.status(200).send('deleted');
});

module.exports = router;
