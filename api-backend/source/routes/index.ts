import express from 'express';
import health from './health';
<<<<<<< HEAD
import user from './user';
=======
import api from './api';
import search from './search';
>>>>>>> 6600379b9bcc54005ee916994c9f70eb12197eb3

const router = express.Router();

router.use("/health", health);
<<<<<<< HEAD
router.use("/user", user);
=======
router.use("/api",api);
router.use("/search",search);
>>>>>>> 6600379b9bcc54005ee916994c9f70eb12197eb3

export default router;