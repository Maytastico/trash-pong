import pg from "pg";
const {Pool} = pg;

export const pool = new Pool();

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})  

export async function checkConnection() {
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT * FROM user');
    console.log(res.rows[0]);
  } finally {
    client.release();
  }
}
