# CORS Error Fix Guide

## Problem

1. The frontend is trying to connect to `http://localhost:5000` instead of the deployed backend
2. The backend CORS is configured for `http://localhost:5173` instead of the production frontend URL
3. **Trailing slash mismatch**: If `CLIENT_URL` has a trailing slash (`https://socket-io-c0jd.onrender.com/`) but the origin doesn't, CORS will fail
4. **502 Bad Gateway**: If the backend is crashing (often due to MongoDB connection failures), you'll see 502 errors

## Solution

You need to set environment variables in Render for both services.

### Step 1: Fix Backend CORS Configuration

1. Go to your **Backend** service on Render: `https://socket-io1.onrender.com`
2. Navigate to **Environment** tab
3. Set or update the `CLIENT_URL` environment variable:
   ```
   CLIENT_URL=https://socket-io-c0jd.onrender.com
   ```
   **Important**: Do NOT include a trailing slash (`/`) at the end!
4. **Save** and **Redeploy** the service

**Note**: The code now automatically removes trailing slashes, but it's best practice to set it correctly.

### Step 2: Fix Frontend Socket URL

1. Go to your **Frontend** service on Render: `https://socket-io-c0jd.onrender.com`
2. Navigate to **Environment** tab
3. Add the `VITE_SOCKET_URL` environment variable:
   ```
   VITE_SOCKET_URL=https://socket-io1.onrender.com
   ```
4. **Save** and trigger a **Manual Deploy** (or push a new commit)

**Important**: After setting `VITE_SOCKET_URL`, you must rebuild the frontend because Vite environment variables are embedded at build time, not runtime.

### Step 3: Verify the Fix

1. Check backend health: https://socket-io1.onrender.com/health
2. Open frontend: https://socket-io-c0jd.onrender.com
3. Open browser console (F12) and check for CORS errors
4. The socket should connect to `https://socket-io1.onrender.com` instead of `http://localhost:5000`

## Alternative: Update Render Blueprint

If you're using the Render Blueprint (`deployment/render.yaml`), you can update it with the correct URLs:

```yaml
# Backend Service
- type: web
  name: socketio-chat-backend
  envVars:
    - key: CLIENT_URL
      value: https://socket-io-c0jd.onrender.com  # Update this

# Frontend Static Site
- type: web
  name: socketio-chat-frontend
  envVars:
    - key: VITE_SOCKET_URL
      value: https://socket-io1.onrender.com  # Update this
```

Then redeploy using the blueprint.

## Troubleshooting

### Frontend still connecting to localhost

- **Cause**: `VITE_SOCKET_URL` wasn't set during build
- **Fix**: Set the environment variable and rebuild/redeploy

### CORS errors persist

- **Cause**: Backend `CLIENT_URL` doesn't match frontend URL
- **Fix**: 
  - Ensure `CLIENT_URL` in backend exactly matches your frontend URL (including `https://`)
  - **Remove any trailing slashes** from `CLIENT_URL`
  - The code now normalizes URLs automatically, but double-check your environment variable

### 502 Bad Gateway errors

- **Cause**: Backend server is crashing (often due to MongoDB connection failure)
- **Fix**: 
  - Check Render backend logs for error messages
  - If you see MongoDB connection errors, see [MONGODB_FIX.md](./MONGODB_FIX.md)
  - The app now continues running even if MongoDB fails, but you should fix the connection

### Mixed content errors

- **Cause**: Frontend (HTTPS) trying to connect to backend (HTTP)
- **Fix**: Ensure both use HTTPS in production

## Quick Checklist

- [ ] Backend `CLIENT_URL` = `https://socket-io-c0jd.onrender.com`
- [ ] Frontend `VITE_SOCKET_URL` = `https://socket-io1.onrender.com`
- [ ] Both services redeployed after setting environment variables
- [ ] No trailing slashes in URLs
- [ ] Both URLs use HTTPS (not HTTP)


