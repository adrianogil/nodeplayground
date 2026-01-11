const crypto = require('crypto');
const http = require('http');
const fs = require('fs/promises');
const path = require('path');

const PORT = 3000;
const WEBSOCKET_GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
const MAX_PAYLOAD_BYTES = 5 * 1024 * 1024;
const publicDir = path.join(__dirname, 'public');

const clients = new Set();

const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml'
};

const createAcceptValue = (webSocketKey) =>
    crypto
        .createHash('sha1')
        .update(`${webSocketKey}${WEBSOCKET_GUID}`)
        .digest('base64');

const createFrame = (payload) => {
    const payloadLength = payload.length;
    let headerLength = 2;

    if (payloadLength >= 126 && payloadLength < 65536) {
        headerLength += 2;
    } else if (payloadLength >= 65536) {
        headerLength += 8;
    }

    const frame = Buffer.alloc(headerLength + payloadLength);
    frame[0] = 0x81;

    if (payloadLength < 126) {
        frame[1] = payloadLength;
        payload.copy(frame, 2);
    } else if (payloadLength < 65536) {
        frame[1] = 126;
        frame.writeUInt16BE(payloadLength, 2);
        payload.copy(frame, 4);
    } else {
        frame[1] = 127;
        frame.writeBigUInt64BE(BigInt(payloadLength), 2);
        payload.copy(frame, 10);
    }

    return frame;
};

const parseFrame = (buffer) => {
    if (buffer.length < 2) {
        return null;
    }

    const firstByte = buffer[0];
    const secondByte = buffer[1];
    const opcode = firstByte & 0x0f;
    const masked = Boolean(secondByte & 0x80);
    let payloadLength = secondByte & 0x7f;
    let offset = 2;

    if (payloadLength === 126) {
        if (buffer.length < offset + 2) {
            return null;
        }
        payloadLength = buffer.readUInt16BE(offset);
        offset += 2;
    } else if (payloadLength === 127) {
        if (buffer.length < offset + 8) {
            return null;
        }
        payloadLength = Number(buffer.readBigUInt64BE(offset));
        offset += 8;
    }

    const maskLength = masked ? 4 : 0;
    if (buffer.length < offset + maskLength + payloadLength) {
        return null;
    }

    let maskingKey;
    if (masked) {
        maskingKey = buffer.slice(offset, offset + 4);
        offset += 4;
    }

    const payload = buffer.slice(offset, offset + payloadLength);
    if (masked) {
        for (let i = 0; i < payload.length; i += 1) {
            payload[i] ^= maskingKey[i % 4];
        }
    }

    return {
        opcode,
        payload,
        payloadLength,
        frameLength: offset + payloadLength
    };
};

const broadcast = (payload) => {
    const message = Buffer.from(JSON.stringify(payload));
    const frame = createFrame(message);
    for (const client of clients) {
        client.write(frame);
    }
};

const sendSystemMessage = (socket, content) => {
    const message = Buffer.from(
        JSON.stringify({
            type: 'system',
            content,
            timestamp: new Date().toISOString()
        })
    );
    socket.write(createFrame(message));
};

const handleMessage = (payloadBuffer) => {
    let payload;
    try {
        payload = JSON.parse(payloadBuffer.toString());
    } catch (error) {
        return;
    }

    if (!payload || typeof payload !== 'object') {
        return;
    }

    const { type, content, name, fileName } = payload;
    if (typeof content !== 'string' || !content.trim()) {
        return;
    }

    const safeType = type === 'image' ? 'image' : 'text';
    const safeName = typeof name === 'string' && name.trim() ? name.trim().slice(0, 32) : 'Guest';
    const safeFileName = typeof fileName === 'string' && fileName.trim() ? fileName.trim().slice(0, 80) : null;

    broadcast({
        type: safeType,
        content,
        name: safeName,
        fileName: safeFileName,
        timestamp: new Date().toISOString()
    });
};

const serveFile = async (filePath, res) => {
    try {
        const data = await fs.readFile(filePath);
        const ext = path.extname(filePath);
        res.writeHead(200, {
            'Content-Type': mimeTypes[ext] || 'application/octet-stream'
        });
        res.end(data);
    } catch (error) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Not Found');
    }
};

const server = http.createServer(async (req, res) => {
    if (req.method !== 'GET') {
        res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Method Not Allowed');
        return;
    }

    const requestPath = req.url === '/' ? '/index.html' : req.url;
    const safePath = path.normalize(requestPath).replace(/^([.]{2}[\/])+/, '');
    const filePath = path.join(publicDir, safePath);

    await serveFile(filePath, res);
});

server.on('upgrade', (req, socket) => {
    if (req.headers.upgrade !== 'websocket') {
        socket.destroy();
        return;
    }

    const webSocketKey = req.headers['sec-websocket-key'];
    if (!webSocketKey) {
        socket.destroy();
        return;
    }

    const acceptValue = createAcceptValue(webSocketKey);
    const responseHeaders = [
        'HTTP/1.1 101 Switching Protocols',
        'Upgrade: websocket',
        'Connection: Upgrade',
        `Sec-WebSocket-Accept: ${acceptValue}`
    ];

    socket.write(`${responseHeaders.join('\r\n')}\r\n\r\n`);
    socket.setNoDelay(true);
    socket.setTimeout(0);
    socket.setKeepAlive(true);
    socket.buffer = Buffer.alloc(0);

    clients.add(socket);
    sendSystemMessage(socket, 'Connected to the WebSocket demo!');

    socket.on('data', (chunk) => {
        socket.buffer = Buffer.concat([socket.buffer, chunk]);
        let frame = parseFrame(socket.buffer);

        while (frame) {
            if (frame.payloadLength > MAX_PAYLOAD_BYTES) {
                socket.end();
                return;
            }

            socket.buffer = socket.buffer.slice(frame.frameLength);

            if (frame.opcode === 0x8) {
                socket.end();
                return;
            }

            if (frame.opcode === 0x1) {
                handleMessage(frame.payload);
            }

            frame = parseFrame(socket.buffer);
        }
    });

    socket.on('close', () => {
        clients.delete(socket);
    });

    socket.on('error', () => {
        clients.delete(socket);
    });
});

server.listen(PORT, () => {
    console.log(`WebSocket messaging demo running at http://localhost:${PORT}`);
});
