import jwt from "jsonwebtoken";
import {SECRET_KEY} from './token'
import { registerAuthtoken } from "../database/user";


export type User = {
    username: string;
    token: string;
};

let users: Array<User> = [];

export function generateAccessToken(username: string):string {
    return jwt.sign({username: username}, SECRET_KEY, { expiresIn: '1800s' });
}   

export function registerUserToken(username: string, token: string): void{
    registerAuthtoken()
}

export function getUserFromToken(token:string): User | undefined{
    return users.find(user => user.token === token);
}
