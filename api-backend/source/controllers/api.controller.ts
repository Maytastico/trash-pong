import { Request, Response, NextFunction } from "express";
import {getRoom} from "../database/room";
import { getAllRooms } from "../database/room";
import { createRoom } from "../database/room";
import { updateRoom } from "../database/room";
import { deleteRoom } from "../database/room"; 
import { getUser } from "../database/user";

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

  const dbCreateRoom = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, pw, oeffentlich, user_id1, user_id2 } = req.body;
      if (!title || !pw || oeffentlich === undefined || user_id1 === undefined) {
        return res.status(400).json({ error: "Alle Felder außer user_id2 sind notwendig!" });
      }
      const newRoom = await createRoom(title, pw, oeffentlich, user_id1, user_id2);
      return res.status(201).json(newRoom);
    } catch (err) {
      return next(err);
    }
  }
export{dbCreateRoom}; 

const dbUpdateRoom = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roomId = parseInt(req.params.id, 10);
    const { title, pw, oeffentlich, user_id1, user_id2 } = req.body;
    
    if (!title || !pw || oeffentlich === undefined || user_id1 === undefined || user_id2 === undefined) {
      return res.status(400).json({ error: "All fields are required" });
    }
    
    const updatedRoom = await updateRoom(roomId, title, pw, oeffentlich, user_id1, user_id2);
    
    if (updatedRoom) {
      return res.status(200).json(updatedRoom);
    } else {
      return res.sendStatus(404); // Falls kein Raum gefunden wurde
    }
  } catch (err) {
    return res.sendStatus(404);
  }
}
export{dbUpdateRoom}

const dbDeleteRoom = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const roomId = parseInt(req.params.id, 10);
    const deletedRoom = await deleteRoom(roomId);
    
    if (deletedRoom) {
      return res.status(200).json(deletedRoom);
    } else {
      return res.sendStatus(404); // Falls kein Raum gefunden wurde
    }
  } catch (err) {
    return res.sendStatus(404);
  }
};

export { dbDeleteRoom };

const dbUser = async (req: Request, res: Response, next: NextFunction) =>{
  const userId = parseInt(req.params.id, 10);
  const user = await getUser(userId);
  if (user) {
      return res.json(user).status(200);
  } else {
    return res.sendStatus(404); // Falls kein Raum gefunden wurde
  }
}

export { dbUser };