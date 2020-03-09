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

async function unFollowedVacation(data) {
    const sql = `SELECT * FROM savedvacations WHERE userID = ${data.user} and vacationID = ${data.vacation} `;
    const unFollowedVacation = await dal.executeAsync(sql);
}

async function getFollowedVacations(userID) {
    const sql = `select * from savedvacations 
    where ${userID} = userID`;
    const vacations = await dal.executeAsync(sql);
    return vacations;
}

module.exports = {
    getAllVacations,
    followVacation,
    unFollowedVacation ,
    getFollowedVacations
}