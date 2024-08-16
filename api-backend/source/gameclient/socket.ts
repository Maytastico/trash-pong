import WebSocket from 'ws';
import http from 'http';

let wss: WebSocket.Server | undefined;

export function initializeWebSocketServer(server: http.Server): void {
    wss = new WebSocket.Server({ server });

    wss.on('connection', (ws) => {
        console.log('New WebSocket connection');

        ws.on('message', (message) => {
            console.log(`Received message: ${message}`);
            ws.send(`You said: ${message}`);
        });

        ws.on('close', () => {
            console.log('WebSocket connection closed');
        });
    });

    console.log('WebSocket server initialized');
}
