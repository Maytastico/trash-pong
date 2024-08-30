import { io } from "./socket";
import { CustomWebSocket, RoomClient } from "../types/Room";
import { Socket } from "socket.io";

io.on('connection', (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);
    console.log(`Current rooms: ${Array.from(socket.rooms).join(', ')}`);

    // Handle 'joinRoom' Event
    socket.on('joinRoom', (data: { roomId: string; playerId: string }) => {
        const { roomId, playerId } = data;

        // Join the room
        socket.join(roomId);
        console.log(`User ${playerId} joined room ${roomId}`);
        console.log(`Updated rooms: ${Array.from(socket.rooms).join(', ')}`);
        
        // Notify other users in the room
        socket.to(roomId).emit('notification', `${playerId} has joined the room`);
    });

    // Handle 'sendMessage' Event
    socket.on('sendMessage', (data: { roomId: string; message: string }) => {
        const { roomId, message } = data;

        // Emit the message to all clients in the specified room
        socket.to(roomId).emit('message', {
            playerId: socket.id,
            message: message,
        });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        console.log(`Current rooms: ${Array.from(socket.rooms).join(', ')}`);
    });
});
