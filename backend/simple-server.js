// simple-server.js (place in your backend folder)
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const app = express();
const port = 5400;

app.use(cors());
app.use(express.json());

// Simple in-memory user storage (for testing only)
const users = [];
const JWT_SECRET = 'your_test_secret_key';

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Register endpoint
app.post('/bot/v1/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return res.status(400).json({ error: "User already exists with this email" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const user = {
      id: Date.now(),
      name,
      email,
      password: hashedPassword
    };
    users.push(user);

    // Generate token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    // Return user data (without password)
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token
    });

  } catch (error) {
    console.log("Error in register:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Login endpoint
app.post('/bot/v1/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user
    const user = users.find(user => user.email === email);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    // Return user data
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token
    });

  } catch (error) {
    console.log("Error in login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Chat message endpoint
app.post('/bot/v1/message', (req, res) => {
  try {
    const { text } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({ error: "Text cannot be empty" });
    }

    // Simple bot responses
    const botResponses = {
      "hello": "Hi, How I can help you!!",
      "how are you": "I'm just a bot, but I'm doing great! How about you?",
      "what is your name?": "I'm ChatBot, your virtual assistant.",
      "default": "I received your message. This is a test server."
    };

    const normalizedText = text.toLowerCase().trim();
    const botResponse = botResponses[normalizedText] || botResponses.default;

    res.status(200).json({
      userMessage: text,
      botMessage: botResponse,
    });

  } catch (error) {
    console.log("Error in message:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(port, () => {
  console.log(`Simple test server running on port ${port}`);
});