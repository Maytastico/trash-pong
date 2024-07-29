import { Request, Response, NextFunction } from "express";
import {getRoom} from "../database/room";
import { getAllRooms } from "../database/room";  

const dbRoom = async (req: Request, res: Response, next: NextFunction) =>{
    const roomId = parseInt(req.params.id, 10);
    const room = await getRoom(roomId);
    if (room) {
        return res.json(room).status(200);
    } else {
      return res.sendStatus(404); // Falls kein Raum gefunden wurde
    }
}

const dbAllRooms = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const rooms = await getAllRooms();
      return res.status(200).json(rooms);
    } catch (err) {
        return res.sendStatus(404);
    }
  }
  
  export { dbRoom, dbAllRooms };