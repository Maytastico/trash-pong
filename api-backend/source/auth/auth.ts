import jwt, { decode } from "jsonwebtoken";
import {SECRET_KEY} from './token'
import { User } from "../types/User";
import { Raum } from "../types/Room";


/**
 * Possible types of authentication tokens
 */
enum TokenType{
    USER_TOKEN = "user_token",
    ROOM_TOKEN = "room_token"
}

/**
 * Payload object for user tokens
 */
interface UserToken{
    type: TokenType.USER_TOKEN,
    username: string,
    user_id: number
}

/**
 * Payload object for room object
 */
interface RoomToken{
    type: TokenType.ROOM_TOKEN,
    room_id: number,
    user_id1: number,
    user_id2: number
}

/**
 * Storage Type for temopary encoding of tokens
 */
type DecodedToken = UserToken | RoomToken;


/**
 * Creates an access token form a User object, it encodes the username, as well as the user_id
 * as a base64 string and creates a jwt token out of it.
 * @param user User object
 * @returns jwt token
 */
export function generateAccessToken(user: User):string {
    const token: UserToken = {
        type: TokenType.USER_TOKEN,
        username: user.name,
        user_id: user.user_id
    }
    return jwt.sign(token, SECRET_KEY, { expiresIn: '3200s' });
}   


/**
 * Creates an access token from a Raum object, encodes the ids and returns it as 
 * a base64 encoded jwt token
 * @param room Raum object
 * @returns jwt token
 */
export function generateRoomToken(room: Raum):string {
    const token: RoomToken = {
        type: TokenType.ROOM_TOKEN,
        room_id: room.raum_id,
        user_id1: room.user_id1,
        user_id2: room.user_id2,
    }
    return jwt.sign(token, SECRET_KEY, { expiresIn: '3200s' });
}   

/**
 * Decodes the token after a defined type and parses it to a User or Raum object
 * This object just contains ids from the token. If you want to have more information the
 * database has to be requested.
 * 
 * @param token token from reqest
 * @returns Raum or User object
 */
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