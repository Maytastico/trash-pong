import express from 'express';
import {dbRoom} from '../controllers/api.controller';
import { dbAllRooms } from '../controllers/api.controller';

const router = express.Router();

router.get("/room/:id", dbRoom);
router.get("/room", dbAllRooms);

export default router;