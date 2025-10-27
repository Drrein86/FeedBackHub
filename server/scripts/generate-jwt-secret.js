// Generate a secure JWT secret for production use
// Run with: node scripts/generate-jwt-secret.js

import crypto from 'crypto';

console.log('\n🔐 Generated JWT Secret (use this in your .env file):\n');
console.log(crypto.randomBytes(32).toString('hex'));
console.log('\nAdd this to your .env file as:');
console.log('JWT_SECRET="<paste-the-secret-above>"\n');

