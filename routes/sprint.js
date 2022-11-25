const express = require('express');
const { log } = require('../utils/logger');
const { getBugs } = require('../services/bugs');
const { getSprintBacklog, updateDBWithStoryDetails } = require('../services/sprintBacklog');

const router = express.Router();

router.get('/', async (req, res) => {
	const { sprintNumber } = req.query;

	log(`sprintNumber: ${sprintNumber}`);

	const bugsData = await getBugs(sprintNumber);
	const sprintIndicators = await getSprintBacklog(
		sprintNumber,
		bugsData.totalSpentBugs,
	);

	const result = {
		bugsData,
		sprintIndicators,
	};

	await updateDBWithStoryDetails({
		bugsData,
		sprintIndicators,
	});

	res.status(200).json(result);
});

module.exports = router;
