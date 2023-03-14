const path = require('path');

const messageModel = require('../models/messages.model')

function getMessages(req, res) {
    var currentMessages = []
    for (let index = 0; index < messageModel.messages.length; index++) {
        const message = messageModel.messages[index];
        currentMessages.push({
            message: message
        });
    }
    res.render('messages', {
        title: 'Messages',
        messages: currentMessages
    })
}

function renderFriendMessage(req, res) {
    res.render('messages', {
        title: 'Messages to my Friends!',
        friend: 'Jonh Carmark'
    })
}

function getMessageImage(req, res) {
    const filePath = path.join(global.appRoot, 'public', 'images', 'skimountain.jpg');
    console.log(`Sending file ${filePath}`)
    res.sendFile(filePath);
}

function postMessages(req, res) {
    console.log(`postMessages - ${req.query.message}`)

    if (!req.body.message) {
        return res.status(400).json({
            error: 'Missing message field'
        })
    }

    console.log('Updating messages...');
    const newMessage = req.body.message
    messageModel.messages.push(newMessage)
    
    getMessages(req, res);
}

module.exports = {
    getMessages,
    postMessages,
    getMessageImage,
    renderFriendMessage
}