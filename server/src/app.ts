import express from 'express';

export const app = express();

// Healthy check endpoint
app.get('/health', (_, res) => {
  res.send('OK');
});