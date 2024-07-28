import { Request, Response, NextFunction } from "express";
import { generateAccessToken, registerUserToken } from "../auth/auth";

export const login = async (req: Request, res: Response, next: NextFunction) =>{
    const username: string = req.body.username
    if(username !== undefined){
        if(username.length > 1){
            const token = generateAccessToken(username)
            registerUserToken(username, token)
            
            return res.send(token).status(200);
        }
    }
    return res.sendStatus(400);
}

