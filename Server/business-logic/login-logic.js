const dal = require('../data-access/dal');

async function login(user) {
    const sql = `SELECT * from users WHERE userName = "${user.userName}" and password = "${user.password}"`;
    const login = await dal.executeAsync(sql);
    if (login.length === 0) {
        return 0;
    }
    return login;
}

module.exports = {
    login
}