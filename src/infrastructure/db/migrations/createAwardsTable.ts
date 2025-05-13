import db from '../Database'

export function createAwardsTable() {
  db.prepare(`
    CREATE TABLE IF NOT EXISTS producer_awards (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      year INTEGER NOT NULL,
      title TEXT NOT NULL,
      studios TEXT NOT NULL,
      producer TEXT NOT NULL,
      winner BOOLEAN NOT NULL
    );
  `).run()
}
