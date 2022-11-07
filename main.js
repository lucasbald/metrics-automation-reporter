const express = require('express');
const { log } = require('./utils/logger');

const indexRouter = require('./routes/index');
const sprintRouter = require('./routes/sprint');
const storyRouter = require('./routes/story');

const app = express();
const port = 3000;

app.use('/', indexRouter);
app.use('/sprint', sprintRouter);
app.use('/story', storyRouter);

app.listen(port, () => {
	log(`App listening on port ${port}`);
});

module.exports = app;
