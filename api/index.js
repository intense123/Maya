import express from 'express';
import cors from 'cors';
import { OpenAI } from 'openai';
import { config } from './config.js';

const app = express();

// Add debugging
console.log('Environment:', config.environment);
console.log('API Key exists:', !!config.openaiApiKey);

// Configure CORS
app.use(cors());

app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/chat', async (req, res) => {
  try {
    if (!config.openaiApiKey) {
      throw new Error('OpenAI API key is not configured');
    }

    const { message, history } = req.body;
    
    const openai = new OpenAI({
      apiKey: config.openaiApiKey
    });

    const systemPrompt = `You are Maya, a friendly and knowledgeable AI travel assistant. You help users plan their trips by:
    - Suggesting destinations based on their preferences and budget
    - Providing seasonal travel advice and best times to visit
    - Recommending local apps for transportation and food delivery
    - Giving practical tips about SIM cards and local connectivity
    - Creating personalized itineraries
    - Suggesting activities based on budget and duration of stay
    
    Keep your responses conversational, friendly, and concise.`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...history,
      { role: "user", content: message }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      temperature: 0.7,
      max_tokens: 500
    });

    res.json({ result: response.choices[0].message.content });
  } catch (error) {
    console.error('Chat Error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default app; 