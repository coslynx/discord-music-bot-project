import { SlashCommandBuilder } from 'discord.js';
import { queueService } from '../services/queueService';

export const queueCommand = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('Show the current music queue'),
  handler: async (interaction: any) => {
    try {
      const queue = queueService.getQueue(interaction.guildId);

      if (!queue) {
        return await interaction.reply('There are no songs in the queue.');
      }

      const queueString = queue.map((track, index) => `${index + 1}. ${track.title} - ${track.artist}`).join('\n');

      await interaction.reply(`Current queue:\n${queueString}`);
    } catch (error) {
      console.error('Error during queue command execution:', error);
      await interaction.reply('An error occurred while fetching the queue. Please try again later.');
    }
  },
};