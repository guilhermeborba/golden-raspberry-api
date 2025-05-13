import DatabaseConstructor from 'better-sqlite3'
import path from 'path'

const db = new DatabaseConstructor(':memory:', { verbose: console.log })

export default db
