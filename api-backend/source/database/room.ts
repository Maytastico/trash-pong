import { QueryResult } from "pg";
import { Raum } from "../types/Room";
import { pool } from "./conn";

/**
 * Fetches all information from a given room id. It merges the user information with the given room.
 * This is used for database requests that are found inside the REST API as well as for verification reasons inside the game client
 * websocket.
 * @param id id of the requested Room
 * @returns Room as object
 */
export async function getRoom(id: number): Promise<Raum> {
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT r.*, s.name AS user1, sp.name AS user2 FROM Raum r LEFT JOIN "user" s ON s.user_id = r.user_id1 LEFT JOIN "user" sp ON sp.user_id = r.user_id2 WHERE r.raum_id = $1 LIMIT 1;', [id]);
    return res.rows[0] as Raum;
  } finally {
    client.release();
  }
}

/**
 * When joining a room, there is the possibility that one or two users will join.
 * Either uid1, uid2, or both are set when updating the database. When both parameters are not set,
 * the result will be null.
 * 
 * Example combinations: 
 * joinRoom(undefined, 2)
 * joinRoom(5, undefined)
 * joinRoom(5, 6)
 * 
 * This function is used for synchronizing the activity happening between the game client component
 * and the database.
 * @param uid_1 id of user one (optional)
 * @param uid_2 id of user two (optional)
 * @param room_id id of the room
 * @returns updated Room object or null when no request is executed
 */
export async function joinRoom(
  uid_1: number | undefined, 
  uid_2: number | undefined, 
  room_id: number
): Promise<Raum | null> {
  const client = await pool.connect();
  
  try {
    const query_all_user = `UPDATE Raum SET user_id1 = $1, user_id2 = $2 WHERE raum_id = $3 RETURNING *;`;
    const query_uid1 = `UPDATE Raum SET user_id1 = $1 WHERE raum_id = $2 RETURNING *;`;
    const query_uid2 = `UPDATE Raum SET user_id2 = $1 WHERE raum_id = $2 RETURNING *;`;
    
    let res: QueryResult<Raum>;

    if (typeof uid_1 !== 'undefined' && typeof uid_2 !== 'undefined') {
      res = await client.query(query_all_user, [uid_1, uid_2, room_id]);
    } else if (typeof uid_1 !== 'undefined') {
      res = await client.query(query_uid1, [uid_1, room_id]);
    } else if (typeof uid_2 !== 'undefined') {
      res = await client.query(query_uid2, [uid_2, room_id]);
    } else {
      // If neither `uid_1` nor `uid_2` are present, return `null`.
      return null;
    }
    
    return res.rows[0] as Raum || null;  // Return the first result or `null` if no rows are returned.
    
  } finally {
    client.release();
  }
}

/**
 * Returns all Rooms that the specified user has joined.
 * 
 * This is used to determine which Rooms a user has joined to delete them
 * or when a user created a room but the websocket does not have the room information. 
 * @param uid id of the user that joined the specified room
 * @returns a list of rooms a user has joined
 */
export async function getRoomsByPlayerID(
  uid: number | undefined, 
): Promise<Raum[]> {
  const client = await pool.connect();
  
  try {
    const res = await client.query('SELECT r.*, s.name AS user1, sp.name AS user2 FROM Raum r LEFT JOIN "user" s ON s.user_id = r.user_id1 LEFT JOIN "user" sp ON sp.user_id = r.user_id2 WHERE user_id1=$1 or user_id2=$1;', [uid]);
    return res.rows as Raum[];
  } finally {
    client.release();
  }
}

/**
 * Fetches all existing rooms from the database.
 * @returns list of rooms
 */
export async function getAllRooms(): Promise<any[]> {
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT r.*,s.name as user1, sp.name as user2 FROM Raum r LEFT JOIN "user" s on s.user_id=r.user_id1 LEFT JOIN "user" sp on sp.user_id=r.user_id2;');
    return res.rows;
  } catch (err) {
    console.error('Error executing query', err);
    throw err;  // Forward the error to the caller
  } finally {
    client.release();
  }
}

/**
 * Searches for a specific room title.
 * @param search search string
 * @returns all Rooms matching 
 */
export async function SearchRooms(search: string) {
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT r.* FROM Raum r where r.titel like $1;', [`%${search}%`]);
    return res.rows;
  } catch (err) {
    console.error('Error executing query', err);
    throw err;  // Forward the error to the caller
  } finally {
    client.release();
  }
}

/**
 * Creates a specific room.
 * @param title String Title for the new Room
 * @param pw String Password for the Room (or null)
 * @param oeffentlich Boolean If the Room is public
 * @param user_id1 Number User who created the Room
 * @param user_id2 Number User who joined the Room
 * @returns the Room ID for the new Room
 */
export async function createRoom(title: string, pw: string, oeffentlich: boolean, user_id1: number, user_id2: number | null) {
  const client = await pool.connect();
  try {
    const res = await client.query('Insert into Raum(titel, passwort, öffentlich, user_id1, user_id2) values($1, $2, $3, $4, $5) RETURNING raum_id;', [title, pw, oeffentlich, user_id1, user_id2]);
    return res.rows;
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error executing query', err);
    throw err;  // Forward the error to the caller
  } finally {
    client.release();
  } 
}

/**
 * Updates a specific Room.
 * @param id Number ID of the Room
 * @param title String Updated Title
 * @param pw String Updated Password
 * @param oeffentlich Boolean Update if the Room is public
 * @param user_id1 Number User in the Room
 * @param user_id2 Number User in the Room
 * @returns the updated Room
 */
export async function updateRoom(id: number, title: string, pw: string, oeffentlich: boolean, user_id1: number, user_id2: number): Promise<any> {
  const client = await pool.connect();
  try {
    const query = `
      UPDATE Raum 
      SET titel = $1, passwort = $2, öffentlich = $3, user_id1 = $4, user_id2 = $5 
      WHERE raum_id = $6 
      RETURNING *;
    `;
    const values = [title, pw, oeffentlich, user_id1, user_id2, id];
    const res = await client.query(query, values);
    return res.rows[0]; // Return the updated Room
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error executing query', err);
    throw err; // Forward the error to the caller
  } finally {
    client.release();
  }
}

/**
 * Deletes a Room.
 * @param id Number Id of the deleted Room
 * @returns the deleted Room
 */
export async function deleteRoom(id: number): Promise<any> {
  const client = await pool.connect();
  try {
    const res = await client.query('DELETE FROM Raum WHERE raum_id = $1 RETURNING *;', [id]);
    return res.rows[0]; // Return the deleted Room
  } catch (err) {
    console.error('Error executing query', err);
    throw err; // Forward the error to the caller
  } finally {
    client.release();
  }
}