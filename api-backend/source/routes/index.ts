import express from 'express';
import test from './test';
import pingFunction from '../controllers/ping.controller';
import health from './health';

const router = express.Router();

router.use("/test", test);
router.use("/ping", pingFunction);
router.use("/health", health);

export default router;