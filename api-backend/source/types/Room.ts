import { User } from "./User"
import { Socket } from "socket.io";

export interface RoomClient{
    user: User,
    ws?: Socket,
}

export interface CustomWebSocket extends Socket {
    roomId?: string;
    playerId?: string;
}