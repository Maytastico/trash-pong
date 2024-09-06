import pg from "pg";
const {Pool} = pg;


/**
 * Initizilizes a pool object that is used for every database request 
 */
export const pool = new Pool();

/**
 * Verifies that there the database pool is working
 */
pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})  

/**
 * Verifies that there is a database conection
 */
export async function checkConnection() {
  const client = await pool.connect();
  try {
    const res = await client.query('SELECT * FROM user');
    console.log(res.rows[0]);
  } finally {
    client.release();
  }
}
