import express from 'express';
import { Message, getChatHistory } from '../controllers/chatbot.message.js';
import { register, login, getProfile } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js'; // Fixed path

const router = express.Router();

// Auth routes
router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/auth/profile", authenticate, getProfile);

// Chat routes (protected)
router.post("/message", authenticate, Message); // Added auth back
router.get("/chat/history", authenticate, getChatHistory);

export default router;