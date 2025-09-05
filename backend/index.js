import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import chatbotRoutes from './routes/chatbot.route.js';

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;

// Database connection
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("Connected to MongoDB");
})
.catch((err)=>{
    console.error("Error connecting to MongoDB:", err);
});


// Define Routes
app.use("/bot/v1/", chatbotRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});