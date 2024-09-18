import { Request, Response, NextFunction } from "express";
import { SearchRooms } from "../database/room"; 

const dbRoomSearch = async (req: Request, res: Response, next: NextFunction) =>{
    const roomTitle = req.params.search as string;
    const room = await SearchRooms(roomTitle);
    if (room) {
        return res.json(room).status(200);
    } else {
      return res.sendStatus(404); // Falls kein Raum gefunden wurde
    }
}

export default dbRoomSearch;