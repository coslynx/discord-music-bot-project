import { logger } from "../../utils/logger";
import { database } from "../../database/database";
import { ServerConfigInterface } from "./interfaces/serverConfigModel";

export const serverConfigModel = {
  create: async (serverConfig: ServerConfigInterface) => {
    try {
      const db = await database.init();

      const sql = `INSERT INTO server_configs (id, name, prefix, playlist) VALUES (?, ?, ?, ?)`;
      const params = [
        serverConfig.id,
        serverConfig.name,
        serverConfig.prefix,
        serverConfig.playlist,
      ];
      const result = await db.run(sql, params);
      logger.info(
        `Server config created successfully: ${serverConfig.name}`
      );
      database.close(db);
      return result;
    } catch (error) {
      logger.error(`Error creating server config:`, error);
      throw error;
    }
  },

  get: async (serverId: string) => {
    try {
      const db = await database.init();
      const sql = `SELECT  FROM server_configs WHERE id = ?`;
      const result = await db.get(sql, serverId);
      database.close(db);
      return result;
    } catch (error) {
      logger.error(`Error getting server config:`, error);
      throw error;
    }
  },

  update: async (serverConfig: ServerConfigInterface) => {
    try {
      const db = await database.init();

      const sql = `UPDATE server_configs SET name = ?, prefix = ?, playlist = ? WHERE id = ?`;
      const params = [
        serverConfig.name,
        serverConfig.prefix,
        serverConfig.playlist,
        serverConfig.id,
      ];
      const result = await db.run(sql, params);
      logger.info(
        `Server config updated successfully: ${serverConfig.name}`
      );
      database.close(db);
      return result;
    } catch (error) {
      logger.error(`Error updating server config:`, error);
      throw error;
    }
  },

  delete: async (serverId: string) => {
    try {
      const db = await database.init();

      const sql = `DELETE FROM server_configs WHERE id = ?`;
      const result = await db.run(sql, serverId);
      logger.info(`Server config deleted successfully: ${serverId}`);
      database.close(db);
      return result;
    } catch (error) {
      logger.error(`Error deleting server config:`, error);
      throw error;
    }
  },
};