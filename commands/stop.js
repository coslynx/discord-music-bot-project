import { SlashCommandBuilder } from 'discord.js';
import { musicService } from '../services/musicService';
import { voiceService } from '../services/voiceService';

export const stopCommand = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Stop the music and leave the voice channel'),
  handler: async (interaction: any) => {
    try {
      const guildId = interaction.guildId;

      await interaction.reply('Stopping the music and leaving the voice channel.');

      await musicService.stop(guildId);

      await voiceService.disconnect(guildId);
    } catch (error) {
      console.error('Error during stop command execution:', error);
      await interaction.reply(
        'An error occurred while stopping the music. Please try again later.'
      );
    }
  },
};