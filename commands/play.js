import { SlashCommandBuilder } from 'discord.js';
import { musicService } from '../services/musicService';
import { queueService } from '../services/queueService';
import { utils } from '../utils/utils';

export const playCommand = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Play a song or playlist')
    .addStringOption((option) =>
      option
        .setName('query')
        .setDescription('The song or playlist to play')
        .setRequired(true)
    ),
  handler: async (interaction: any) => {
    try {
      const guildId = interaction.guildId;
      const query = interaction.options.getString('query');
      const validatedQuery = utils.validatePlayQuery(query);

      if (!validatedQuery) {
        return await interaction.reply(
          'Invalid song or playlist name. Please enter a valid query.'
        );
      }

      const voiceChannel = interaction.member.voice.channel;

      if (!voiceChannel) {
        return await interaction.reply(
          'You need to be in a voice channel to play music.'
        );
      }

      await interaction.reply(`Playing ${validatedQuery}...`);

      const track = await musicService.play(validatedQuery);

      if (track) {
        await queueService.addToQueue(guildId, track);
        await voiceService.join(guildId, voiceChannel);
      } else {
        await interaction.followUp(
          'Could not find a matching song or playlist. Please try again.'
        );
      }
    } catch (error) {
      console.error('Error during play command execution:', error);
      await interaction.reply(
        'An error occurred while playing music. Please try again later.'
      );
    }
  },
};