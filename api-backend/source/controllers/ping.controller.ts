import { Request, Response, NextFunction } from "express";

const pingFunction = async (req: Request, res: Response, next: NextFunction) =>{
    return res.sendStatus(200);
}

export default pingFunction;