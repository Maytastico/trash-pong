import express from 'express';
import {dbRoom, dbAllRooms} from '../controllers/api.controller';
import {dbCreateRoom} from '../controllers/api.controller'; 
import { dbUpdateRoom } from '../controllers/api.controller';
import { dbDeleteRoom } from '../controllers/api.controller';  


const router = express.Router();

router.get("/room/:id", dbRoom);
router.get("/room", dbAllRooms);
router.post("/room", dbCreateRoom);
router.put("/room/:id",dbUpdateRoom);
router.delete("/room/:id", dbDeleteRoom);

export default router;