import { Raum} from "../types/Room";
import { pool } from "./conn";

export async function getRoom(id:number): Promise<Raum>{
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT r.*,s.name as user1, sp.name as user2 FROM Raum r RIGHT JOIN "user" s on s.user_id=r.user_id1 RIGHT JOIN "user" sp on sp.user_id=r.user_id2 where raum_id = $1 LIMIT 1 ',[id]);
    console.log(res.rows[0]);
    return res.rows[0];
  } finally {
    client.release();
  }
}
export async function getAllRooms(): Promise<any[]> {
    const client = await pool.connect();
    try {
    const res = await client.query('SELECT r.*,s.name as user1, sp.name as user2 FROM Raum r LEFT JOIN "user" s on s.user_id=r.user_id1 LEFT  JOIN "user" sp on sp.user_id=r.user_id2;');
      return res.rows;
    } catch (err) {
      console.error('Error executing query', err);
      throw err;  // Weiterleiten des Fehlers an den Aufrufer
    } finally {
      client.release();
    }
  }
  export async function SearchRooms(search:string){
    const client = await pool.connect();
    try {
      const res = await client.query('SELECT r.* FROM Raum r where r.titel like $1;',[`%${search}%`]);
      return res.rows;
    } catch (err) {
      console.error('Error executing query', err);
      throw err;  // Weiterleiten des Fehlers an den Aufrufer
    } finally {
      client.release();
    }
  }
export async function createRoom(title:string,pw:string,oeffentlich:boolean,user_id1:number,user_id2:number | null) {
  const client = await pool.connect();
  try {
    const res = await client.query('Insert into Raum(titel,passwort,öffentlich,user_id1,user_id2)values($1,$2,$3,$4,$5) RETURNING raum_id;',[title,pw,oeffentlich,user_id1,user_id2]);
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
    await client.query('ROLLBACK');
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