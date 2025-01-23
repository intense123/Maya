from travel_bot import TravelBot
import os
from dotenv import load_dotenv

def main():
    print("Welcome to Travel Assistant Bot!")
    bot = TravelBot()
    
    while True:
        print("\nWhat would you like to do?")
        print("1. Generate travel itinerary")
        print("2. Get language help")
        print("3. Get cultural insights")
        print("4. Exit")
        
        choice = input("Enter your choice (1-4): ")
        
        if choice == "1":
            destination = input("Enter destination: ")
            budget = input("Enter budget (in USD): ")
            preferences = input("Enter preferences (e.g., adventure, relaxation, food): ")
            
            itinerary = bot.generate_itinerary(destination, budget, preferences)
            print("\nGenerated Itinerary:")
            print(itinerary)
            
        elif choice == "2":
            language = input("Enter target language: ")
            phrase = input("Enter phrase to translate: ")
            
            translation = bot.get_language_help(language, phrase)
            print("\nTranslation:")
            print(translation)
            
        elif choice == "3":
            destination = input("Enter destination: ")
            
            insights = bot.get_cultural_insights(destination)
            print("\nCultural Insights:")
            print(insights)
            
        elif choice == "4":
            print("Thank you for using Travel Assistant Bot!")
            break
        
        else:
            print("Invalid choice. Please try again.")

if __name__ == "__main__":
    main() 