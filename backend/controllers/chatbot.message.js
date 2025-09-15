import Bot from '../models/bot.model.js';

export const Message = async (req, res) => {
   try {
    const { text } = req.body;
    const userId = req.userId;

    if(!text?.trim()){
        return res.status(400).json({error:"Text cannot be empty"});
    }

    // Save user message to database
    const userMessage = await Bot.create({
        userId,
        text: text,
        sender: 'user'
    });

    let botResponse = "I'm here to help! What would you like to know?";
    
    // Use DeepAI API with your key
    try {
      const response = await fetch('https://api.deepai.org/api/text-generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': process.env.DEEPAI_API_KEY
        },
        body: JSON.stringify({
          text: text
        })
      });
      
      if (response.ok) {
        const data = await response.json();
        botResponse = data.output || "I received your message but couldn't generate a proper response.";
        
        // Clean up the response (sometimes DeepAI returns extra text)
        if (botResponse.includes('###')) {
          botResponse = botResponse.split('###')[0].trim();
        }
      } else {
        console.log("DeepAI API returned error status:", response.status);
        throw new Error('DeepAI API failed');
      }
    } catch (apiError) {
      console.log("DeepAI API Error:", apiError.message);
      
      // Fallback to simple responses if API fails
      const fallbackResponses = {
        "hello": "Hi there! How can I help you today?",
        "hi": "Hello! How can I assist you?",
        "hey": "Hey there! What's on your mind?",
        "how are you": "I'm doing well, thank you for asking! How about you?",
        "what is your name": "I'm ChatBot, your friendly AI assistant!",
        "who are you": "I'm an AI chatbot created to help answer your questions!",
        "bye": "Goodbye! Have a great day!",
        "goodbye": "See you later! Feel free to come back anytime!",
        "thank you": "You're welcome! Is there anything else I can help with?",
        "thanks": "Happy to help! What else would you like to know?",
        "what can you do": "I can answer questions, have conversations, and help with various topics!",
        "default": "I'm here to help! What would you like to know?",
        "java script": "JavaScript is a versatile programming language commonly used for web development.",
        "node js": "Node.js is a runtime environment that allows you to run JavaScript on the server side.",
        "react js": "React.js is a popular JavaScript library for building user interfaces, especially single-page applications.",
        "mongodb": "MongoDB is a NoSQL database that stores data in flexible, JSON-like documents.",
        "express js": "Express.js is a web application framework for Node.js, designed for building web applications and APIs."
      };
      
      const normalizedText = text.toLowerCase().trim();
      botResponse = fallbackResponses[normalizedText] || fallbackResponses.default;
    }

    // Save bot response to database
    const botMessage = await Bot.create({
        userId,
        text: botResponse,
        sender: 'bot'
    });

    return res.status(200).json({
        userMessage: text,
        botMessage: botResponse,
    });

   } catch (error) {
    console.log("Error in Message Controller:", error);
    return res.status(500).json({error:"Internal Server Error"});
   }
};

// Get chat history for a user
export const getChatHistory = async (req, res) => {
    try {
        const userId = req.userId;
        const messages = await Bot.find({ userId })
            .sort({ timestamp: 1 })
            .select('text sender timestamp');

        res.status(200).json({ messages });
    } catch (error) {
        console.log("Error in getChatHistory controller:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};