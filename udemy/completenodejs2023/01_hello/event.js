const EventMitter = require('events');
const celebrity = new EventMitter();

// Subscribe to celebrity for Observer 1
celebrity.on('race win', function() {
    console.log('Congratulations! You are the best!')
})

// Subscribe to celebrity for Observer 2
celebrity.on('race lost', function() {
    console.log('Boo I could have better than that!')
})

celebrity.emit('race win')
celebrity.emit('race lost')
celebrity.emit('race win')