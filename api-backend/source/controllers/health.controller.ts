import { Request, Response, NextFunction } from "express";
import {checkConnection} from "../database/conn";

const dbHealth = async (req: Request, res: Response, next: NextFunction) =>{
    await checkConnection();
    return res.sendStatus(200);
}

export default dbHealth;