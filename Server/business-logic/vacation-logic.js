const dal = require('../data-access/dal');

async function getAllVacations() {
    const sql = `SELECT * from vacations`;
    const vacations = await dal.executeAsync(sql);
    return vacations;
}

async function getOneVacation(id) {
    const sql = `SELECT * from vacations WHERE vacationID = ${id}`;
    const vacation = await dal.executeAsync(sql);
    return vacation;
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

async function addNewVacation(vacation) {
    const sql = `INSERT INTO vacations(description,destination,image,fromDate,toDate,price)
    VALUES('${vacation.description}','${vacation.destination}','${vacation.image}',
    '${fixDateFormat(vacation.fromDate)}','${fixDateFormat(vacation.toDate)}',${vacation.price})`;
    const info = await dal.executeAsync(sql);
    vacation.vacationID = info.insertId;
    return vacation;
}

async function deleteVacation(id) {
    const sql = `DELETE FROM vacations WHERE vacationID = ${id}`;
    await dal.executeAsync(sql);
}

async function updateVacation(vacation) {
    const sql = `
        UPDATE vacations SET
        destination = '${vacation.destination}',
        description = '${vacation.description}',
        fromDate = '${fixDateFormat(vacation.fromDate)}',
        toDate = '${fixDateFormat(vacation.toDate)}',
        image = '${vacation.image}',
        price = ${vacation.price}
        WHERE vacationID = ${vacation.vacationID}`;
    const info = await dal.executeAsync(sql);
    return info.affectedRows === 0 ? null : vacation;
}

async function getAllFollowedVacations() {
    const sql = 'SELECT * FROM savedvacations';
    const vacations = await dal.executeAsync(sql);
    return vacations;
}

function fixDateFormat(date) {
    const newDate = new Date(date);
    const year = newDate.getFullYear();
    const month = newDate.getMonth() + 1;
    const day = newDate.getDate();
    return `${year}-${month}-${day}`;
}
module.exports = {
    getAllVacations,
    followVacation,
    getFollowedVacations,
    deleteFollowedVacation,
    addNewVacation,
    deleteVacation,
    getOneVacation,
    updateVacation,
    getAllFollowedVacations
}