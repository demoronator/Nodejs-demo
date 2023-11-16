const WebSocket = require('ws');
const logger = require('./logger');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
    logger.info(`A new client connected: ${ws._socket.remoteAddress}`);

    ws.on('message', function incoming(message) {
        logger.info(`Received message from: ${ws._socket.remoteAddress}\n${message}`);

        // Broadcast message to all connected clients
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message, { binary: false });
            }
        });
    });

    ws.on('close', () => {
        logger.info(`Client disconnected: ${ws._socket.remoteAddress}`);
    });
});

logger.info(`Websocket server listening on port ${wss.options.port}`);
