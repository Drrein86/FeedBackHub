// Vercel Serverless Function - Catch all routes
import app from '../index.js';

export default async function handler(req, res) {
  // Set CORS headers for Vercel Serverless
  const allowedOrigins = [
    'https://feed-back-hub-aiv9.vercel.app',
    'http://localhost:8080',
    'http://localhost:5173',
    'http://localhost:3000'
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // Let Express handle the request
  return app(req, res);
}

