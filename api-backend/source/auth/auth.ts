import jwt, { decode } from "jsonwebtoken";
import {SECRET_KEY} from './token'
import { User } from "../types/User";
import { Raum } from "../types/Room";

enum TokenType{
    USER_TOKEN = "user_token",
    ROOM_TOKEN = "room_token"
}

interface UserToken{
    type: TokenType.USER_TOKEN,
    username: string,
    user_id: number
}

interface RoomToken{
    type: TokenType.ROOM_TOKEN,
    room_id: number,
    user_id1: number,
    user_id2: number
}

type DecodedToken = UserToken | RoomToken;

export function generateAccessToken(user: User):string {
    const token: UserToken = {
        type: TokenType.USER_TOKEN,
        username: user.name,
        user_id: user.user_id
    }
    return jwt.sign(token, SECRET_KEY, { expiresIn: '3200s' });
}   

export function generateRoomToken(room: Raum):string {
    const token: RoomToken = {
        type: TokenType.ROOM_TOKEN,
        room_id: room.raum_id,
        user_id1: room.user_id1,
        user_id2: room.user_id2,
    }
    return jwt.sign(token, SECRET_KEY, { expiresIn: '3200s' });
}   

export function decodeAccessToken(token: string): User | Raum | undefined{
    try {
        const decoded = jwt.decode(token) as DecodedToken;

        if (!decoded || typeof decoded !== 'object' || !decoded.type) {
            throw new Error("Invalid token");
        }

        // Prüfe den Typ des Tokens
        if (decoded.type === TokenType.USER_TOKEN) {
            return { user_id: decoded.user_id, name: decoded.username } as User;
        } else if (decoded.type === TokenType.ROOM_TOKEN) {
            return { raum_id: decoded.room_id, user_id1: decoded.user_id1, user_id2: decoded.user_id2 } as Raum;
        } else {
            throw new Error("Invalid token");
        }
    } catch (error) {
        console.error("Error decoding token:", error);
    }
}