import { Request, Response, NextFunction } from "express";
import os from 'os';

/**
 * Pings the server
 * @param req HTTP Request Object
 * @param res HTTP Response Object
 * @param next Callback to pass control to the next middleware function
 * @returns Json of the Hostname
 */
const pingFunction = async (req: Request, res: Response, next: NextFunction) =>{
    console.log(os.hostname());
    return res.status(200).json({"url": os.hostname()});
}

export default pingFunction;