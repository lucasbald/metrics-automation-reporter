const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
	res.send('For more information check our <a href="https://github.com/lucasbald/metrics-automation-reporter/blob/main/README.md">README</a> file on Github.');
});

module.exports = router;
