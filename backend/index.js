 import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import chatbotRoutes from './routes/chatbot.route.js';

// Load environment variables
dotenv.config();

const app = express();
const port = 3000;

// Basic CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5174', 'http://127.0.0.1:5174'],
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
console.log('Before connect');
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/chatbotdb')
.then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.log("Error connecting to MongoDB:", error);
});

// Routes
console.log('Before routes');
app.use("/api", chatbotRoutes);
console.log('After routes');

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
      message: 'Server is running!',
      timestamp: new Date().toISOString()
    });
});

// Handle undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Server is Running on Port ${port}`);
  console.log(`Health check: http://localhost:${port}/health`);
});
