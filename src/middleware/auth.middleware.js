const { decode } = require('jsonwebtoken');
const jwt = require('jsonwebtoken');
const { StatusCodes, ReasonPhrases } = require('http-status-codes');

const secret = require('../../secret.json');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const decoded = jwt.verify(token, secret.key);

        req.userData = decoded;
        next();
    } catch (err) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            error: ReasonPhrases.UNAUTHORIZED,
        });
    }
}