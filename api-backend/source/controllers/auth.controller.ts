import { Request, Response, NextFunction } from "express";
import { SECRET_KEY } from "../auth/token";
import { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";

export interface CustomRequest extends Request {
    token: string | JwtPayload;
}

/**
 *  Authenticates the User
 * @param req HTTP Request Object
 * @param res HTTP Response Object
 * @param next Callback to pass control to the next middleware function
 */
export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
   
      if (!token) {
        throw new Error();
      }
   
      const decoded = jwt.verify(token, SECRET_KEY);
      (req as CustomRequest).token = decoded;
   
      next();
    } catch (err) {
      res.status(401).send('Please authenticate');
    }
};