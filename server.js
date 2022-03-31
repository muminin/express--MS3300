const express = require('express');
const app = express();
const PORT = 1234;
const chalk = require('chalk');
const { StatusCodes } = require('http-status-codes');

app.use(require('./src/routes/post.route'));
app.use(require('./src/routes/user.route'));

app.listen(PORT, () => {
    console.log(chalk.blue(`Server started on port ${PORT}`))
});

app.get('/test', (req, res) => {
    res.sendStatus(StatusCodes.OK);
});

