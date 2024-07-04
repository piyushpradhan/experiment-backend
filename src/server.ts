import "./presentation/middlewares/passport";
import express from "express";
import cors from 'cors';
import session from 'express-session';

import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(session({ secret: process.env.SESSION_KEY || "", resave: true, saveUninitialized: true }));
app.use(express.json());

export { app };
