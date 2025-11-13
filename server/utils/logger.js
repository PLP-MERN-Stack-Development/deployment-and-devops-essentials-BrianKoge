// utils/logger.js - Production logging utility

const morgan = require('morgan');
const fs = require('fs');
const path = require('path');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Create a write stream for access logs
const accessLogStream = fs.createWriteStream(
  path.join(logsDir, 'access.log'),
  { flags: 'a' }
);

// Create a write stream for error logs
const errorLogStream = fs.createWriteStream(
  path.join(logsDir, 'error.log'),
  { flags: 'a' }
);

// Custom format for production
const productionFormat = ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" :response-time ms';

// Development logger (console output)
const devLogger = morgan('dev');

// Production logger (file output)
const prodLogger = morgan(productionFormat, {
  stream: accessLogStream,
  skip: (req, res) => res.statusCode < 400, // Only log errors in production
});

// Error logger
const errorLogger = (err, req, res, next) => {
  const errorLog = `${new Date().toISOString()} - ${err.stack || err.message}\n`;
  errorLogStream.write(errorLog);
  next(err);
};

// Get logger based on environment
const getLogger = () => {
  if (process.env.NODE_ENV === 'production') {
    return prodLogger;
  }
  return devLogger;
};

module.exports = {
  getLogger,
  errorLogger,
  accessLogStream,
  errorLogStream,
};

