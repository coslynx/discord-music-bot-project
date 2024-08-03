import { Client, VoiceConnection, Guild } from "discord.js";
import { queueService } from "./queueService";
import { logger } from "../utils/logger";

interface VoiceService {
  join(guildId: string, voiceChannel: any): Promise<void>;
  disconnect(guildId: string): Promise<void>;
  getVoiceChannel(guildId: string): string | null;
  getQueue(guildId: string): any[];
}

const voiceConnections: { [guildId: string]: VoiceConnection } = {};

export const voiceService: VoiceService = {
  join: async (guildId: string, voiceChannel: any) => {
    try {
      const guild: Guild = await (client as any).guilds.fetch(guildId);
      if (!voiceConnections[guildId]) {
        voiceConnections[guildId] = await voiceChannel.join();
        logger.info(`Joined voice channel ${voiceChannel.name} in guild ${guild.name}`);
      }
    } catch (error) {
      logger.error("Error joining voice channel:", error);
    }
  },
  disconnect: async (guildId: string) => {
    try {
      if (voiceConnections[guildId]) {
        await voiceConnections[guildId].disconnect();
        delete voiceConnections[guildId];
        logger.info(`Disconnected from voice channel in guild ${guildId}`);
      }
    } catch (error) {
      logger.error("Error disconnecting from voice channel:", error);
    }
  },
  getVoiceChannel: (guildId: string) => {
    if (voiceConnections[guildId]) {
      return voiceConnections[guildId].channel.id;
    }
    return null;
  },
  getQueue: (guildId: string) => {
    return queueService.getQueue(guildId);
  },
};

let client: Client;

export const setClient = (discordClient: Client) => {
  client = discordClient;
};