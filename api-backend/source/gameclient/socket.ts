import { Server as SocketIOServer } from 'socket.io';
import http from 'http';
import { SECRET_KEY} from '../auth/token';
import jwt, {JwtPayload} from 'jsonwebtoken';
import { decodeAccessToken } from '../auth/auth';
import { User } from '../types/User';
import { getRoom, updateRoom } from '../database/room';
import { Raum } from '../types/Room';

export let io: SocketIOServer;

export interface CustomRequest extends Request {
    token: string | JwtPayload;
}

export function initializeWebSocketServer(server: http.Server): void {
    io = new SocketIOServer(server);

    // Middleware zur Validierung der Verbindung
    io.use((socket, next) => {

        try {
            const token = socket.request.headers['authorization'];
         
            if (!token) {
              throw new Error("No Bearer Token set in header");
            }
         
            const decoded = jwt.verify(token, SECRET_KEY);
            console.log(decoded);
         
            next();
          } catch (err) {
            next(new Error("Invalid Authentication")); // Verbindung ablehnen
          }
        

    });

    io.on('connection', (ws) => {
        console.log(`User connected: ${ws.id}`);
        console.log(`Current rooms: ${Array.from(ws.rooms).join(', ')}`);
    
        // Handle 'joinRoom' Event
        ws.on('joinRoom', async (data: { roomId: number;}) => {
            const { roomId} = data;

            const token = ws.request.headers['authorization'];
                // Überprüfe, ob der Token existiert
            if (!token) {
                console.error('Authorization header is missing.');
                ws.emit('error', 'Authorization header is missing');
                return;
            }
            // decodeAccessToken sollte einen Fehler werfen, wenn der Token ungültig ist
            let player: User;
            try {
                player = decodeAccessToken(token);
            } catch (err) {
                console.error('Invalid token');
                ws.emit('error', 'Invalid token');
                return;
            }
            
            let room = await getRoom(roomId);

            if(!room){
                throw new Error("Room does not exist");
            }

            if (room.user_id1 !== player.user_id){
                await updateRoom(room.room_id, room.titel, room.passwort, room.öffentlich, room.user_id1, player.user_id);
            }

            // Join the room
            ws.join(roomId.toString());
            console.log(`User ${player.name} joined room ${roomId}`);
            console.log(`Updated rooms: ${Array.from(ws.rooms).join(', ')}`);
            
            // Notify other users in the room
            ws.to(roomId.toString()).emit('notification', `${player.name} has joined the room`);
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
