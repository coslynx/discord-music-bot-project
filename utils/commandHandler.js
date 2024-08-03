import { logger } from './logger';
import { constants } from './constants';
import { errorHandler } from './errorHandler';

export const commandHandler = async (interaction) => {
  try {
    // Identify the command
    const command = constants.commands.find(
      (command) => command.data.name === interaction.commandName
    );

    if (!command) {
      return await interaction.reply({
        content: 'Invalid command. Please check your input.',
        ephemeral: true,
      });
    }

    // Execute the command handler
    await command.handler(interaction);
  } catch (error) {
    logger.error('Error during command execution:', error);
    errorHandler.handle(error, interaction);
  }
};