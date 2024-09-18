import express from 'express';
import dbRoomSearch from '../controllers/search.controller';

const router = express.Router();
/**
 * Retrieves a specific room by its name.
 * @route GET /:search
 * @param {string} :search - The name of the room to search.
 * @function dbRoomSearch - Controller function to fetch and return the room data of the searched room.
 * @returns {Object} - JSON object containing the room data if found, or 404 if not.
 * Example:
 * get /World returns Room with Name World
 */
router.get("/:search", dbRoomSearch);

export default router;