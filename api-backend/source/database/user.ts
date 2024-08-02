import { pool } from "./conn";
import { User } from "../types/User";

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