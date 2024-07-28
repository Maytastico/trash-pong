import {pool} from './conn'

export async function getRoom(id:number){
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT * FROM Raum where raum_id = $1',[id]);
    console.log(res.rows[0]);
    return res.rows[0];
  } finally {
    client.release();
  }
}
export async function getAllRooms(): Promise<any[]> {
    const client = await pool.connect();
    try {
      const res = await client.query('SELECT r.*,s.alias as spieler1, sp.alias as spieler2 FROM Raum r inner join Spieler s on s.spieler_id=r.spieler_id1 inner join Spieler sp on sp.spieler_id=r.spieler_id2;');
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
export async function createRoom(title:string,pw:string,oeffentlich:boolean,spieler_id1:number,spieler_id2:number) {
  const client = await pool.connect();
  try {
    const res = await client.query('Insert into Raum(titel,passwort,Öffentlich,spieler_id1,spieler_id2)values($1,$2,$3,$4,$5);',[title,pw,oeffentlich,spieler_id1,spieler_id2]);
    return res.rows;
  } catch (err) {
    console.error('Error executing query', err);
    throw err;  // Weiterleiten des Fehlers an den Aufrufer
  } finally {
    client.release();
  } 
}
export async function updateRoom(id: number, title: string, pw: string, oeffentlich: boolean, spieler_id1: number, spieler_id2: number): Promise<any> {
  const client = await pool.connect();
  try {
    const query = `
      UPDATE Raum 
      SET titel = $1, passwort = $2, Öffentlich = $3, spieler_id1 = $4, spieler_id2 = $5 
      WHERE raum_id = $6 
      RETURNING *;
    `;
    const values = [title, pw, oeffentlich, spieler_id1, spieler_id2, id];
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