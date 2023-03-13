const express = require('express');
const path = require('path');

const friendsRoutes = require('./routes/friends.router');
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

app.get('/', (res, req) => {
    req.render('index', {
        title: 'My Friends are very clever!',
        caption: 'Let\'s go skiing! On y va?' 
    })
});

// app.get('/', (req, res) => {
//     res.send('Heeeellloooo');
// })

app.use('/messages', messagesRoutes.messagesRouter);
app.use('/friends', friendsRoutes.friendsRouter);

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}...`)
})
