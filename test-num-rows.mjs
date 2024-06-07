import Database from "better-sqlite3"
import { electrify } from "electric-sql/node"
import { schema } from "./src/generated/client"
import { mockSecureAuthToken } from "electric-sql/auth/secure"
import jwt from "jsonwebtoken"

function unsignedJWT(userId, customClaims) {
  const claims = customClaims || {}

  return jwt.sign({ ...claims, sub: userId }, ``, { algorithm: `none` })
}

async function run() {
  const runId = Math.random()
  const config = {
    url: `http://localhost:5133`,
  }

  // Create local db.
  // console.time(`setup - ${runId}`)
  const conn = new Database(`test-dbs/${runId}.db`)
  conn.pragma(`journal_mode = WAL`)

  const electric = await electrify(conn, schema, config)
  const token = unsignedJWT(`1`)
  await electric.connect(token)
  const { db } = electric
  // console.timeEnd(`setup - ${runId}`)
  // console.time(`sync - ${runId}`)
  const [usersShape] = await Promise.all([db.users.sync()])
  await Promise.all([usersShape.synced])
  // console.timeEnd(`sync - ${runId}`)
  return
}

// const concurrency = parseInt(process.argv[2], 10) || 1

async function runInParallel(asyncFunc, count) {
  // Create an array of promises by calling asyncFunc the specified number of times
  const promises = Array.from({ length: count }, () => asyncFunc())

  // Wait for all promises to resolve and return the results
  return Promise.all(promises)
}

// async function main() {
// await runInParallel(run, concurrency)
// }
// main()

export default async (concurrency = 1) => {
  console.log({ concurrency })
  await runInParallel(run, concurrency)
}
