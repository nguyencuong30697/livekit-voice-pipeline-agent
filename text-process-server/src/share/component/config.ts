import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: Number(process.env.PORT) || 3000,
  maxSeconds: Number(process.env.MAX_SECONDS) || 60,
  wordsPerMinute: Number(process.env.WORDS_PER_MINUTE) || 150,
  envStage: process.env.NODE_ENV || 'development',
};
