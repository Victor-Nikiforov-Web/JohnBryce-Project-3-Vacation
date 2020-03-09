const express = require('express');
const router = express.Router();
const loginLogic = require('../business-logic/login-logic');
const jwt = require('jsonwebtoken');

router.post('/', async (request, response) => {
    try {
        const user = request.body;
        const userLogin = await loginLogic.login(user);
        if (userLogin === 0) {
            throw "User name / Password is wrong";
        }
        response.status(201).json(userLogin);
    } catch (error) {
        response.status(500).send(error);
    }
});


router.get('/login-check', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if (err) {
            res.json(err);
        } else {
            res.json(authData);
        }
    });
});
router.post('/login-save', (req, res) => {
    const user = req.body;
    jwt.sign({ user }, 'secretkey', (err, token) => {
        res.json({ token });
    });
});

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
}
module.exports = router;