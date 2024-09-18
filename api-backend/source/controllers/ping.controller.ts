import { Request, Response, NextFunction } from "express";
import os from 'os';

const pingFunction = async (req: Request, res: Response, next: NextFunction) =>{
    console.log(os.hostname());
    return res.status(200).json({"url": os.hostname()});
}

export default pingFunction;