// wsServer.js

const WebSocket = require('ws');

// Create a WebSocket server
const wss = new WebSocket.Server({ port: 8080 }); // You can change the port number as needed

console.log('WebSocket server is running on ws://localhost:8080');

// Handle new connections
wss.on('connection', (ws) => {
    console.log('New client connected');

    // Handle incoming messages
    ws.on('message', (message) => {
        console.log(`Received: ${message}`);

        // Broadcast the message to all connected clients
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message); // Send the received message to each client
            }
        });
    });

    // Handle disconnection
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});
