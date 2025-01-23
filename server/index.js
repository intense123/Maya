import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { OpenAI } from 'openai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from the server directory
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const port = process.env.PORT || 5001;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Add debugging
console.log('Current directory:', __dirname);
console.log('API Key exists:', !!process.env.OPENAI_API_KEY);

// Allow all origins in production
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

app.post('/api/chat', async (req, res) => {
  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OpenAI API key is not configured' });
  }

  try {
    const { message, history } = req.body;
    
    const systemPrompt = `You are Maya, a friendly and knowledgeable AI travel assistant. You help users plan their trips by:
    - Suggesting destinations based on their preferences and budget
    - Providing seasonal travel advice and best times to visit
    - Recommending local apps for transportation and food delivery
    - Giving practical tips about SIM cards and local connectivity
    - Creating personalized itineraries
    - Suggesting activities based on budget and duration of stay
    
    Keep your responses conversational, friendly, and concise. If you need more information to provide better recommendations, ask follow-up questions.`;

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

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 