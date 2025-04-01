import dotenv from 'dotenv';

dotenv.config();

export const config = {
  beServerUrl: process.env.BE_SERVER_URL || 'http://localhost:3000',
  timeoutServer: process.env.TIMEOUT_SERVER || '5000',
};
