import express from 'express';
import {dbRoom, dbAllRooms, dbUser} from '../controllers/api.controller';
import {dbCreateRoom} from '../controllers/api.controller'; 
import { dbUpdateRoom } from '../controllers/api.controller';
import { dbDeleteRoom } from '../controllers/api.controller';  
import { auth } from '../controllers/auth.controller';

const router = express.Router();

/**
 * Retrieves a specific room by its unique identifier.
 * @route GET /room/:id
 * @param {string} :id - The unique identifier of the selected room.
 * @middleware auth - Authentication middleware to protect the route.
 * @function dbRoom - Controller function to fetch and return the room data.
 * @returns {Object} - JSON object containing the room data if found, or 404 if not.
 * Example:
 * get room/1 returns Room with Id 1
 */
router.get("/room/:id", auth, dbRoom);
/**
 * Retrieves all Rooms
 * @route GET /room
 * @middleware auth - Authentication middleware to protect the route.
 * @function dbAllRoom - Controller function to fetch and return the room data.
 * @returns {Object} - JSON object containing the data of all rooms if found, or 404 if not.
 */
router.get("/room", auth, dbAllRooms);
/**
 * Creates a specific room
 * @route Post /room
 * @middleware auth - Authentication middleware to protect the route.
 * @function dbCreateRoom - Controller function to create a room
 * @returns {Object} - JSON object containing the room data if found, or 400/401 if not.
 */
router.post("/room", auth, dbCreateRoom);
//router.put("/room/:id",auth, dbUpdateRoom);
//router.delete("/room/:id",auth, dbDeleteRoom);
/**
 * Retrieves a specific User by its unique identifier.
 * @route GET /user/:id
 * @param {string} :id - The unique identifier of the selected User.
 * @middleware auth - Authentication middleware to protect the route.
 * @function dbUser - Controller function to fetch and return the User data.
 * @returns {Object} - JSON object containing the user data if found, or 404 if not.
 * Example:
 * get user/1 returns User with Id 1
 */
router.get("/user/:id", auth, dbUser);

export default router;