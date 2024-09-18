import express from 'express';
import { login } from '../controllers/user.controller';

const router = express.Router();

/**
 * Handles user login requests.
 * @route POST /login
 * @module login - Route handler for user authentication.
 * 
 * This setup means that:
 * 1. A POST request to /login will be handled by the `login` route handler.
 * 2. The `login` module typically includes logic for authenticating users, 
 *    such as verifying credentials and issuing authentication tokens or session cookies.
 * 
 * Example:
 * - Request to /login with user credentials in the request body will be processed by the `login` handler,
 *   which will authenticate the user and respond accordingly (e.g., issuing a token or returning an error).
 */
router.post("/login", login);

export default router;