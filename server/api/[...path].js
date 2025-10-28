// Vercel Serverless Function - Catch all routes
import app from '../index.js';

export default async function handler(req, res) {
  // Let Express handle the request
  return app(req, res);
}

