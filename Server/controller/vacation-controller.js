const express = require('express');
const router = express.Router();
const vacationLogic = require('../business-logic/vacation-logic');

router.get('/', async (request, response) => {
    try {
        const vacations = await vacationLogic.getAllVacations();
        response.json(vacations);
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
module.exports = router;