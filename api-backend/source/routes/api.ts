import express from 'express';
import {dbRoom, dbAllRooms, dbUser} from '../controllers/api.controller';
import {dbCreateRoom} from '../controllers/api.controller'; 
import { dbUpdateRoom } from '../controllers/api.controller';
import { dbDeleteRoom } from '../controllers/api.controller';  
import { auth } from '../controllers/auth.controller';

const router = express.Router();

router.get("/room/:id", auth, dbRoom);
router.get("/room", auth, dbAllRooms);
router.post("/room", auth, dbCreateRoom);
//router.put("/room/:id",auth, dbUpdateRoom);
//router.delete("/room/:id",auth, dbDeleteRoom);
router.get("/user/:id", auth, dbUser);

export default router;