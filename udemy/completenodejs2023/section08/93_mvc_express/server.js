const express = require('express');
const friendsController = require('./controllers/friends.controller');
const messagesController = require('./controllers/messages.controller');

const app = express();

const PORT = 3000;

// Logging middleware
app.use((req, res, next) => { 
    const start = Date.now();
    next();
    const delta = Date.now() - start;
    console.log(`${req.method} ${req.url} - ${delta}ms`);
})

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Heeeellloooo');
})

app.get('/messages', messagesController.getMessages)
app.post('/messages', messagesController.postMessages)

app.get('/friends', friendsController.getAllFriends)
app.get('/friends/:friendId',friendsController.getFriends)
app.post('/friends', friendsController.postFriends);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`)
})
