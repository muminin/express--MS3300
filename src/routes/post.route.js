const chalk = require('chalk');
const express = require('express');
const router = express();
const { StatusCodes, ReasonPhrases } = require('http-status-codes');

const checkAuth = require('../middleware/auth.middleware');

const Post = require('../models/post.model');

router.use(express.json());

router.post('/post/new', checkAuth, (req, res) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content,
    });

    post.save().then(result => res.sendStatus(StatusCodes.CREATED)).catch(err => {
        console.log(chalk.red(err));
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: err });
    })
});

module.exports = router;