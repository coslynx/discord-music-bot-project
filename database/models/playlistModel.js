import { logger } from "../../utils/logger";
import { database } from "../../database/database";
import { PlaylistInterface } from "./interfaces/playlistModel";

export const playlistModel = {
  create: async (playlist: PlaylistInterface) => {
    try {
      const db = await database.init();

      const sql = `INSERT INTO playlists (id, name, userId, serverId, tracks) VALUES (?, ?, ?, ?, ?)`;
      const params = [
        playlist.id,
        playlist.name,
        playlist.userId,
        playlist.serverId,
        JSON.stringify(playlist.tracks),
      ];
      const result = await db.run(sql, params);
      logger.info(`Playlist created successfully: ${playlist.name}`);
      database.close(db);
      return result;
    } catch (error) {
      logger.error(`Error creating playlist:`, error);
      throw error;
    }
  },

  get: async (playlistId: string) => {
    try {
      const db = await database.init();
      const sql = `SELECT  FROM playlists WHERE id = ?`;
      const result = await db.get(sql, playlistId);
      if (result) {
        result.tracks = JSON.parse(result.tracks);
      }
      database.close(db);
      return result;
    } catch (error) {
      logger.error(`Error getting playlist:`, error);
      throw error;
    }
  },

  getAll: async (userId: string, serverId: string) => {
    try {
      const db = await database.init();
      const sql = `SELECT  FROM playlists WHERE userId = ? AND serverId = ?`;
      const results = await db.all(sql, userId, serverId);
      results.forEach((result) => {
        result.tracks = JSON.parse(result.tracks);
      });
      database.close(db);
      return results;
    } catch (error) {
      logger.error(`Error getting playlists:`, error);
      throw error;
    }
  },

  update: async (playlist: PlaylistInterface) => {
    try {
      const db = await database.init();

      const sql = `UPDATE playlists SET name = ?, tracks = ? WHERE id = ?`;
      const params = [
        playlist.name,
        JSON.stringify(playlist.tracks),
        playlist.id,
      ];
      const result = await db.run(sql, params);
      logger.info(`Playlist updated successfully: ${playlist.name}`);
      database.close(db);
      return result;
    } catch (error) {
      logger.error(`Error updating playlist:`, error);
      throw error;
    }
  },

  delete: async (playlistId: string) => {
    try {
      const db = await database.init();

      const sql = `DELETE FROM playlists WHERE id = ?`;
      const result = await db.run(sql, playlistId);
      logger.info(`Playlist deleted successfully: ${playlistId}`);
      database.close(db);
      return result;
    } catch (error) {
      logger.error(`Error deleting playlist:`, error);
      throw error;
    }
  },
};