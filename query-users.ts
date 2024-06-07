import { Client } from "pg"

// PostgreSQL client setup
const client = new Client({
  user: `postgres`,
  host: `localhost`,
  database: `benchmarking-1`,
  password: `pg_password`,
  port: 5432,
})

async function queryUsers() {
  console.time(`connect`)
  await client.connect()
  console.timeEnd(`connect`)
  console.time(`query`)
  const result = await client.query(`select * from users`)
  console.log(result)
  console.timeEnd(`query`)
  process.exit()
}

queryUsers()
