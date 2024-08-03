import { Client } from 'discord.js';
import { logger } from '../utils/logger';

export const readyEventHandler = (client: Client) => {
  client.on('ready', async () => {
    try {
      if (!client.user) return;
      logger.info(`Bot is ready! Logged in as ${client.user.tag} (ID: ${client.user.id})`);
    } catch (error) {
      logger.error('Error during ready event:', error);
    }
  });
};