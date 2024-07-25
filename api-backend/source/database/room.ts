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