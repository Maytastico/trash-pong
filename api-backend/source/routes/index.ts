import express from 'express';
import health from './health';
import user from './user';
import api from './api';
import search from './search';
import { auth } from '../controllers/auth.controller';

const router = express.Router();

router.use("/health", health);
router.use("/user", user);
router.use("/api", auth, api);
router.use("/search", auth, search);

export default router;