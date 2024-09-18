import express from 'express';
import dbHealth from '../controllers/health.controller';
import pingFunction from '../controllers/ping.controller';

const router = express.Router();
/**
 * Checks the Connection 
 * @route GET /db
 * @middleware auth - Authentication middleware to protect the route.
 * @function dbHealth- Controller function to check the Connection.
 * @returns {Object} - Json of the Hostname.
 */
router.get("/db", dbHealth);
/**
 * Pings the Server
 * @route GET /ping
 * @middleware auth - Authentication middleware to protect the route.
 * @function pingFunction - Controller function to ping the server.
 * @returns {Object} - JSON of the Hostname.
 */
router.get("/ping", pingFunction);

export default router;