import { pool } from "./conn";
import { User } from "../types/User";

/**
 * Returns a user by ID
 * @param id 
 * @returns User object
 */
export async function getUser(id: number): Promise<User> {
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT * FROM "user" where user_id = $1 LIMIT 1', [id]);
    console.log(res.rows[0]);
    return res.rows[0] as User;
  } finally {
    client.release();
  }
}

/**
 * Returns user data by name
 * @param name 
 * @returns User object
 */
export async function getUserByName(name: string): Promise<User> {
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT * FROM "user" WHERE name = $1 LIMIT 1', [name]);
    if (res.rows.length > 0) {
      return res.rows[0] as User;
    } else {
      throw new Error('User not found');
    }
  } catch (err) {
    console.error('Error executing query', err);
    throw err;  // Forward the error to the caller
  } finally {
    client.release();
  }
}

/**
 * Checks if a user exists in the database
 * @param name 
 * @returns 
 */
export async function doesUserExist(name: string): Promise<boolean> {
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT * FROM "user" WHERE name LIKE $1 LIMIT 1', [name]);
    console.log(res.rows[0]);
    if (res.rows.length > 0) {
      return true;
    }
    return false;
  } finally {
    client.release();
  }
}

/**
 * Registers a new user in the database
 * @param name 
 * @returns 
 */
export async function registerUser(name: string) {
  const client = await pool.connect();
  try {
    let query: string = 'INSERT INTO "user"("name") VALUES ($1);';

    const res = await client.query(query, [name]);
    console.log(res.rows);
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
 * Stores a token for a user in the database
 * @param user_id 
 * @param token 
 * @returns 
 */
export async function registerAuthtoken(user_id: number, token: string) {
  const client = await pool.connect();
  try {
    // Start transaction
    await client.query('BEGIN');
    await revokeAuthtoken(user_id);
    const query: string = 'UPDATE "user" SET token = $1 WHERE user_id = $2;';
    const res = await client.query(query, [token, user_id]);

    // Transaction successful, so COMMIT
    await client.query('COMMIT');
    console.log(res.rowCount); // Display the number of affected rows
    return res.rowCount; // or another relevant return value
  } catch (err) {
    // On error, rollback the transaction
    await client.query('ROLLBACK');
    console.error('Error executing query', err);
    throw err;  // Forward the error to the caller
  } finally {
    client.release();
  }
}

/**
 * Deletes a token for a user in the database
 * @param user_id 
 * @returns 
 */
export async function revokeAuthtoken(user_id: number) {
  const client = await pool.connect();
  try {
    let query: string = 'UPDATE "user" SET token = NULL WHERE user_id = $1;';

    const res = await client.query(query, [user_id]);
    console.log(res.rows);
    return res.rows;
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error executing query', err);
    throw err;  // Forward the error to the caller
  } finally {
    client.release();
  }
}