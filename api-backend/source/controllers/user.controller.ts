import { Request, Response, NextFunction } from "express";
import { generateAccessToken } from "../auth/auth";
import { doesUserExist, getUser, getUserByName, registerAuthtoken, registerUser } from "../database/user";
import { dbUser } from "./api.controller";
import { User } from "../types/User";

/**
 * Authenticates a User with Credentials
 * @param req HTTP Request Object
 * @param res HTTP Response Object
 * @param next Callback to pass control to the next middleware function
 * @returns Token of the User oder 400
 */
export const login = async (req: Request, res: Response, next: NextFunction) =>{
    let username: string = req.body.username
    res.setHeader('Content-Type', 'text/plain');
    if(username !== undefined){
        username = username.trim();
        if(username.length > 1){
            let result:boolean = await doesUserExist(username);
            if(result === false){
                await registerUser(username);
            }
            
            const user:User = await getUserByName(username);

            const token = generateAccessToken(user);
            registerAuthtoken(user.user_id, token);
                
            return res.send(token).status(200);
        }
    }
    return res.sendStatus(400);
}