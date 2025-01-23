import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

export class TravelBot {
    constructor() {
        this.client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
    }

    async chat(message, history) {
        const systemPrompt = `You are Maya, a friendly and knowledgeable AI travel assistant. You help users plan their trips by:
        - Suggesting destinations based on their preferences and budget
        - Providing seasonal travel advice and best times to visit
        - Recommending local apps for transportation and food delivery
        - Giving practical tips about SIM cards and local connectivity
        - Creating personalized itineraries
        - Suggesting activities based on budget and duration of stay
        
        Keep your responses conversational, friendly, and concise. If you need more information to provide better recommendations, ask follow-up questions.`;

        try {
            const messages = [
                { role: "system", content: systemPrompt },
                ...history,
                { role: "user", content: message }
            ];

            const response = await this.client.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: messages,
                temperature: 0.7,
                max_tokens: 500
            });

            return response.choices[0].message.content;
        } catch (error) {
            throw new Error(`Error in chat: ${error.message}`);
        }
    }

    async generate_itinerary(destination, budget, preferences) {
        const prompt = `Create a detailed travel itinerary for:
        Destination: ${destination}
        Budget: ${budget}
        Preferences: ${preferences}
        
        Please provide a comprehensive day-by-day itinerary including:
        - Daily activities and attractions
        - Recommended restaurants and cuisine
        - Estimated costs for activities and meals
        - Transportation suggestions
        - Local tips and highlights
        - Best time of day for each activity
        
        Format the response in a clear, easy-to-read structure.`;

        try {
            const response = await this.client.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    { 
                        role: "system", 
                        content: "You are an expert travel planner with deep knowledge of destinations worldwide. Provide detailed, practical, and engaging travel itineraries."
                    },
                    { role: "user", content: prompt }
                ]
            });
            return response.choices[0].message.content;
        } catch (error) {
            throw new Error(`Error generating itinerary: ${error.message}`);
        }
    }

    async get_language_help(language, phrase) {
        const prompt = `Translate the following phrase to ${language}: '${phrase}'`;
        
        try {
            const response = await this.client.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are a helpful language translator." },
                    { role: "user", content: prompt }
                ]
            });
            return response.choices[0].message.content;
        } catch (error) {
            throw new Error(`Error translating phrase: ${error.message}`);
        }
    }

    async get_cultural_insights(destination) {
        const prompt = `Provide cultural insights for ${destination}, including:
        - Important customs
        - Do's and don'ts
        - Local etiquette
        - Cultural sensitivities`;

        try {
            const response = await this.client.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: "You are a cultural expert." },
                    { role: "user", content: prompt }
                ]
            });
            return response.choices[0].message.content;
        } catch (error) {
            throw new Error(`Error getting cultural insights: ${error.message}`);
        }
    }
} 