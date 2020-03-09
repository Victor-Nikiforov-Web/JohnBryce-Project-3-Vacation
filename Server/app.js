const express = require('express');
const server = express();
const cors = require('cors');
const registerController = require('./controller/register-controller');
const loginController = require('./controller/login-controller');
const vacationController = require('./controller/vacation-controller');

server.use(cors());
server.use(express.json());

server.use('/api/register', registerController);
server.use('/api/login', loginController);
server.use('/api/vacations', vacationController);


server.listen(3000, () => console.log('server is online'));