const request = require('./request');
const response = require('./response');

function makeRequest(url, data) {
    request.send(url, data);
    return response.read();
}

const responseData = makeRequest('https://www.google.com', 'my_data');
console.log(responseData)

console.log(require.cache)
