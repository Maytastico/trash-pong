import express from 'express';
import health from './health';
import user from './user';

const router = express.Router();

router.use("/health", health);
router.use("/user", user);

export default router;