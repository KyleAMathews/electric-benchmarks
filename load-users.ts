import { Client } from "pg"
import { faker } from "@faker-js/faker"

// PostgreSQL client setup
const client = new Client({
  user: `postgres`,
  host: `localhost`,
  database: `benchmarking-1`,
  password: `pg_password`,
  port: 5432,
})

function createRandomUser() {
  return {
    id: faker.string.uuid(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    password: faker.internet.password(),
    birthdate: faker.date.birthdate(),
    registeredAt: faker.date.past(),
  }
}

async function insertUsers() {
  await client.connect()
  try {
    const users = []
    for (let i = 0; i < 100000; i++) {
      users.push(createRandomUser())
    }
    const userInsertPromises = users.map(async (user) => {
      const query = `
        INSERT INTO users (id, username, email, avatar, password, birthdate, registeredAt)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `
      const values = [
        user.id,
        user.username,
        user.email,
        user.avatar,
        user.password,
        user.birthdate,
        user.registeredAt,
      ]
      await client.query(query, values)
    })

    await Promise.all(userInsertPromises)
    console.log(`Inserted 10,000 users successfully`)
  } catch (err) {
    console.error(`Error inserting users:`, err)
  } finally {
    await client.end()
  }
}

insertUsers()
