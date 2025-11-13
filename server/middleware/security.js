// middleware/security.js - Security headers and middleware

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Normalize CLIENT_URL for security headers
const normalizeUrl = (url) => {
  if (!url) return url;
  return url.replace(/\/+$/, ''); // Remove trailing slashes
};

const CLIENT_URL = normalizeUrl(process.env.CLIENT_URL) || 'http://localhost:5173';

// Security headers using helmet
const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", CLIENT_URL],
    },
  },
  crossOriginEmbedderPolicy: false,
});

// Rate limiting for API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for socket connections (if needed)
const socketLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // limit each IP to 20 connections per minute
  skipSuccessfulRequests: true,
});

module.exports = {
  securityHeaders,
  apiLimiter,
  socketLimiter,
};

