const express = require('express');
const router = express.Router();
const vacationLogic = require('../business-logic/vacation-logic');
const jwtLogic = require('../business-logic/jwt-logic');
const jwt = require('jsonwebtoken');
const fs = require('fs');

router.get('/', async (request, response) => {
    try {
        const vacations = await vacationLogic.getAllVacations();
        response.json(vacations);
    } catch (error) {
        response.status(500).send(error);
    }
});

router.get('/:id', async (request, response) => {
    try {
        const id = +request.params.id;
        const vacation = await vacationLogic.getOneVacation(id);
        response.json(vacation[0]);
    } catch (error) {
        response.status(500).send(error);

    }
});

router.post('/followVacation', async (request, response) => {
    try {
        const info = request.body;
        const sendInfo = await vacationLogic.followVacation(info);
        response.json(sendInfo);
    } catch (error) {
        response.status(500).send(error);
    }
});

router.get('/get-followed-vacations/:id', async (request, response) => {
    try {
        const id = request.params.id;
        const vacations = await vacationLogic.getFollowedVacations(id);
        response.json(vacations);
    } catch (error) {
        response.status(500).send(error);
    }
});
// remove followed vacation
router.delete('/delete/:vacationID/:userID', async (request, response) => {
    try {
        const userID = +request.params.userID;
        const vacationID = +request.params.vacationID;
        await vacationLogic.deleteFollowedVacation(userID, vacationID);
        response.sendStatus(204);
    } catch (error) {
        response.status(500).send(error);

    }
});

router.post('/new-vacation', jwtLogic.verifyToken, async (request, response) => {
    try {
        jwt.verify(request.token, 'secretkey', (err, authData) => {
            if (authData.user.isAdmin !== 1) {
                throw "Error !"
            }
        });
        const vacation = request.body;
        const newVacation = await vacationLogic.addNewVacation(vacation);
        response.status(201).json(newVacation);
    } catch (error) {
        response.status(500).send(error);
    }
});

router.delete('/delete-vacation', jwtLogic.verifyToken, async (request, response) => {
    try {
        jwt.verify(request.token, 'secretkey', (err, authData) => {
            if (authData.user.isAdmin !== 1) {
                throw "Error !"
            }
        });
        const vacation = request.body;
        fs.unlinkSync(`../Client/public/assets/images/vacations/${vacation.image}`)
        await vacationLogic.deleteVacation(vacation.vacationID);
        response.sendStatus(204);
    } catch (error) {
        response.status(500).send(error);
    }
});

router.put('/update-vacation', jwtLogic.verifyToken, async (request, response) => {
    try {
        jwt.verify(request.token, 'secretkey', (err, authData) => {
            if (authData.user.isAdmin !== 1) {
                throw "Error !"
            }
        });
        const vacation = request.body;
        const updatedVacation = await vacationLogic.updateVacation(vacation);

        if (updatedVacation === null) {
            response.sendStatus(404);
            return;
        }

        response.json(updatedVacation);
    } catch (error) {
        response.status(500).send(error);
    }
});

router.get('/followed/get-all', jwtLogic.verifyToken, async (request, response) => {
    try {
        jwt.verify(request.token, 'secretkey', (err, authData) => {
            if (authData.user.isAdmin !== 1) {
                throw "Error !"
            }
        });
        const vacations = await vacationLogic.getAllFollowedVacations();
        response.json(vacations);
    } catch (error) {
        response.status(500).send(error);
    }
});


module.exports = router;