import { Request, Response, NextFunction } from "express";
import {getRoom} from "../database/room";
import { getAllRooms } from "../database/room";
import { createRoom } from "../database/room";
import { updateRoom } from "../database/room";
import { deleteRoom } from "../database/room"; 
import { getUser } from "../database/user";
import { decodeAccessToken } from "../auth/auth";
import { User } from "../types/User";

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
    const reqHeader = req.header('Authorization')
    let token:string
    if (reqHeader){
      token = reqHeader.replace('Bearer ', '');
    }else{
      return res.status(401).send('Authorization header is missing');
    }

    try {
      const { title, pw, oeffentlich} = req.body;
      let user: User = decodeAccessToken(token) as User;
      if (!title || oeffentlich === undefined) {
        return res.status(400).json({ error: "title is requiered and room state is requiered" });
      }
      if(oeffentlich == false && !pw){
        return res.status(400).json({ error: "When creating a private room a password is requiered" });
      }
      const newRoom = await createRoom(title, pw, oeffentlich, user.user_id, null);
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
    
    if (!title || !pw || oeffentlich === undefined || user_id1 === undefined) {
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