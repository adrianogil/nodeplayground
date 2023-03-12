const express = require('express')
const friendsController = require('../controllers/friends.controller');

const friendsRouter = express.Router();

friendsRouter.use((req, res, next) => {
    console.log('IP address:', req.ip);
    next();
});

friendsRouter.get('/', friendsController.getAllFriends)
friendsRouter.get('/:friendId',friendsController.getFriends)
friendsRouter.post('/', friendsController.postFriends);

module.exports = {
    friendsRouter
}