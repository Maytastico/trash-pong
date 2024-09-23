
/**
 * Represents the payload for a basic event in the game.
 * 
 * @interface BasicPayload
 * 
 * @property {string} username - The username of the player.
 */
interface BasicPayload{
    username: string
}

/**
 * Represents a paddle in the game, used for communication over WebSockets.
 * 
 * @extends BasicPayload
 * 
 * @property {number} position_x - The x-coordinate of the paddle's position.
 * @property {number} position_y - The y-coordinate of the paddle's position.
 * @property {number} motion - The current motion state of the paddle.
 */
export interface Paddle extends BasicPayload{
    position_x: number,
    position_y: number,
    motion: number
}


/**
 * Represents the payload for a bounce event in the game.
 * 
 * @interface Bounce
 * @extends BasicPayload
 * 
 * @property {boolean} left - Indicates if the bounce occurred on the left side.
 * @property {number} random - A random value associated with the bounce event.
 */
export interface Bounce extends BasicPayload{
    left: boolean,
    random: number
}

/**
 * Represents the payload for a goal event in the game.
 * 
 * @extends BasicPayload
 * 
 * @property {boolean} left - Indicates if the goal occurred on the left side.
 */
export interface Goal extends BasicPayload{
    left: boolean,
}

/**
 * Represents the payload for the end event in the game.
 * 
 * @extends BasicPayload
 */
export interface End extends BasicPayload{
    
}