# WebSocket Messaging Demo (Node.js 24)

This demo is a standalone Node.js 24 project that showcases realtime messaging over WebSockets with support for text, emoji, and image sharing.

## Features

- Realtime messaging across connected clients.
- Emoji quick-insert buttons for faster reactions.
- Image uploads sent as Data URLs.
- Minimal, dependency-free server (no frameworks).

## Running the demo

```bash
cd petitprojects/websocketmessaging
node server.js
```

Then open `http://localhost:3000` in multiple browser tabs to test live messaging.

## How it works

### HTTP server

`server.js` uses Node's built-in `http` server to serve static assets from the `public` directory. The root path (`/`) maps to `public/index.html`, while `/css` and `/js` requests map to their respective files.

### WebSocket handshake

The server listens for `upgrade` events, validates the `Sec-WebSocket-Key` header, and returns the `101 Switching Protocols` response with a SHA-1 + Base64 accept value as defined in RFC6455.

### WebSocket frames

Incoming frames are parsed manually:

- The frame header is read to determine opcode, masking, and payload length.
- Masked client payloads are unmasked using the masking key.
- Text frames are decoded as JSON and broadcast to all connected clients.

Outgoing messages are framed as unmasked server-to-client text frames and broadcast to all connected sockets.

### Client flow

`public/js/app.js` opens a `WebSocket` connection to the same host, sends JSON payloads for text and image messages, and renders incoming messages in the live feed. Image files are converted to Data URLs using `FileReader`.
