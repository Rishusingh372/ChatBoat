// index.js (updated CORS configuration)
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import chatbotRoutes from './routes/chatbot.route.js';

const app = express();
dotenv.config();

const port = process.env.PORT || 5400;

// Enhanced CORS middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Handle preflight requests
app.options('*', cors());

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection code
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.log("Error connecting to MongoDB:", error);
});

// Defining Routes
app.use("/bot/v1/", chatbotRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
      message: 'Server is running!',
      timestamp: new Date().toISOString()
    });
});

// Test endpoint without authentication
app.get('/test', (req, res) => {
  res.status(200).json({ message: 'Test endpoint works!' });
});

// Handle undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is Running on Port ${port}`);
  console.log(`Health check: http://localhost:${port}/health`);
});