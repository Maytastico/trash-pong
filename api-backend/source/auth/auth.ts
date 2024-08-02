import jwt from "jsonwebtoken";
import {SECRET_KEY} from './token'
import { registerAuthtoken } from "../database/user";
import { User } from "../types/User";

export function generateAccessToken(user: User):string {
    const userdata:User = user
    return jwt.sign({username: userdata.name, user_id: user.user_id}, SECRET_KEY, { expiresIn: '1800s' });
}   
