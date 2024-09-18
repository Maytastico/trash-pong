import { pool } from "./conn";
import { User } from "../types/User";

/**
 * Selects a user from the database by their ID
 * @param id Id of the user
 * @returns User
 */
export async function getUser(id:number):Promise<User>{
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT * FROM "user" where user_id = $1 LIMIT 1',[id]);
    console.log(res.rows[0]);
    return res.rows[0] as User;
  } finally {
    client.release();
  }
}

/**
 * Selects a user from the database by their Name
 * @param name Name of the User
 * @returns User
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
    throw err;  // Weiterleiten des Fehlers an den Aufrufer
  } finally {
    client.release();
  }
}

/**
 * Checks if a User exists by their name
 * @param name Name of the User
 * @returns Boolean
 */
export async function doesUserExist(name:string):Promise<boolean>{
  const client = await pool.connect();
  try {
    const res = await client.query(' SELECT * FROM "user" WHERE name LIKE $1 LIMIT 1',[name]);
    console.log(res.rows[0]);
    if(res.rows.length > 0){
      return true;    
    }
    return false;
  } finally {
    client.release();
  }
}

/**
 * Creates a new User
 * @param name Name of the new User
 * @returns User
 */
export async function registerUser(name:string) {
  const client = await pool.connect();
  try {
    let query: string = 'INSERT INTO "user"("name") VALUES ($1);';

    const res = await client.query(query,[name]);
    console.log(res.rows);
    return res.rows;
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error executing query', err);
    throw err;  // Weiterleiten des Fehlers an den Aufrufer
  } finally {
    client.release();
  } 
}

/**
 * Updates User sets Token
 * @param user_id Id of the User
 * @param token Token of the User
 * @returns Rows updated
 */
export async function registerAuthtoken(user_id: number, token: string) {
  const client = await pool.connect();
  try {
    // Transaktion starten
    await client.query('BEGIN');
    await revokeAuthtoken(user_id);
    const query:string = 'UPDATE "user" SET token = $1 WHERE user_id = $2;';
    const res = await client.query(query, [token, user_id]);

    // Transaktion erfolgreich, also COMMIT
    await client.query('COMMIT');
    console.log(res.rowCount); // Anzahl der betroffenen Zeilen anzeigen
    return res.rowCount; // oder eine andere relevante Rückgabe
  } catch (err) {
    // Bei Fehler, Rollback der Transaktion
    await client.query('ROLLBACK');
    console.error('Error executing query', err);
    throw err;  // Weiterleiten des Fehlers an den Aufrufer
  } finally {
    client.release();
  } 
}

/**
 * Updates User sets Token null
 * @param user_id Id from User
 * @returns Rows updated
 */
export async function revokeAuthtoken(user_id:number) {
  const client = await pool.connect();
  try {
    let query: string = 'UPDATE "user" SET token = NULL WHERE user_id = $1;';

    const res = await client.query(query,[user_id]);
    console.log(res.rows);
    return res.rows;
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error executing query', err);
    throw err;  // Weiterleiten des Fehlers an den Aufrufer
  } finally {
    client.release();
  } 
}