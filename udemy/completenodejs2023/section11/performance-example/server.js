const express = require('express');
const os = require('os');

const app = express();

function delay(duration) {
    const startTime = Date.now();
    while (Date.now() - startTime < duration) {
        // do nothing
    }
};

app.get('/', (req, res) => {
    res.send(`Performance example: ${process.pid}`);
});

app.get('/timer', (req, res) => {
    // delay the response
    delay(9000);
    res.send('Ding ding ding');
});


console.log(`Worker ${process.pid} started`);

app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});
