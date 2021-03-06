const path = require('path')
const envPath = path.resolve(process.cwd(), '.env.local')

console.log({ envPath })

require('dotenv').config({ path: envPath })

const mysql = require('serverless-mysql')

const db = mysql({
  config: {
    host: process.env.MYSQL_HOST,
    database: process.env.MYSQL_DATABASE,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD
  }
})

async function query(q) {
  try {
    const results = await db.query(q)
    await db.end()
    return results
  } catch (e) {
    throw Error(e.message)
  }
}

// Create "entries" table if doesn't exist
async function migrate() {
  try {
    await query(`
    CREATE TABLE IF NOT EXISTS users (
      user_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(100) NOT NULL UNIQUE,
      username VARCHAR(20) NOT NULL UNIQUE,
      password VARCHAR(100) NOT NULL,
      admin BIT(1) DEFAULT 0,
      authenticated BIT(1) DEFAULT 0,
      image VARCHAR(10000),
      dateCreated DATETIME,
      lastLoggedIn DATETIME
    )

    CREATE TABLE IF NOT EXISTS tokens (
      access_token VARCHAR(250) NOT NULL PRIMARY KEY,
      user_id INT NOT NULL,
    )

    CREATE TABLE IF NOT EXISTS followers (
      username VARCHAR(20) NOT NULL,
      follower VARCHAR(20) NOT NULL,
      dateCreated DATETIME,
      PRIMARY KEY (username, follower),
      UNIQUE INDEX (username, follower)
    )
    `)
    console.log('migration ran successfully')
  } catch (e) {
    console.error('could not run migration, double check your credentials.')
    process.exit(1)
  }
}

migrate().then(() => process.exit())
