import { Client, VoiceState } from 'discord.js';
import { voiceService } from '../services/voiceService';

export const voiceStateUpdateEventHandler = (client: Client) => {
  client.on('voiceStateUpdate', async (oldState: VoiceState, newState: VoiceState) => {
    try {
      const guildId = newState.guild.id;
      const oldChannel = oldState.channel;
      const newChannel = newState.channel;

      if (
        oldChannel &&
        newChannel &&
        oldChannel.id !== newChannel.id &&
        newState.member.id !== client.user.id
      ) {
        // Check if bot is already in the channel and if the queue is not empty
        if (
          newState.channel &&
          newState.channel.members.has(client.user.id) &&
          voiceService.getQueue(guildId).length > 0
        ) {
          // Stay in the voice channel
          return;
        }

        // Check if the user joined the bot's channel and the queue is not empty
        if (
          newState.channel &&
          newState.channel.id === voiceService.getVoiceChannel(guildId) &&
          voiceService.getQueue(guildId).length > 0
        ) {
          // Stay in the voice channel
          return;
        }

        // If user left the channel, disconnect the bot after a timeout
        if (oldChannel && !oldChannel.members.has(client.user.id)) {
          const timeout = 5000; // 5 seconds

          setTimeout(async () => {
            // Check if there are still users in the channel
            if (!oldChannel.members.size) {
              await voiceService.disconnect(guildId);
            }
          }, timeout);
        }
      }
    } catch (error) {
      console.error('Error during voiceStateUpdate event:', error);
    }
  });
};