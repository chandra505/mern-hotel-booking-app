import express, { Request, Response } from 'express';
import cors from 'cors';
import "dotenv/config";
import mongoose from 'mongoose';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import cookieParser from 'cookie-parser'

import userRoutes from './routes/users';
import authRoutes from './routes/auth';
import myHotelRoutes from './routes/hotels'


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const app = express();

const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: allowedOrigin,
    credentials: true,
}));

app.use(express.static(path.join(__dirname, "../../frontend/dist")))

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/my-hotels", myHotelRoutes)

app.get("*", (req: Request, res: Response)=>{
    res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'))
})

const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string); 
        console.log('Connected to MongoDB');
      
        app.listen(7000, () => {
            console.log('Server running on localhost:7000');
        });
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1); 
    }
};

startServer();
