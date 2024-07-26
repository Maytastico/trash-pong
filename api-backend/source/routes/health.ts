import express from 'express';
import dbHealth from '../controllers/health.controller';
import pingFunction from '../controllers/ping.controller';

const router = express.Router();

router.get("/db", dbHealth);
router.get("/ping", pingFunction);

export default router;