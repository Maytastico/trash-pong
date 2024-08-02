import jwt from "jsonwebtoken";
import {SECRET_KEY} from './token'
import { registerAuthtoken } from "../database/user";

export function generateAccessToken(username: string):string {
    return jwt.sign({username: username}, SECRET_KEY, { expiresIn: '1800s' });
}   
