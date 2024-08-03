import { SlashCommandBuilder } from 'discord.js';
import { constants } from '../utils/constants';

export const helpCommand = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('List all available commands'),
  handler: async (interaction: any) => {
    const commands = constants.commands.map((command) => `${command.name} - ${command.description}`);
    await interaction.reply(`Available commands:\n${commands.join('\n')}`);
  },
};