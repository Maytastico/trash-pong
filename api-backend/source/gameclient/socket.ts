import { Socket, Server as SocketIOServer } from 'socket.io';
import http from 'http';
import { SECRET_KEY} from '../auth/token';
import jwt, {JwtPayload} from 'jsonwebtoken';
import { decodeAccessToken, generateRoomToken } from '../auth/auth';
import { User } from '../types/User';
import { deleteRoom, getRoom, getRoomsByPlayerID, joinRoom, updateRoom } from '../database/room';
import { Raum } from '../types/Room';
import { Bounce, Goal, Paddle } from '../types/Game';

export let io: SocketIOServer;

export interface CustomRequest extends Request {
    token: string | JwtPayload;
}

/**
 * Get the token either trought headers or by handshake
 * Used for Godot and Debugging with Postman
 * @param socket 
 * @returns 
 */
function getToken(socket: Socket<any>): string{
    const headers = socket.request.headers

    let token:  string;

    if(headers['authorization'])
        token = headers['authorization']
    else if(socket.handshake.auth.token){
        token = socket.handshake.auth.token
    }else{
        throw new Error("No Bearer Token set in header");
    }
    return token;
}

export function initializeWebSocketServer(server: http.Server): void {
    io = new SocketIOServer(server);

    io.use((socket: Socket<any>, next) => {

        try {
            const token = getToken(socket)
         
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
            // Holt sich die RaumID vom Payload
            const { roomId} = data;
            let player: User;

            // Verifiziert den JWT Token und extrhiert die Daten des senders
            try {
                const token = getToken(ws);
                player = decodeAccessToken(token) as User;
            } catch (err) {
                console.error('Invalid token');
                ws.emit('error', 'Invalid token');
                return;
            }
            
            // Holt sich die Informationen des Raums
            let room: Raum = await getRoom(roomId);
 
            
            // Wenn beim holen der Raum informationen etwas fehlschlägt
            // Wird ausgegeben, dass der Raum nicht exestiert
            if (room === null || typeof room === 'undefined') {
                // Wenn der Raum nicht existiert, wird der Fehler gefangen und an den Client gesendet
                ws.emit('error', 'Room does not exist');
                return; 
                }
            
            if (room.user_id2 !== undefined){
                ws.emit('error', 'Room is full');
                return;
            }

            // When the player is not the user that created the room stored in user_id one the 
            // player that joined that game will be associated with user_id2
            if (room.user_id1 !== player.user_id){
                joinRoom(undefined, player.user_id, roomId)
            }

            // Join the room
            ws.join(roomId.toString());
            console.log(`User ${player.name} joined room ${roomId}`);
            console.log(`Updated rooms: ${Array.from(ws.rooms).join(', ')}`);
            
            // Notify other users in the room
            ws.to(roomId.toString()).emit('notification', `${player.name} has joined the room`);
        });

        ws.on('startPressed', async () => {       
            // decodeAccessToken sollte einen Fehler werfen, wenn der Token ungültig ist
            let player: User;
            try {
                const token = getToken(ws);
                player = decodeAccessToken(token) as User;
            } catch (err) {
                console.error('Invalid token');
                ws.emit('error', 'Invalid token');
                return;
            }
            
            let room: Raum[] = await getRoomsByPlayerID(player.user_id);
            
            if (room === null || typeof room === 'undefined' || room.length == 0) {
                // Wenn der Raum nicht existiert, wird der Fehler gefangen und an den Client gesendet
                ws.emit("error", "No room associated with this user");
                return; // Beenden der Funktion, um den Fehler zu behandeln
            }
            
            // Generiert einen neuen Room Token
            let roomToken = generateRoomToken(room[0])

            // Sendet den Room Token an den sender und in den raum
            ws.emit("starting_game", {"start_game": true, "room_token": roomToken});
            ws.to(room[0].raum_id.toString()).emit("starting_game", {"start_game": true, "room_token": roomToken});
            // Join the room
            console.log(`User ${player.name} started game ${room[0].raum_id}`);
            
            // Notify other users in the room
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
        
        ws.on('update_paddle', async (data: {room_token: string, position_x: number, position_y: number, motion: number}) => {
            const token = getToken(ws);
            const {room_token, position_x, position_y, motion} = data;
            // decodeAccessToken sollte einen Fehler werfen, wenn der Token ungültig ist
            let player: User;
            let room: Raum;
            try {
                player = decodeAccessToken(token) as User;
                if (room_token){
                   jwt.verify(room_token, SECRET_KEY);
                   room = decodeAccessToken(room_token) as Raum;
                }else{
                    ws.emit('error', 'Invalid room token');
                    return;
                }
            } catch (err) {
                ws.emit('error', 'Invalid token');
                return;
            }
            
            const paddle: Paddle = {
                username: player.name,
                position_x: position_x,
                position_y: position_y,
                motion: motion          
            }
            
            ws.to(room.raum_id.toString()).emit("update_paddle", paddle)
        });

        ws.on('bounce', async (data: {room_token: string, left: boolean, random: number}) => {
            const token = getToken(ws);
            const {room_token, left, random} = data;

            // decodeAccessToken sollte einen Fehler werfen, wenn der Token ungültig ist
            let player: User;
            let room: Raum;
            try {
                player = decodeAccessToken(token) as User;
                console.log(room_token)
                if (room_token){
                   jwt.verify(room_token, SECRET_KEY);
                   room = decodeAccessToken(room_token) as Raum;
                }else{
                    ws.emit('error', 'Invalid room token');
                    return;
                }
            } catch (err) {
                ws.emit('error', 'Invalid token');
                return;
            }
            
            const bounce: Bounce = {
                username: player.name,
                left: left,
                random: random
            }
            
            ws.to(room.raum_id.toString()).emit("bounce", bounce)
        });

        ws.on('goal', async (data: {room_token: string, left: boolean}) => {
            const token = getToken(ws);
            const {room_token, left} = data;

            // decodeAccessToken sollte einen Fehler werfen, wenn der Token ungültig ist
            let player: User;
            let room: Raum;
            try {
                player = decodeAccessToken(token) as User;
                if (room_token){
                   jwt.verify(room_token, SECRET_KEY);
                   room = decodeAccessToken(room_token) as Raum;
                }else{
                    ws.emit('error', 'Invalid room token');
                    return;
                }
            } catch (err) {
                ws.emit('error', 'Invalid token');
                return;
            }
            
            const goal: Goal = {
                username: player.name,
                left: left,
            }
            
            ws.to(room.raum_id.toString()).emit("goal", goal)
        });

        // Handle disconnection
        ws.on('disconnect', async () => {
            const token = getToken(ws);
            const player: User = decodeAccessToken(token) as User;
            
            const rooms: Raum[] = await getRoomsByPlayerID(player.user_id);
            
            rooms.forEach(async (raum) => {
                ws.to(raum.raum_id.toString()).emit("game", JSON.parse(`{"disconnected": "${player.user_id}"}`))
                await deleteRoom(raum.raum_id)
            });
        });
    });
    

    console.log('WebSocket server initialized');
}
