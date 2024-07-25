import express from 'express';
import test from './test';
import pingFunction from '../controllers/ping.controller';
import health from './health';
import api from './api';

const router = express.Router();

router.use("/test", test);
router.use("/ping", pingFunction);
router.use("/health", health);
router.use("/api",api);

export default router;