const express = require('express');
const router = express();
const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const bcyrpt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = require('../../secret.json');

const checkAuth= require('../middleware/auth.middleware');

const User = require('../models/user.model');
const { json } = require('express/lib/response');

// * Registration
router.post('/user/registration', (req, res) => {
    User.find({ email: req.body.email }).exec().then(users => {
        if (users.length >= 1) {
            return res.status(StatusCodes.CONFLICT).json({
                message: "Email already taken",
            });
        }

        bcyrpt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
                return res.status(StatusCodes.INTERNAL_SERVER_ERROR), json({
                    error: err,
                });
            }

            const user = new User({
                email: req.body.email,
                password: hash,
            });

            user.save().then(result => {
                res.status(StatusCodes.CREATED).json({
                    message: 'User created',
                });
            }).catch(err => {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    error: err,
                });
            });
        })
    })
});

// * Delete User
router.delete('/user/delete/:userId', checkAuth, (req, res) => {
    User.deleteOne({ _id: req.params.userId }).exec().then(response => {
        res.status(StatusCodes.OK).json({
            message: 'User deleted',
        });
    }).catch(err => {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: err,
        });
    });
});

// * Login
router.post('/user/login', (req, res) => {
    User.find({ email: req.body.email }).exec().then(users => {
        if (users.length < 1) {
            return res.sendStatus(StatusCodes.NOT_FOUND);
        }

        bcyrpt.compare(req.body.password, users[0].password, (err, isEqual) => {
            if (err) {
                return res.sendStatus(StatusCodes.UNAUTHORIZED);
            }

            if (isEqual) {
                // * create a token
                const token = jwt.sign({
                    email: users[0].email,
                    userId: users[0]._id,
                }, secret.key, {
                    expiresIn: "1h", // ? required for human error security
                });

                return res.status(StatusCodes.OK).json({
                    message: "Auth success",
                    token: token,
                });
            }

            return res.sendStatus(StatusCodes.UNAUTHORIZED);
        });
    }).catch(err => {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: err,
        });
    })
});

module.exports = router;