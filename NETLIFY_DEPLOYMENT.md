# Full-Stack Netlify Deployment

## Netlify Configuration

**Branch to deploy:** `main`
**Base directory:** `frontend`
**Build command:** `npm run build`
**Publish directory:** `build`
**Functions directory:** `netlify/functions`

## Environment Variables (Netlify Dashboard)

```
MONGODB_URI=mongodb+srv://expense-tracker:%40sandy9660@expense-tracker.locrsxu.mongodb.net/?retryWrites=true&w=majority&appName=expense-tracker
JWT_SECRET=expense_tracker_2025_super_secure_key_@12345_ABCDEF_abcdef_7890!
NODE_ENV=production
```

## What's Configured

- ✅ Backend converted to Netlify Functions
- ✅ Frontend configured for serverless deployment  
- ✅ API routes redirect to functions
- ✅ Environment variables configured
- ✅ MongoDB connection ready
- ✅ CORS configured for production

## Deploy Steps

1. Push code to GitHub
2. Connect repository to Netlify
3. Set environment variables in Netlify dashboard
4. Deploy

Your full-stack app will be available at your Netlify URL!