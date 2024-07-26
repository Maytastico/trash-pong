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