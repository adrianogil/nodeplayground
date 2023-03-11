
const express = require('express');

const app = express();

const PORT = 3000;

app.get('/', (req, res) => {
    res.send('Heeeellloooo');
})

app.get('/messages', (req, res) => {
    res.send('<ul><li>Hello from Moi</li><ul>');
})

app.get('/friends', (req, res) => {
    res.send({
        id: 1,
        name: "Moi"
    });
})

app.post('/messages', (req, res) => {
    console.log('Updating messages...');
})

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`)
})
