import express from 'express';
import health from './health';
import user from './user';
import api from './api';
import search from './search';
import { auth } from '../controllers/auth.controller';

const router = express.Router();

/**
 * Mounts the health check router to handle health-related routes.
 * @route /health
 * @module health - Router module containing health check route handlers.
 * 
 * This setup means that:
 * 1. All requests to routes starting with /health will be handled by the `health` router.
 * 2. The `health` router typically includes endpoints for monitoring the health status of the application,
 *    such as checking if the service is up and running or if critical components are functioning correctly.
 * 
 * Example:
 * - Request to /health/status will be routed to the `health` router to check the status of the application.
 */
router.use("/health", health);
/**
 * Mounts the user router for handling user-related routes.
 * @route /user
 * @module user - Router module containing user-related route handlers.
 * 
 * This setup means that:
 * 1. All requests to routes starting with /user will be handled by the `user` router.
 * 2. The `user` router can include routes for operations such as user registration, login, profile management, etc.
 * 
 * Example:
 * - Request to /user/register will be routed to the `user` router for handling user registration.
 * - Request to /user/profile will be handled by the `user` router for managing user profiles.
 */
router.use("/user", user);
/**
 * Mounts the API router with authentication middleware.
 * @route /api
 * @middleware auth - Middleware function to handle authentication for all routes under /api.
 * @module api - Router module containing API route handlers.
 * 
 * This setup ensures that:
 * 1. The `auth` middleware is applied to all routes starting with /api. 
 *    It performs authentication checks and other preliminary tasks before routing.
 * 2. The `api` router module handles all routes under /api once authentication is successful.
 * 
 * Example:
 * - Request to /api/users will first pass through the `auth` middleware,
 *   and then be handled by the `api` router if authenticated.
 */
router.use("/api", auth, api);
/**
 * Mounts the search router with authentication middleware.
 * @route /search
 * @middleware auth - Middleware function to handle authentication for all routes under /search.
 * @module search - Router module containing search-related route handlers.
 * 
 * This setup means that:
 * 1. The `auth` middleware is applied to all routes starting with /search. 
 *    It performs authentication checks to ensure that the user is authenticated before accessing the search routes.
 * 2. The `search` router module handles all routes under /search once authentication is successful.
 *    This module typically includes endpoints for performing search operations, such as querying and retrieving search results.
 * 
 * Example:
 * - Request to /search/query will first pass through the `auth` middleware,
 *   and then be handled by the `search` router if the user is authenticated.
 */
router.use("/search", auth, search);

export default router;