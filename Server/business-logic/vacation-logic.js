const dal = require('../data-access/dal');

async function getAllVacations() {
    const sql = `SELECT * from vacations`;
    const vacations = await dal.executeAsync(sql);
    return vacations;
}
async function followVacation(data) {
    const sql = `INSERT INTO savedvacations(userID,vacationID)
    VALUES(${data.user} ,${data.vacation})`;
    const vacation = await dal.executeAsync(sql);
    return vacation;
}

async function getFollowedVacations(userID) {
    const sql = `SELECT vacationID FROM savedvacations 
    where ${userID} = userID`;
    const vacations = await dal.executeAsync(sql);
    return vacations;
}

async function deleteFollowedVacation(userID, vacationID) {
    const sql = `DELETE FROM savedvacations WHERE userID = ${userID} and vacationID = ${vacationID}`;
    await dal.executeAsync(sql);
}

module.exports = {
    getAllVacations,
    followVacation,
    getFollowedVacations,
    deleteFollowedVacation
}