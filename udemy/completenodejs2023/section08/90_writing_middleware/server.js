const express = require('express');

const app = express();

const PORT = 3000;

const friends = [
    {
        id: 0,
        name: 'Isaac Newton'
    },
    {
        id: 1,
        name: 'Albert Einsten'
    }
]

// Logging middleware
app.use((req, res, next) => { 
    const start = Date.now();
    next();
    const delta = Date.now() - start;
    console.log(`${req.method} ${req.url} - ${delta}ms`);
})

app.get('/', (req, res) => {
    res.send('Heeeellloooo');
})

app.get('/messages', (req, res) => {
    res.send('<ul><li>Hello from Moi</li><ul>');
})

app.get('/friends', (req, res) => {
    res.send(friends);
})

app.get('/friends/:friendId', (req, res) => {
    const friendId = req.params.friendId;
    const friend = friends[Number(friendId)];

    if (friend) {
        res.json(friend);
    } else {
        res.status(404).json({
            error: "Friend does not exist"
        })
    };
        
})

app.post('/messages', (req, res) => {
    console.log('Updating messages...');
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`)
})
