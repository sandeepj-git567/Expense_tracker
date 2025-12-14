# Netlify Deployment Guide

## Netlify Configuration

### Branch to deploy
```
main
```

### Base directory
```
frontend
```

### Build command
```
npm run build
```

### Publish directory
```
build
```

### Functions directory
```
netlify/functions
```

### Environment Variables
Add these environment variables in Netlify dashboard:

```
REACT_APP_API_URL=https://your-backend-api-url.com
```

**Important:** Replace `https://your-backend-api-url.com` with your actual backend API URL.

## Pre-deployment Steps

1. Ensure your backend is deployed and accessible
2. Update the `REACT_APP_API_URL` environment variable in Netlify to point to your backend
3. Make sure your backend has CORS configured to allow requests from your Netlify domain

## Files Created for Deployment

- `netlify.toml` - Netlify configuration
- `frontend/.env` - Local environment variables
- `frontend/.env.example` - Environment variables template

## Backend Deployment

Your backend needs to be deployed separately. Consider using:
- Heroku
- Railway
- Render
- AWS EC2/ECS
- DigitalOcean

Make sure to:
1. Set up your MongoDB database (MongoDB Atlas recommended)
2. Configure environment variables on your backend hosting platform
3. Update CORS settings to allow your Netlify domain