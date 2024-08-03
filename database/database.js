import { logger } from "../utils/logger";
import sqlite3 from "sqlite3";
import { configObj } from "../utils/config";

const dbPath = configObj.databaseUrl || "./database.sqlite";

export const database = {
  init: async () => {
    try {
      const db = new sqlite3.Database(dbPath);
      logger.info(`Database initialized at: ${dbPath}`);

      // Create tables if they don't exist
      await createTables(db);

      return db;
    } catch (error) {
      logger.error(`Error initializing database:`, error);
      throw error;
    }
  },

  close: (db: sqlite3.Database) => {
    try {
      db.close((err) => {
        if (err) {
          logger.error(`Error closing database:`, err);
        } else {
          logger.info(`Database closed successfully`);
        }
      });
    } catch (error) {
      logger.error(`Error closing database:`, error);
    }
  },
};

async function createTables(db: sqlite3.Database) {
  try {
    await db.run(
      `CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT,
        preferences TEXT
      )`
    );
    logger.info(`Users table created`);

    await db.run(
      `CREATE TABLE IF NOT EXISTS server_configs (
        id TEXT PRIMARY KEY,
        name TEXT,
        prefix TEXT,
        playlist TEXT
      )`
    );
    logger.info(`Server configs table created`);

    await db.run(
      `CREATE TABLE IF NOT EXISTS playlists (
        id TEXT PRIMARY KEY,
        name TEXT,
        userId TEXT,
        serverId TEXT,
        tracks TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`
    );
    logger.info(`Playlists table created`);
  } catch (error) {
    logger.error(`Error creating tables:`, error);
    throw error;
  }
}