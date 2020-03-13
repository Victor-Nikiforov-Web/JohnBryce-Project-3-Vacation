const dal = require('../data-access/dal');

async function addUser(user) {
    //check user name
    const checkUserName = `SELECT * from users WHERE userName = '${user.userName}'`;
    const userNameResult = await dal.executeAsync(checkUserName);
    if (userNameResult.length != 0) {
        return 0;
    }
    // check for full form
    if (user.firstName === undefined || user.lastName === undefined || user.userName === undefined
        || user.password === undefined) {
        return 1;
    }
    const sql = `INSERT INTO users(firstName ,lastName ,userName, password ,isAdmin)
    VALUES ('${user.firstName}','${user.lastName}','${user.userName}','${user.password}',false)`;
    const info = await dal.executeAsync(sql);
    user.userID = info.insertId;
    user.isAdmin = false ;
    return user;
}

module.exports = {
    addUser
}