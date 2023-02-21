// const internals = require('./internals')
// const request = require('./request');
// const response = require('./response');
const { read, send } = require('./internals')

function makeRequest(url, data) {
    send(url, data);
    return read();
}

const responseData = makeRequest('https://www.google.com', 'my_data');
console.log(responseData)

// console.log(require.cache)
