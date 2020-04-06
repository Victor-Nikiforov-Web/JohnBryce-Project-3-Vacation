const express = require('express');
const server = express();
const cors = require('cors');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const registerController = require('./controller/register-controller');
const loginController = require('./controller/login-controller');
const vacationController = require('./controller/vacation-controller');

server.use(fileUpload());
server.use(express.static(__dirname));
server.use(cors());
server.use(express.json());

if (!fs.existsSync('../Client/public/assets/images/vacations')) {
    fs.mkdirSync('../Client/public/assets/images/vacations');
}

server.use('/api/register', registerController);
server.use('/api/login', loginController);
server.use('/api/vacations', vacationController);


server.listen(3000, () => console.log('server is online'));