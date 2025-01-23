import dotenv from 'dotenv';

// In Vercel, environment variables are automatically loaded
dotenv.config();

export const config = {
  openaiApiKey: process.env.OPENAI_API_KEY,
  environment: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5001
}; 