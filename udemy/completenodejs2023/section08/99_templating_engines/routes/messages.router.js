const express = require('express')
const messagesController = require('../controllers/messages.controller');

const messagesRouter = express.Router();
messagesRouter.get('/', messagesController.getMessages)
messagesRouter.post('/', messagesController.postMessages)
messagesRouter.get('/image', messagesController.getMessageImage)

module.exports = {
    messagesRouter
}