import express from 'express';
import dbHealth from '../controllers/health.controller';

const router = express.Router();

router.get("/db", dbHealth);

export default router;