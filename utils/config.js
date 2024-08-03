import { config } from 'dotenv';
import { logger } from './logger';

config();

export const configObj = {
  discordToken: process.env.DISCORD_TOKEN,
  youtubeApiKey: process.env.YOUTUBE_API_KEY,
  soundcloudClientId: process.env.SOUNDCLOUD_CLIENT_ID,
  spotifyClientId: process.env.SPOTIFY_CLIENT_ID,
  spotifyClientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  lastfmApiKey: process.env.LASTFM_API_KEY,
  databaseUrl: process.env.DATABASE_URL,
};

// Validate required environment variables
const requiredEnvVars = ['DISCORD_TOKEN'];

requiredEnvVars.forEach((envVar) => {
  if (!configObj[envVar]) {
    logger.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
});