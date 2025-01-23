import os
from openai import OpenAI
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

class TravelBot:
    def __init__(self):
        self.conversation_history = []
    
    def generate_itinerary(self, destination, budget, preferences):
        prompt = f"""Create a detailed travel itinerary for:
        Destination: {destination}
        Budget: {budget}
        Preferences: {preferences}
        
        Please include:
        - Daily activities
        - Estimated costs
        - Local attractions
        - Restaurant recommendations"""

        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a knowledgeable travel assistant."},
                    {"role": "user", "content": prompt}
                ]
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"Error generating itinerary: {str(e)}"

    def get_language_help(self, language, phrase):
        prompt = f"Translate the following phrase to {language}: '{phrase}'"
        
        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a helpful language translator."},
                    {"role": "user", "content": prompt}
                ]
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"Error translating phrase: {str(e)}"

    def get_cultural_insights(self, destination):
        prompt = f"""Provide cultural insights for {destination}, including:
        - Important customs
        - Do's and don'ts
        - Local etiquette
        - Cultural sensitivities"""

        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a cultural expert."},
                    {"role": "user", "content": prompt}
                ]
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"Error getting cultural insights: {str(e)}" 