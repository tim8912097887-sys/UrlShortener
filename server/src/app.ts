import cookieParser from 'cookie-parser';
import express from 'express';
import morgan from 'morgan';

export const app = express();

// Body parser middleware
app.use(express.json());
app.use(cookieParser());
// HTTP request logger middleware
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
// Healthy check endpoint
app.get('/health', (_, res) => {
  res.send('OK');
});