import express from 'express';
import dbRoom from '../controllers/api.controller';

const router = express.Router();

router.get("/room/:id", dbRoom);

export default router;