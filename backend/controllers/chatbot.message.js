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

    // Free ChatGPT API integration (using DeepAI)
    let botResponse = "Sorry, I'm having trouble responding right now.";
    
    try {
      const response = await fetch('https://api.deepai.org/api/text-generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': process.env.DEEPAI_API_KEY || 'quickstart-ai' // Free tier key
        },
        body: JSON.stringify({
          text: text
        })
      });
      
      const data = await response.json();
      botResponse = data.output || "I received your message but couldn't generate a proper response.";
    } catch (apiError) {
      console.log("API Error:", apiError);
      // Fallback responses
      const fallbackResponses = {
        "hello": "Hi there! How can I help you today?",
        "how are you": "I'm doing well, thank you for asking! How about you?",
        "what is your name": "I'm ChatBot, your friendly AI assistant!",
        "bye": "Goodbye! Have a great day!",
        "thank you": "You're welcome! Is there anything else I can help with?"
      };
      
      const normalizedText = text.toLowerCase().trim();
      botResponse = fallbackResponses[normalizedText] || "I'm here to help! What else would you like to know?";
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