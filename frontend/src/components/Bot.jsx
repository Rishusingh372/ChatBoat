import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa'

function Bot({ user, onLogout }) {
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const [backendOnline, setBackendOnline] = useState(false)
    const messagesEndRef = useRef(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages])

    // Check if backend is available and load chat history
    useEffect(() => {
        checkBackendStatus();
        loadChatHistory();
    }, [])

    const checkBackendStatus = async () => {
        try {
            const response = await axios.get('http://localhost:5400/health', {
                timeout: 2000
            });
            if (response.status === 200) {
                setBackendOnline(true);
                console.log('Backend is connected');
            }
        } catch (error) {
            console.log('Backend is not available, using mock responses');
            setBackendOnline(false);
        }
    }

    const loadChatHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
            
            const response = await axios.get('http://localhost:5400/bot/v1/chat/history', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.status === 200) {
                setMessages(response.data.messages);
            }
        } catch (error) {
            console.log('Error loading chat history:', error);
        }
    }

    // Mock responses for when backend is offline
    const mockBotResponses = {
        "hello": "Hi, How I can help you!!",
        "can we become friend": "Yes",
        "how are you": "I'm just a bot, but I'm doing great! How about you?",
        "what is your name?": "I'm ChatBot, your virtual assistant.",
        "who made you": "I was created by developers to help answer your questions.",
        "tell me a joke": "Why don't skeletons fight each other? They don't have the guts!",
        "what is the time": "I can't see a clock, but your device should know.",
        "bye": "Goodbye! Have a great day.",
        "thank you": "You're welcome!",
        "i love you": "That's sweet! I'm here to help you anytime.",
        "where are you from": "I live in the cloud — no rent, no bills!",
        "what can you do": "I can chat with you, answer questions, and keep you company.",
        "what is python": "Python is a high-level, interpreted programming language known for simplicity and versatility.",
        "what is java?": "Java is a platform-independent, object-oriented programming language.",
        "what is recursion": "Recursion is when a function calls itself to solve smaller parts of a problem.",
        "who is prime minister of india?": "Narendra Modi is the Prime Minister of India since May 2014.",
        "what is g20": "The G20 (Group of Twenty) is an intergovernmental forum of 19 countries + the European Union.",
        "tell me about yourself": "This is usually the first interview question.",
        "why should we hire you": "HR wants to see your value-add.",
        "what is leadership": "Leadership is the ability to inspire and guide others toward achieving goals.",
        "who is virat kohli": "Virat Kohli is one of India's greatest batsmen and former captain.",
        "what is ipl": "The Indian Premier League (IPL) is a professional T20 cricket league started in 2008."
    };

    const getMockResponse = (text) => {
        const normalizedText = text.toLowerCase().trim();
        return mockBotResponses[normalizedText] || "Sorry, I don't understand that!!!";
    }

    const handleSendMessage = async () => {
        setLoading(true);
        if(!input.trim()) return;
        
        try {
            let botResponse;
            const token = localStorage.getItem('token');
            
            if (backendOnline && token) {
                // Try to use real backend
                const res = await axios.post("http://localhost:5400/bot/v1/message", {
                    text: input
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    timeout: 5000 // 5 second timeout
                });
                
                if(res.status === 200) {
                    botResponse = res.data.botMessage;
                }
            } else {
                // Use mock response
                botResponse = getMockResponse(input);
                
                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            
            // Add messages to chat
            setMessages([...messages, 
                { text: input, sender: 'user' }, 
                { text: botResponse, sender: 'bot' }
            ]);
            
        } catch (error) {
            console.log("Error sending message:", error);
            
            // Fallback to mock response if real API fails
            const botResponse = getMockResponse(input);
            setMessages([...messages, 
                { text: input, sender: 'user' }, 
                { text: botResponse, sender: 'bot' }
            ]);
        }
        
        setInput("");
        setLoading(false);
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSendMessage()
    }
    
    const handleLogout = () => {
        onLogout();
    }
            
  return (
    <div className='flex flex-col min-h-screen bg-[#0d0d0d] text-white'>
         {/* Navbar & Header */}
      <header className="fixed top-0 left-0 w-full border-b border-gray-800 bg-[#0d0d0d] z-10">
        <div className="container mx-auto flex justify-between items-center px-6 py-4">
          <div className="flex items-center">
            <h1 className="text-lg font-bold">BotSpoof</h1>
            {!backendOnline && (
              <span className="ml-3 text-xs bg-yellow-500 text-black px-2 py-1 rounded-full">
                Offline Mode
              </span>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">Welcome, {user?.name}</span>
            <button 
              onClick={handleLogout}
              className="flex items-center text-gray-300 hover:text-white transition-colors"
              title="Logout"
            >
              <FaSignOutAlt size={20} />
            </button>
            <FaUserCircle size={30} className="cursor-pointer" />
          </div>
        </div>
      </header>

      {/* Chat area */}
      <main className="flex-1 overflow-y-auto pt-20 pb-24 flex items-center justify-center">
        <div className="w-full max-w-4xl mx-auto px-4 flex flex-col space-y-3">
          {messages.length === 0 ? (
            // Centered welcome message
            <div className="text-center text-gray-400 text-lg mt-10">
              👋 Hi {user?.name}, I'm <span className="text-green-500 font-semibold">BotSpoof</span>. How can I help you today?
              {!backendOnline && (
                <div className="text-sm text-yellow-500 mt-2">
                  Currently in offline mode. Some features may be limited.
                </div>
              )}
            </div>
          ) : (
            <>
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`px-4 py-2 rounded-xl max-w-[75%] ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white self-end"
                      : "bg-gray-800 text-gray-100 self-start"
                  }`}
                >
                  {msg.text}
                </div>
              ))}

              {loading && (
                <div className="bg-gray-700 text-gray-300 px-4 py-2 rounded-xl max-w-[60%] self-start flex items-center">
                  <span>Bot is typing</span>
                  <span className="ml-2 flex">
                    <span className="animate-bounce delay-100">.</span>
                    <span className="animate-bounce delay-300">.</span>
                    <span className="animate-bounce delay-500">.</span>
                  </span>
                </div>
              )}
           <div ref={messagesEndRef}/>
            </>
          )}
        </div>
      </main>

      {/* Input & Footer */}
      <footer className="fixed bottom-0 left-0 w-full border-t border-gray-800 bg-[#0d0d0d] z-10">
        <div className="max-w-4xl mx-auto flex justify-center px-4 py-3">
          <div className="w-full flex bg-gray-900 rounded-full px-4 py-2 shadow-lg">
            <input
              type="text"
              className="flex-1 bg-transparent outline-none text-white placeholder-gray-400 px-2"
              placeholder="Ask BotSpoof..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button
              onClick={handleSendMessage}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 px-4 py-1 rounded-full text-white font-medium transition-colors disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Bot