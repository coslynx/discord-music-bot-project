import { SlashCommandBuilder } from 'discord.js';
import { musicService } from '../services/musicService';
import { queueService } from '../services/queueService';
import { utils } from '../utils/utils';

export const searchCommand = {
  data: new SlashCommandBuilder()
    .setName('search')
    .setDescription('Search for a song or artist')
    .addStringOption((option) =>
      option
        .setName('query')
        .setDescription('The song or artist to search for')
        .setRequired(true)
    ),
  handler: async (interaction: any) => {
    try {
      const query = interaction.options.getString('query');
      const validatedQuery = utils.validateSearchQuery(query);

      if (!validatedQuery) {
        return await interaction.reply(
          'Invalid search query. Please enter a valid song or artist name.'
        );
      }

      const searchResults = await musicService.search(validatedQuery);

      if (searchResults.length === 0) {
        return await interaction.reply(
          'No results found. Please try a different search query.'
        );
      }

      const formattedResults = searchResults.map(
        (result, index) =>
          `${index + 1}. ${result.title} - ${result.artist}`
      );

      await interaction.reply(
        `Search results:\n${formattedResults.join(
          '\n'
        )}\n\nPlease reply with the number of the song you want to add to the queue.`
      );

      const collector = interaction.channel.createMessageCollector({
        filter: (message) =>
          message.author.id === interaction.user.id &&
          !isNaN(parseInt(message.content)),
        max: 1,
        time: 30000,
      });

      collector.on('collect', async (message) => {
        const selectedIndex = parseInt(message.content) - 1;

        if (selectedIndex < 0 || selectedIndex >= searchResults.length) {
          return await interaction.followUp(
            'Invalid selection. Please choose a valid number from the list.'
          );
        }

        const selectedTrack = searchResults[selectedIndex];

        await queueService.addToQueue(selectedTrack);

        await interaction.followUp(
          `Added "${selectedTrack.title}" to the queue!`
        );
      });

      collector.on('end', (collected, reason) => {
        if (reason === 'time') {
          interaction.followUp('Search timed out. Please try again.');
        }
      });
    } catch (error) {
      console.error('Error during search command execution:', error);
      await interaction.reply(
        'An error occurred while searching for music. Please try again later.'
      );
    }
  },
};