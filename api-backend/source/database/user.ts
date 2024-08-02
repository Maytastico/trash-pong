import { pool } from "./conn";
import { User } from "../types/User";

export async function getUser(id:number):Promise<User>{
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT * FROM user where user_id = $1 LIMIT 1',[id]);
    console.log(res.rows[0]);
    return res.rows[0] as User;
  } finally {
    client.release();
  }
}

export async function doesUserExist(name:string):Promise<boolean>{
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT * FROM user where alias = $1 LIMIT 1',[name]);
    console.log(res.rows[0]);
    if(res.rows.length > 1){
      return true;
    }
    return false;
  } finally {
    client.release();
  }
}

export async function registerUser(name:string) {
  const client = await pool.connect();
  try {
    const res = await client.query('INSERT INTO user(alias) VALUES ($1);',[name]);
    return res.rows;
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error executing query', err);
    throw err;  // Weiterleiten des Fehlers an den Aufrufer
  } finally {
    client.release();
  } 
}
export async function updateRoom(id: number, title: string, pw: string, oeffentlich: boolean, user_id1: number, user_id2: number): Promise<any> {
  const client = await pool.connect();
  try {
    const query = `
      UPDATE Raum 
      SET titel = $1, passwort = $2, Öffentlich = $3, user_id1 = $4, user_id2 = $5 
      WHERE raum_id = $6 
      RETURNING *;
    `;
    const values = [title, pw, oeffentlich, user_id1, user_id2, id];
    const res = await client.query(query, values);
    return res.rows[0]; // Rückgabe des aktualisierten Raums
  } catch (err) {
    console.error('Error executing query', err);
    throw err; // Weiterleiten des Fehlers an den Aufrufer
  } finally {
    client.release();
  }
}
export async function deleteRoom(id: number): Promise<any> {
  const client = await pool.connect();
  try {
    const res = await client.query('DELETE FROM Raum WHERE raum_id = $1 RETURNING *;', [id]);
    return res.rows[0]; // Rückgabe des gelöschten Raums
  } catch (err) {
    console.error('Error executing query', err);
    throw err; // Weiterleiten des Fehlers an den Aufrufer
  } finally {
    client.release();
  }
}