import { Request, Response, NextFunction } from "express";
import {checkConnection} from "../database/conn";
import os from 'os';

const dbHealth = async (req: Request, res: Response, next: NextFunction) =>{
    await checkConnection();
    return res.status(200).json({"url": os.hostname()});
}

export default dbHealth;