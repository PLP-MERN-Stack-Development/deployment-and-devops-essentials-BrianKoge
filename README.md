# Socket.io Chat Application - Deployment & DevOps

A full-stack real-time chat application built with MERN stack (MongoDB, Express, React, Node.js) and Socket.io, with complete CI/CD pipeline and production deployment setup.

## 🚀 Features

- Real-time messaging with Socket.io
- Multiple chat rooms
- User presence indicators
- Typing indicators
- Message reactions
- Private messaging
- Search functionality
- Responsive design with Tailwind CSS
- Production-ready with security, logging, and monitoring

## 🌐 Live Demo

The application is deployed and live on Render:

- **Frontend**: [https://socket-io-c0jd.onrender.com/](https://socket-io-c0jd.onrender.com/)
- **Backend**: [https://socket-io1.onrender.com](https://socket-io1.onrender.com)
- **Health Check**: [https://socket-io1.onrender.com/health](https://socket-io1.onrender.com/health)

## 📋 Table of Contents

- [Features](#-features)
- [Live Demo](#-live-demo)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [CI/CD Pipeline](#-cicd-pipeline)
- [Monitoring](#-monitoring)
- [Documentation](#-documentation)

## 🛠 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Socket.io** - Real-time communication
- **MongoDB** - Database (with Mongoose)
- **Helmet** - Security headers
- **Morgan** - HTTP request logger
- **Compression** - Response compression

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **Socket.io Client** - Real-time client
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations

## 📁 Project Structure

```
.
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── socket/        # Socket.io client setup
│   │   └── App.jsx        # Main app component
│   ├── vite.config.js     # Vite configuration
│   └── package.json
├── server/                # Express backend
│   ├── config/           # Configuration files
│   │   └── database.js   # MongoDB connection
│   ├── controllers/      # Business logic
│   ├── middleware/       # Express middleware
│   ├── models/           # MongoDB models
│   ├── utils/            # Utility functions
│   ├── logs/             # Application logs
│   └── server.js         # Server entry point
├── .github/
│   └── workflows/        # GitHub Actions workflows
├── deployment/           # Deployment configs
│   ├── render.yaml       # Render configuration
│   ├── vercel.json       # Vercel configuration
│   ├── netlify.toml      # Netlify configuration
│   └── railway.json      # Railway configuration
├── DEPLOYMENT.md         # Deployment guide
└── README.md            # This file
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account (or local MongoDB)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd deployment-and-devops-essentials-BrianKoge
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables**
   - See [ENV_TEMPLATE.md](./ENV_TEMPLATE.md) for environment variable templates
   - Create `server/.env` with your configuration
   - Create `client/.env.local` for development

5. **Start development servers**

   Backend:
   ```bash
   cd server
   npm run dev
   ```

   Frontend (in a new terminal):
   ```bash
   cd client
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000
   - Health check: http://localhost:5000/health

## 🔐 Environment Variables

See [ENV_TEMPLATE.md](./ENV_TEMPLATE.md) for complete environment variable setup.

### Backend Variables
- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port
- `CLIENT_URL` - Frontend URL (for CORS)
- `MONGODB_URI` - MongoDB connection string

### Frontend Variables
- `VITE_SOCKET_URL` - Backend Socket.io URL
- `VITE_NODE_ENV` - Environment

## 🚀 Deployment

### Live Application

- **Frontend**: [https://socket-io-c0jd.onrender.com/](https://socket-io-c0jd.onrender.com/)
- **Backend**: [https://socket-io1.onrender.com](https://socket-io1.onrender.com)
- **Health Check**: [https://socket-io1.onrender.com/health](https://socket-io1.onrender.com/health)

### Quick Deploy

This application is configured for deployment on multiple platforms:

**Backend Options:**
- [Render](https://render.com) - Recommended for free tier
- [Railway](https://railway.app) - Easy setup
- [Heroku](https://heroku.com) - Well-established

**Frontend Options:**
- [Vercel](https://vercel.com) - Recommended for React apps
- [Netlify](https://netlify.com) - Great CI/CD
- [GitHub Pages](https://pages.github.com) - Free hosting

### Detailed Deployment Guide

See [DEPLOYMENT.md](./DEPLOYMENT.md) for comprehensive deployment instructions including:
- MongoDB Atlas setup
- Platform-specific deployment steps
- Environment variable configuration
- Custom domain setup
- SSL/HTTPS configuration

## 🔄 CI/CD Pipeline

The project includes GitHub Actions workflows for continuous integration and deployment:

### Workflows

1. **Backend CI** (`.github/workflows/backend-ci.yml`)
   - Runs on push/PR to main/develop
   - Tests Node.js 18.x and 20.x
   - Lints code
   - Verifies server startup

2. **Frontend CI** (`.github/workflows/frontend-ci.yml`)
   - Runs on push/PR to main/develop
   - Tests Node.js 18.x and 20.x
   - Lints code
   - Builds production bundle

3. **Backend CD** (`.github/workflows/backend-cd.yml`)
   - Deploys on push to main
   - Supports Render, Railway, and Heroku
   - Configurable via GitHub Secrets

4. **Frontend CD** (`.github/workflows/frontend-cd.yml`)
   - Deploys on push to main
   - Supports Vercel, Netlify, and GitHub Pages
   - Configurable via GitHub Secrets

### Setting Up CI/CD

1. **Configure GitHub Secrets**
   - Go to repository Settings → Secrets and variables → Actions
   - Add required secrets (see [DEPLOYMENT.md](./DEPLOYMENT.md))

2. **Workflows run automatically**
   - CI runs on every push/PR
   - CD runs on push to main branch

## 📊 Monitoring

### Health Check

The backend includes a health check endpoint:

```bash
GET /health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 3600,
  "environment": "production",
  "database": "connected"
}
```

### Logging

- **Access logs**: `server/logs/access.log`
- **Error logs**: `server/logs/error.log`
- Production logs available in deployment platform dashboards

### Recommended Monitoring Tools

- **Uptime Monitoring**: [UptimeRobot](https://uptimerobot.com)
- **Error Tracking**: [Sentry](https://sentry.io)
- **Performance**: Platform-native monitoring (Render, Railway, etc.)

## 📚 Documentation

- [DEPLOYMENT.md](./DEPLOYMENT.md) - Complete deployment guide
- [ENV_TEMPLATE.md](./ENV_TEMPLATE.md) - Environment variables template
- [Week7-Assignment.md](./Week7-Assignment.md) - Assignment requirements

## 🧪 Testing

### Manual Testing

1. **Backend Health Check**
   ```bash
   curl http://localhost:5000/health
   ```

2. **API Endpoints**
   ```bash
   curl http://localhost:5000/api/messages
   curl http://localhost:5000/api/users
   curl http://localhost:5000/api/rooms
   ```

3. **Frontend Build**
   ```bash
   cd client
   npm run build
   npm run preview
   ```

## 🔒 Security Features

- **Helmet.js** - Security headers
- **Rate Limiting** - API rate limiting
- **CORS** - Configured CORS policy
- **Environment Variables** - Secure configuration
- **Input Validation** - Request validation
- **Error Handling** - Secure error responses

## 📝 Production Checklist

- [ ] MongoDB Atlas cluster configured
- [ ] Environment variables set on all platforms
- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Health check endpoint working
- [ ] CORS configured correctly
- [ ] HTTPS/SSL enabled
- [ ] CI/CD pipelines running
- [ ] Monitoring set up
- [ ] Error tracking configured
- [ ] Documentation updated

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 👤 Author

**Brian Koge**

## 🔗 Resources

- [Socket.io Documentation](https://socket.io/docs)
- [React Documentation](https://react.dev)
- [Express.js Documentation](https://expressjs.com)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com)
- [Vite Documentation](https://vitejs.dev)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

## 🔧 Troubleshooting

### CORS Errors

If you're experiencing CORS errors after deployment, see [CORS_FIX.md](./CORS_FIX.md) for step-by-step instructions to fix environment variable configuration.

Common issues:
- Frontend connecting to `localhost` instead of production backend
- Backend CORS not allowing production frontend URL
- Environment variables not set during build
- Trailing slash mismatch in `CLIENT_URL`

### MongoDB Connection Errors

If you're seeing MongoDB connection errors (502 Bad Gateway), see [MONGODB_FIX.md](./MONGODB_FIX.md) for instructions on whitelisting Render's IP addresses in MongoDB Atlas.

**Note**: The application will continue running without MongoDB (using in-memory storage), but you should fix the connection for production.

## 📞 Support

For deployment issues, refer to:
1. [DEPLOYMENT.md](./DEPLOYMENT.md) troubleshooting section
2. [CORS_FIX.md](./CORS_FIX.md) for CORS-related issues
3. [MONGODB_FIX.md](./MONGODB_FIX.md) for MongoDB connection issues
4. Platform-specific documentation
5. GitHub Issues

---

**Status**: ✅ Production Ready 