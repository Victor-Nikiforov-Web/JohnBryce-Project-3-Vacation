const express = require('express');
const server = express();
const cors = require('cors');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const socketIO = require('socket.io');
const registerController = require('./controller/register-controller');
const loginController = require('./controller/login-controller');
const vacationController = require('./controller/vacation-controller');
const vacationsLogic = require('./business-logic/vacation-logic');

server.use(fileUpload());
server.use(cors());
server.use(express.json());

if (!fs.existsSync('../Client/public/assets/images/vacations')) {
    fs.mkdirSync('../Client/public/assets/images/vacations');
}

server.use('/api/register', registerController);
server.use('/api/login', loginController);
server.use('/api/vacations', vacationController);


const expressListener = server.listen(3000, () => console.log('server is online'));
const socketIOServer = socketIO(expressListener);
socketIOServer.sockets.on("connection", async socket => {
    socket.on('get-all-vacations', async () => {
        socketIOServer.sockets.emit("get-all-vacations", await vacationsLogic.getAllVacations());
    });
    socket.on("msg-from-client", msg => console.log(socket.id + ": " + msg));
});