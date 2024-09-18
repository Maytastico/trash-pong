import express from 'express';
import dbRoomSearch from '../controllers/search.controller';

const router = express.Router();

router.get("/:search", dbRoomSearch);

export default router;