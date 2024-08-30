import { Server as SocketIOServer } from 'socket.io';
import http from 'http';

export let io: SocketIOServer;

export function initializeWebSocketServer(server: http.Server): void {
    io = new SocketIOServer(server);

    io.on('connection', (ws) => {
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
