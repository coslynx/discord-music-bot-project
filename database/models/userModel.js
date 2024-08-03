import { logger } from "../../utils/logger";
import { database } from "../../database/database";
import { UserInterface } from "./interfaces/userModel";

export const userModel = {
  create: async (user: UserInterface) => {
    try {
      const db = await database.init();

      const sql = `INSERT INTO users (id, name, preferences) VALUES (?, ?, ?)`;
      const params = [user.id, user.name, JSON.stringify(user.preferences)];
      const result = await db.run(sql, params);
      logger.info(`User created successfully: ${user.name}`);
      database.close(db);
      return result;
    } catch (error) {
      logger.error(`Error creating user:`, error);
      throw error;
    }
  },

  get: async (userId: string) => {
    try {
      const db = await database.init();
      const sql = `SELECT  FROM users WHERE id = ?`;
      const result = await db.get(sql, userId);
      if (result) {
        result.preferences = JSON.parse(result.preferences);
      }
      database.close(db);
      return result;
    } catch (error) {
      logger.error(`Error getting user:`, error);
      throw error;
    }
  },

  update: async (user: UserInterface) => {
    try {
      const db = await database.init();

      const sql = `UPDATE users SET name = ?, preferences = ? WHERE id = ?`;
      const params = [user.name, JSON.stringify(user.preferences), user.id];
      const result = await db.run(sql, params);
      logger.info(`User updated successfully: ${user.name}`);
      database.close(db);
      return result;
    } catch (error) {
      logger.error(`Error updating user:`, error);
      throw error;
    }
  },

  delete: async (userId: string) => {
    try {
      const db = await database.init();

      const sql = `DELETE FROM users WHERE id = ?`;
      const result = await db.run(sql, userId);
      logger.info(`User deleted successfully: ${userId}`);
      database.close(db);
      return result;
    } catch (error) {
      logger.error(`Error deleting user:`, error);
      throw error;
    }
  },
};