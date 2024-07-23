import express from 'express';
import testFunction from '../controllers/test.controller';

const router = express.Router();

router.get("/testRouter", testFunction);

export default router;