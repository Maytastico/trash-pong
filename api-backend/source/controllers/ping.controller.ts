import { Request, Response, NextFunction } from "express";
import axios, {AxiosResponse} from "axios";

const pingFunction = async (req: Request, res: Response, next: NextFunction) =>{
    return res.sendStatus(200);
}

export default pingFunction;