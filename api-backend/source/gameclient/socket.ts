import { Server as SocketIOServer } from 'socket.io';
import http from 'http';
import { decodeAccessToken } from '../auth/auth';

export let io: SocketIOServer;

export function initializeWebSocketServer(server: http.Server): void {
    io = new SocketIOServer(server);

    io.on('connection', (ws) => {
        console.log(`User connected: ${ws.id}`);
        console.log(`Current rooms: ${Array.from(ws.rooms).join(', ')}`);
    
        // Handle 'joinRoom' Event
        ws.on('joinRoom', (data: { roomId: string; playerId: string }) => {
            const { roomId, playerId } = data;
            


            // Join the room
            ws.join(roomId);
            console.log(`User ${playerId} joined room ${roomId}`);
            console.log(`Updated rooms: ${Array.from(ws.rooms).join(', ')}`);
            
            // Notify other users in the room
            ws.to(roomId).emit('notification', `${playerId} has joined the room`);
        });
    
        // Handle 'sendMessage' Event
        ws.on('sendMessage', (data: { roomId: string; message: string }) => {
            const { roomId, message } = data;
    
            // Emit the message to all clients in the specified room
            ws.to(roomId).emit('message', {
                playerId: ws.id,
                message: message,
            });
        });
    
        // Handle disconnection
        ws.on('disconnect', () => {
            console.log(`User disconnected: ${ws.id}`);
            console.log(`Current rooms: ${Array.from(ws.rooms).join(', ')}`);
        });
    });
    

    console.log('WebSocket server initialized');
}
