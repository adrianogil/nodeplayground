const express = require('express');
const path = require('path');

const messagesRoutes = require('./routes/messages.router');

global.appRoot = path.resolve(__dirname);
const app = express();

app.set('view engine', 'hbs');
app.set('views', path.join(global.appRoot,'views'));

const PORT = 3000;

// Logging middleware
app.use((req, res, next) => { 
    const start = Date.now();
    next();
    const delta = Date.now() - start;
    console.log(`${req.method} ${req.url} - ${delta}ms`);
})

app.use('/site', express.static(path.join(global.appRoot,'public')));
app.use(express.json());
app.use(express.urlencoded()); 

app.get('/', (res, req) => {
    req.render('index', {
        title: 'My Friends are very clever!',
        caption: 'Let\'s go skiing! On y va?' 
    })
});

app.use('/messages', messagesRoutes.messagesRouter);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`)
})
