import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './TravelBot.css';

const API_BASE_URL = ''; // Empty string since we're using relative paths

const LoadingDots = () => (
  <div className="thinking-animation">
    Thinking<span className="loading-dots">
      <span>•</span><span>•</span><span>•</span>
    </span>
  </div>
);

const TravelBot = () => {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: "Hi! I'm Maya, your travel companion! 👋 Tell me where you'd like to go, or ask me anything about travel destinations!"
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);
    setLoading(true);

    try {
      console.log('Sending request to:', `${API_BASE_URL}/api/chat`);
      const response = await axios.post('/api/chat', {
        message: userMessage,
        history: messages.map(msg => ({
          role: msg.type === 'bot' ? 'assistant' : 'user',
          content: msg.content
        }))
      });
      
      if (response.data.result) {
        setMessages(prev => [...prev, { type: 'bot', content: response.data.result }]);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Chat error:', error);
      let errorMessage = "I'm having trouble connecting. Please try again.";
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setMessages(prev => [...prev, { 
        type: 'bot', 
        content: errorMessage
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="travel-bot-container">
      <div className="header">
        <h1>Maya</h1>
        <p className="subtitle">Your AI Travel Companion</p>
      </div>

      <div className="chat-container">
        <div className="messages">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.type}`}>
              {message.type === 'bot' && (
                <div className="avatar">👧🏽</div>
              )}
              <div className="message-content">
                {message.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="message bot">
              <div className="avatar">👧🏽</div>
              <div className="message-content">
                <LoadingDots />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="input-form">
          <input
            type="text"
            placeholder="Ask Maya anything about your travel plans..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
          />
          <button type="submit" disabled={loading || !input.trim()}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default TravelBot; 