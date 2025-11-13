# Deployment Guide

This guide covers deploying the MERN stack Socket.io Chat application to production.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Variables](#environment-variables)
3. [MongoDB Atlas Setup](#mongodb-atlas-setup)
4. [Backend Deployment](#backend-deployment)
5. [Frontend Deployment](#frontend-deployment)
6. [CI/CD Setup](#cicd-setup)
7. [Monitoring](#monitoring)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

- GitHub account
- MongoDB Atlas account
- Backend hosting account (Render, Railway, or Heroku)
- Frontend hosting account (Vercel, Netlify, or GitHub Pages)
- Node.js 18+ installed locally

## Environment Variables

### Backend Environment Variables

Create a `.env` file in the `server/` directory:

```env
NODE_ENV=production
PORT=5000
CLIENT_URL=https://your-frontend-url.com
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority
```

### Frontend Environment Variables

Create a `.env.production` file in the `client/` directory:

```env
VITE_SOCKET_URL=https://your-backend-url.com
VITE_NODE_ENV=production
```

## MongoDB Atlas Setup

1. **Create a MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account

2. **Create a Cluster**
   - Click "Build a Database"
   - Choose the free tier (M0)
   - Select a cloud provider and region
   - Click "Create"

3. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create a username and strong password
   - Set user privileges to "Read and write to any database"
   - Click "Add User"

4. **Configure Network Access**
   - Go to "Network Access"
   - Click "Add IP Address"
   - For production, click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<database-name>` with your database name

## Backend Deployment

### Option 1: Render

1. **Create a New Web Service**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Service**
   - Name: `socketio-chat-backend`
   - Environment: `Node`
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && npm start`
   - Plan: Free

3. **Set Environment Variables**
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (Render sets this automatically)
   - `CLIENT_URL`: Your frontend URL
   - `MONGODB_URI`: Your MongoDB Atlas connection string

4. **Deploy**
   - Click "Create Web Service"
   - Render will automatically deploy on every push to main branch

### Option 2: Railway

1. **Create a New Project**
   - Go to [Railway Dashboard](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

2. **Configure Service**
   - Railway will auto-detect Node.js
   - Set Root Directory to `server`
   - Set Start Command to `npm start`

3. **Set Environment Variables**
   - Add all required environment variables in Railway dashboard

4. **Deploy**
   - Railway will automatically deploy on every push

### Option 3: Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login and Create App**
   ```bash
   heroku login
   heroku create your-app-name
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set CLIENT_URL=https://your-frontend-url.com
   heroku config:set MONGODB_URI=your-mongodb-uri
   ```

4. **Deploy**
   ```bash
   git subtree push --prefix server heroku main
   ```

## Frontend Deployment

### Option 1: Vercel

1. **Import Project**
   - Go to [Vercel Dashboard](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository

2. **Configure Project**
   - Framework Preset: `Vite`
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Set Environment Variables**
   - `VITE_SOCKET_URL`: Your backend URL
   - `VITE_NODE_ENV`: `production`

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically deploy on every push

### Option 2: Netlify

1. **Create a New Site**
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository

2. **Configure Build Settings**
   - Base directory: `client`
   - Build command: `npm install && npm run build`
   - Publish directory: `client/dist`

3. **Set Environment Variables**
   - Go to Site settings → Environment variables
   - Add `VITE_SOCKET_URL` and `VITE_NODE_ENV`

4. **Deploy**
   - Click "Deploy site"
   - Netlify will automatically deploy on every push

### Option 3: GitHub Pages

1. **Install gh-pages**
   ```bash
   cd client
   npm install --save-dev gh-pages
   ```

2. **Update package.json**
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     },
     "homepage": "https://yourusername.github.io/repository-name"
   }
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

## CI/CD Setup

### GitHub Actions

The repository includes GitHub Actions workflows for CI/CD:

- **Backend CI** (`.github/workflows/backend-ci.yml`): Runs tests and linting on backend changes
- **Frontend CI** (`.github/workflows/frontend-ci.yml`): Runs tests and builds frontend
- **Backend CD** (`.github/workflows/backend-cd.yml`): Deploys backend on main branch push
- **Frontend CD** (`.github/workflows/frontend-cd.yml`): Deploys frontend on main branch push

### Setting Up Secrets

1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Add the following secrets:

**For Backend Deployment:**
- `RENDER_SERVICE_ID` (if using Render)
- `RENDER_API_KEY` (if using Render)
- `RAILWAY_TOKEN` (if using Railway)
- `HEROKU_API_KEY` (if using Heroku)
- `HEROKU_APP_NAME` (if using Heroku)
- `HEROKU_EMAIL` (if using Heroku)

**For Frontend Deployment:**
- `VITE_SOCKET_URL`: Your backend URL
- `VERCEL_TOKEN` (if using Vercel)
- `VERCEL_ORG_ID` (if using Vercel)
- `VERCEL_PROJECT_ID` (if using Vercel)
- `NETLIFY_AUTH_TOKEN` (if using Netlify)
- `NETLIFY_SITE_ID` (if using Netlify)

## Monitoring

### Health Check Endpoint

The backend includes a health check endpoint at `/health`:

```bash
curl https://your-backend-url.com/health
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

### Uptime Monitoring

Set up uptime monitoring using:
- [UptimeRobot](https://uptimerobot.com) - Free tier available
- [Pingdom](https://www.pingdom.com)
- [StatusCake](https://www.statuscake.com)

Configure monitoring to check `/health` endpoint every 5 minutes.

### Error Tracking

Consider integrating error tracking:
- [Sentry](https://sentry.io) - Add `SENTRY_DSN` to environment variables
- [LogRocket](https://logrocket.com)
- [Rollbar](https://rollbar.com)

### Logging

Production logs are stored in:
- `server/logs/access.log` - Access logs
- `server/logs/error.log` - Error logs

For cloud platforms, check their logging dashboards:
- Render: Dashboard → Logs
- Railway: Project → Deployments → View Logs
- Heroku: `heroku logs --tail`

## Troubleshooting

### Backend Issues

**Server won't start:**
- Check environment variables are set correctly
- Verify MongoDB connection string
- Check port is available
- Review server logs

**CORS errors:**
- Ensure `CLIENT_URL` matches your frontend URL exactly
- Check for trailing slashes
- Verify HTTPS/HTTP protocol matches

**MongoDB connection fails:**
- Verify network access in MongoDB Atlas
- Check connection string format
- Ensure database user has correct permissions
- Verify IP whitelist includes your server IP

### Frontend Issues

**Build fails:**
- Check Node.js version (18+)
- Verify all dependencies are installed
- Check for syntax errors
- Review build logs

**Socket connection fails:**
- Verify `VITE_SOCKET_URL` is set correctly
- Check backend is running and accessible
- Verify CORS settings on backend
- Check browser console for errors

**Environment variables not working:**
- Ensure variables start with `VITE_` prefix
- Rebuild after changing environment variables
- Check variable names match exactly

### Deployment Issues

**GitHub Actions failing:**
- Check secrets are set correctly
- Verify workflow file syntax
- Review action logs for specific errors
- Ensure repository has correct permissions

**Auto-deployment not working:**
- Verify webhook is configured
- Check deployment platform settings
- Review deployment logs
- Ensure main branch is set correctly

## Maintenance

### Regular Tasks

1. **Weekly:**
   - Review error logs
   - Check application uptime
   - Monitor resource usage

2. **Monthly:**
   - Update dependencies
   - Review security advisories
   - Backup database

3. **Quarterly:**
   - Review and optimize performance
   - Update deployment documentation
   - Review and update monitoring setup

### Database Backups

MongoDB Atlas provides automatic backups on paid tiers. For free tier:
- Export data regularly using `mongoexport`
- Store backups securely
- Test restore procedures

### Rollback Procedures

1. **Backend Rollback:**
   - Use deployment platform's rollback feature
   - Or redeploy previous version from Git

2. **Frontend Rollback:**
   - Use deployment platform's rollback feature
   - Or redeploy previous version from Git

3. **Database Rollback:**
   - Restore from backup
   - Or use MongoDB Atlas point-in-time recovery (paid tier)

## Support

For issues or questions:
1. Check this documentation
2. Review deployment platform documentation
3. Check GitHub Issues
4. Contact your instructor or team

