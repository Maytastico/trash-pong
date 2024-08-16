import jwt, { decode } from "jsonwebtoken";
import {SECRET_KEY} from './token'
import { User } from "../types/User";

export function generateAccessToken(user: User):string {
    const userdata:User = user
    return jwt.sign({username: userdata.name, user_id: user.user_id}, SECRET_KEY, { expiresIn: '1800s' });
}   

export function decodeAccessToken(token: string): User{
    
    let decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    const user: User = {user_id: decoded.user_id, name: decoded.username};
    return user;
}