const express = require('express');
const router = express.Router();
const uuidv4 = require('uuid/v4');
const jwt = require('jsonwebtoken');
const jwtLogic = require('../business-logic/jwt-logic');


router.post('/', jwtLogic.verifyToken, (request, response) => {
    try {
        if (!request.files) {
            response.status(400).send('No File Sent !');
            return;
        }
        jwt.verify(request.token, 'secretkey', (err, authData) => {
            if (authData.user.isAdmin !== 1) {
                throw "Error !"
            }
        });

        const file = request.files.image;
        const randomName = uuidv4();
        const extension = file.name.substr(file.name.lastIndexOf('.'));
        file.mv('../Client/public/assets/images/vacations/' + randomName + extension);
        response.status(201).json(randomName + extension);
    } catch (error) {
        response.status(500).send(error);

    }

});

module.exports = router;