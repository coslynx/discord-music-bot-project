import { logger } from "../utils/logger";

interface QueueService {
  addToQueue(guildId: string, track: any): Promise<void>;
  getQueue(guildId: string): any[];
  removeFromQueue(guildId: string, trackIndex: number): Promise<void>;
  getTrackAtIndex(guildId: string, trackIndex: number): any | null;
  clearQueue(guildId: string): Promise<void>;
}

const queues: { [guildId: string]: any[] } = {};

export const queueService: QueueService = {
  addToQueue: async (guildId: string, track: any) => {
    try {
      if (!queues[guildId]) {
        queues[guildId] = [];
      }
      queues[guildId].push(track);
      logger.info(`Added track "${track.title}" to queue for guild ${guildId}`);
    } catch (error) {
      logger.error("Error adding track to queue:", error);
    }
  },
  getQueue: (guildId: string) => {
    return queues[guildId] || [];
  },
  removeFromQueue: async (guildId: string, trackIndex: number) => {
    try {
      if (queues[guildId]) {
        queues[guildId].splice(trackIndex, 1);
        logger.info(
          `Removed track at index ${trackIndex} from queue for guild ${guildId}`
        );
      }
    } catch (error) {
      logger.error("Error removing track from queue:", error);
    }
  },
  getTrackAtIndex: (guildId: string, trackIndex: number) => {
    if (queues[guildId]) {
      return queues[guildId][trackIndex];
    }
    return null;
  },
  clearQueue: async (guildId: string) => {
    try {
      if (queues[guildId]) {
        queues[guildId] = [];
        logger.info(`Cleared queue for guild ${guildId}`);
      }
    } catch (error) {
      logger.error("Error clearing queue:", error);
    }
  },
};