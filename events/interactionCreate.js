import { Client, Interaction } from 'discord.js';
import { commandHandler } from '../utils/commandHandler';

export const interactionCreateEventHandler = (client: Client) => {
  client.on('interactionCreate', async (interaction: Interaction) => {
    try {
      if (interaction.isChatInputCommand()) {
        await commandHandler(interaction);
      }
    } catch (error) {
      console.error('Error during interactionCreate event:', error);
      if (interaction.isChatInputCommand()) {
        await interaction.reply({
          content: 'An error occurred while processing your command. Please try again later.',
          ephemeral: true,
        });
      }
    }
  });
};