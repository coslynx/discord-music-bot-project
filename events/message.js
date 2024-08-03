import { Client, Message } from 'discord.js';
import { commandHandler } from '../utils/commandHandler';

export const messageEventHandler = (client: Client) => {
  client.on('messageCreate', async (message: Message) => {
    try {
      // Ignore messages from the bot itself
      if (message.author.bot) return;

      // Check if the message starts with the command prefix
      if (message.content.startsWith('!')) {
        await commandHandler(message);
      }
    } catch (error) {
      console.error('Error during messageCreate event:', error);
    }
  });
};