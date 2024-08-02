import jwt from "jsonwebtoken";
import {SECRET_KEY} from './token'
import { registerAuthtoken } from "../database/user";
import { User } from "../types/User";

export function generateAccessToken(user: User):string {
    return jwt.sign(user, SECRET_KEY, { expiresIn: '1800s' });
}   
