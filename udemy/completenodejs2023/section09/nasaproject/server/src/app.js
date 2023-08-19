const express = require('express');
const morgan = require('morgan')
const cors = require('cors');
// Setup global root path
const path = require('path');
global.appRoot = path.resolve(__dirname);

const planetsRouter = require('./routes/planets/planets.router');

app = express();
app.use(cors({
    origin: 'http://localhost:3000'
}));
app.use(morgan('combined'));

app.use(express.json());
app.use(express.static(path.join(global.appRoot, '..', 'public')));
app.use(planetsRouter);

app.get('/', (req, res) => {
    res.sendFile(path.join(global.appRoot, '..', 'public', 'index.html'))
})

module.exports = app;