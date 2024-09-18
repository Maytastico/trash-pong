import { Request, Response, NextFunction } from "express";
import {checkConnection} from "../database/conn";
import os from 'os';

/**
 * Checks the Connection
 * @param req HTTP Request Object
 * @param res HTTP Response Object
 * @param next Callback to pass control to the next middleware function
 * @returns Json of the Hostname
 */
const dbHealth = async (req: Request, res: Response, next: NextFunction) =>{
    await checkConnection();
    console.log(os.hostname);
    return res.status(200).json({"url": os.hostname()});
}

export default dbHealth;