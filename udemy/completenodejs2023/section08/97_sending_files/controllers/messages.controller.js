const path = require('path');


const messages = [
    "Hello from Moi"
]

function getMessages(req, res) {
    res.setHeader('Content-Type', 'text/html')
    res.write('<ul>');
    for (let index = 0; index < messages.length; index++) {
        const message = messages[index];
        res.write(`<li>${message}</li>`);
    }
    res.write('<ul>');
    res.end();
}

function getMessageImage(req, res) {
    const filePath = path.join(__dirname, 'images', 'skimountain.jpg');
    console.log(`Sending file ${filePath}`)
    res.sendFile(filePath);
}

function postMessages(req, res) {
    if (!req.body.message) {
        return res.status(400).json({
            error: 'Missing message field'
        })
    }

    console.log('Updating messages...');
    const newMessage = req.body.message
    messages.push(newMessage)
    res.json({"message": newMessage})
}

module.exports = {
    getMessages,
    postMessages,
    getMessageImage
}