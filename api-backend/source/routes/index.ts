import express from 'express';
import test from './test';
import pingFunction from '../controllers/ping.controller';

const router = express.Router();

router.use("/test", test);
router.use("/ping", pingFunction);

export default router;