import { SlashCommandBuilder } from 'discord.js';
import { queueService } from '../services/queueService';
import { musicService } from '../services/musicService';

export const skipCommand = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Skip the current song'),
  handler: async (interaction: any) => {
    try {
      const guildId = interaction.guildId;

      const queue = queueService.getQueue(guildId);

      if (!queue) {
        return await interaction.reply('There are no songs in the queue to skip.');
      }

      await interaction.reply('Skipping the current song.');

      await musicService.skip(guildId);
    } catch (error) {
      console.error('Error during skip command execution:', error);
      await interaction.reply(
        'An error occurred while skipping the song. Please try again later.'
      );
    }
  },
};