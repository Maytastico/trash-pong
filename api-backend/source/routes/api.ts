import express from 'express';
import {dbRoom} from '../controllers/api.controller';
import { dbAllRooms } from '../controllers/api.controller';
import { auth } from '../controllers/auth.controller';

const router = express.Router();

router.get("/room/:id", auth, dbRoom);
router.get("/room", auth, dbAllRooms);

export default router;