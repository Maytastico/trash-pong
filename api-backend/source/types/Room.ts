import { User } from "./User"
import { Socket } from "socket.io";

export interface RoomClient{
    user: User,
    ws?: Socket,
}

export interface Raum{
    raum_id: number,
    titel: string,
    user_id1: number,
    user_id2: number,
    öffentlich: boolean,
    passwort: string,
    user1: string
    user2: string
}
