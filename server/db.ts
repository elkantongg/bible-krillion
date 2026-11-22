import { DatabaseSync } from 'node:sqlite'
import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'

export type DB = DatabaseSync

export function openDb(path: string): DB {
  if (path !== ':memory:') mkdirSync(dirname(path), { recursive: true })
  const db = new DatabaseSync(path)
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA busy_timeout = 3000;

    CREATE TABLE IF NOT EXISTS dive_prompts (
      dive_no INTEGER NOT NULL,
      idx INTEGER NOT NULL,
      question_id TEXT NOT NULL,
      PRIMARY KEY (dive_no, idx)
    );

    CREATE TABLE IF NOT EXISTS answer_counts (
      question_id TEXT NOT NULL,
      answer_id TEXT NOT NULL,
      count INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (question_id, answer_id)
    );

    CREATE TABLE IF NOT EXISTS question_totals (
      question_id TEXT PRIMARY KEY,
      total INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS dives (
      player_id TEXT NOT NULL,
      dive_no INTEGER NOT NULL,
      started_at INTEGER NOT NULL,
      finished_at INTEGER,
      score INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (player_id, dive_no)
    );
    CREATE INDEX IF NOT EXISTS dives_by_no ON dives (dive_no, finished_at, score);

    CREATE TABLE IF NOT EXISTS dive_answers (
      player_id TEXT NOT NULL,
      dive_no INTEGER NOT NULL,
      idx INTEGER NOT NULL,
      question_id TEXT NOT NULL,
      opened_at INTEGER NOT NULL,
      locked_at INTEGER,
      raw TEXT,
      answer_id TEXT,
      points INTEGER,
      tier TEXT,
      share REAL,
      attempts INTEGER NOT NULL DEFAULT 0,
      ip_hash TEXT,
      counted INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (player_id, dive_no, idx)
    );
    CREATE INDEX IF NOT EXISTS answers_by_ip ON dive_answers (ip_hash, question_id, locked_at);
  `)
  return db
}

/** run fn inside a transaction */
export function tx<T>(db: DB, fn: () => T): T {
  db.exec('BEGIN IMMEDIATE')
  try {
    const r = fn()
    db.exec('COMMIT')
    return r
  } catch (e) {
    db.exec('ROLLBACK')
    throw e
  }
}
