import { logger } from "../utils/logger";
import ytdl from "ytdl-core";
import { queueService } from "./queueService";
import { voiceService } from "./voiceService";

interface MusicService {
  play(query: string): Promise<any | null>;
  skip(guildId: string): Promise<void>;
  stop(guildId: string): Promise<void>;
}

export const musicService: MusicService = {
  play: async (query: string) => {
    try {
      const track = await searchAndRetrieveTrack(query);

      if (track) {
        logger.info(`Playing track ${track.title}`);
        return track;
      } else {
        logger.warn(`Track not found for query: ${query}`);
        return null;
      }
    } catch (error) {
      logger.error(`Error playing track:`, error);
      return null;
    }
  },
  skip: async (guildId: string) => {
    try {
      const queue = queueService.getQueue(guildId);
      if (queue.length > 0) {
        const currentTrackIndex = queue.findIndex(
          (track: any) => track.isPlaying === true
        );
        if (currentTrackIndex >= 0) {
          const currentTrack = queue[currentTrackIndex];
          logger.info(`Skipping track ${currentTrack.title}`);
          currentTrack.isPlaying = false;

          if (queue[currentTrackIndex + 1]) {
            const nextTrack = queue[currentTrackIndex + 1];
            nextTrack.isPlaying = true;
            await playTrack(guildId, nextTrack);
            logger.info(`Playing next track: ${nextTrack.title}`);
          } else {
            logger.info(`Queue is empty`);
            // Handle queue being empty
          }
        }
      }
    } catch (error) {
      logger.error(`Error skipping track:`, error);
    }
  },
  stop: async (guildId: string) => {
    try {
      const queue = queueService.getQueue(guildId);
      if (queue.length > 0) {
        const currentTrackIndex = queue.findIndex(
          (track: any) => track.isPlaying === true
        );
        if (currentTrackIndex >= 0) {
          const currentTrack = queue[currentTrackIndex];
          logger.info(`Stopping track ${currentTrack.title}`);
          currentTrack.isPlaying = false;
          await stopPlaying(guildId);
        }
      }
    } catch (error) {
      logger.error(`Error stopping track:`, error);
    }
  },
};

async function searchAndRetrieveTrack(query: string) {
  // Implement search logic based on your chosen music source
  // Example for YouTube search
  try {
    const info = await ytdl.getInfo(query);
    const track = {
      title: info.videoDetails.title,
      artist: info.videoDetails.author.name,
      url: info.videoDetails.video_url,
      isPlaying: false,
      // Add other necessary information from the API
    };
    return track;
  } catch (error) {
    logger.error(`Error searching and retrieving track:`, error);
    return null;
  }
}

async function playTrack(guildId: string, track: any) {
  try {
    const voiceConnection = voiceService.getVoiceConnection(guildId);

    if (voiceConnection) {
      const stream = ytdl(track.url, { filter: "audioonly" });
      const dispatcher = voiceConnection.play(stream);

      // Handle dispatcher events like finished, error, etc.
      dispatcher.on("finish", () => {
        logger.info(`Track ${track.title} finished playing`);
        // Handle the end of a track (e.g., play next track)
      });

      dispatcher.on("error", (error) => {
        logger.error(`Error playing track:`, error);
        // Handle playback errors (e.g., try playing the next track)
      });
    } else {
      logger.warn(`Voice connection not found for guild ${guildId}`);
      // Handle the situation where the bot is not in a voice channel
    }
  } catch (error) {
    logger.error(`Error playing track:`, error);
  }
}

async function stopPlaying(guildId: string) {
  try {
    const voiceConnection = voiceService.getVoiceConnection(guildId);

    if (voiceConnection) {
      voiceConnection.dispatcher.end();
      logger.info(`Stopped playback`);
    } else {
      logger.warn(`Voice connection not found for guild ${guildId}`);
      // Handle the situation where the bot is not in a voice channel
    }
  } catch (error) {
    logger.error(`Error stopping playback:`, error);
  }
}