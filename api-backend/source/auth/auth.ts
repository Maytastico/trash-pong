import jwt from "jsonwebtoken";
import {SECRET_KEY} from './token'


export type User = {
    username: string;
    token: string;
};

let users: Array<User> = [];

export function generateAccessToken(username: string):string {
    return jwt.sign({username: username}, SECRET_KEY, { expiresIn: '1800s' });
}   

export function registerUserToken(username: string, token: string): void{
    let element: User= {username: username, token: token};
    users.push(element)
}

export function getUserFromToken(token:string): User | undefined{
    return users.find(user => user.token === token);
}
