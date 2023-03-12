const express = require('express');
const friendsRoutes = require('./routes/friends.router');
const messagesRoutes = require('./routes/messages.router');

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

app.use('/messages', messagesRoutes.messagesRouter);
app.use('/friends', friendsRoutes.friendsRouter);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`)
})
