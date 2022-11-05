const express = require('express');
const { log } = require('../utils/logger');
const { getStoryDetails } = require('../services/storyDetails');

const router = express.Router();

router.get('/', async (req, res) => {
	const { storyTicket } = req.query;

	log(`storyTicket: ${storyTicket}`);

	const storyDetails = await getStoryDetails(storyTicket);

	res.status(200).json(storyDetails);
});

module.exports = router;
