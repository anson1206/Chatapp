# Deployment Guide

## Architecture
- **Vercel**: Frontend (React) + API HTTP endpoints
- **Render.com**: WebSocket server (free tier)
- **MongoDB Atlas**: Database (free tier)

## Files Created
✅ `api/vercel.json` - Vercel deployment config
✅ `api/render.yaml` - Render deployment config
✅ `api/index-http.js` - HTTP-only API for Vercel
✅ `api/index-ws.js` - WebSocket-only server for Render
✅ `client/.env.production` - Production environment variables
✅ `client/.env.development` - Development environment variables

## Step 1: Setup MongoDB Atlas (Free)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account → Create M0 (free) cluster
3. Security → Database Access → Add user (save username/password)
4. Security → Network Access → Add IP `0.0.0.0/0`
5. Get connection string: `mongodb+srv://<user>:<password>@cluster.mongodb.net/chatapp`

## Step 2: Push to GitHub

```powershell
cd C:\Users\anson_a3mwhex\Desktop\CodingProjs\Chatapp
git init
git add .
git commit -m "Initial commit"
# Create repo on GitHub, then:
git remote add origin https://github.com/yourusername/chatapp.git
git push -u origin main
```

## Step 3: Deploy WebSocket Server to Render (DO THIS FIRST)

1. Go to https://render.com and sign up (free)
2. Click "New +" → "Web Service"
3. Connect your GitHub repo
4. Settings:
   - **Root Directory**: `api`
   - Render will auto-detect `render.yaml`
5. Add environment variables:
   - `MONGO_URL` - your MongoDB Atlas connection string
   - `JWT_SECRET` - any random string (e.g., `my-super-secret-jwt-key-12345`)
   - `CLIENT_URL` - leave blank for now, will update after Vercel deploy
6. Click "Deploy"
7. **Copy your Render URL**: `https://chatapp-ws-xxxx.onrender.com`

## Step 4: Deploy API to Vercel

```powershell
# Install Vercel CLI
npm install -g vercel

# Deploy API
cd api
vercel
```

Follow prompts, then:
1. Go to Vercel dashboard → Your project → Settings → Environment Variables
2. Add:
   - `MONGO_URL` - your MongoDB Atlas connection string
   - `JWT_SECRET` - same as Render
   - `CLIENT_URL` - leave blank for now
3. Redeploy: `vercel --prod`
4. **Copy your API URL**: `https://your-api-xxxx.vercel.app`

## Step 5: Deploy Frontend to Vercel

1. Update `client/.env.production`:
   ```
   VITE_API_URL=https://your-api-xxxx.vercel.app
   VITE_WS_URL=wss://chatapp-ws-xxxx.onrender.com
   ```

2. Deploy:
   ```powershell
   cd client
   vercel
   ```

3. Add environment variables in Vercel dashboard:
   - `VITE_API_URL` - your Vercel API URL
   - `VITE_WS_URL` - your Render WebSocket URL (use `wss://`)

4. Redeploy: `vercel --prod`
5. **Copy your frontend URL**: `https://your-app-xxxx.vercel.app`

## Step 6: Update CORS Settings

Go back and update `CLIENT_URL` on both services:

**Render (WebSocket server):**
- Environment Variables → `CLIENT_URL` = `https://your-app-xxxx.vercel.app`
- Redeploy

**Vercel (API):**
- Settings → Environment Variables → `CLIENT_URL` = `https://your-app-xxxx.vercel.app`
- Redeploy with `vercel --prod`

## Testing

1. Visit your frontend URL
2. Register a new account
3. Open in another browser/incognito window
4. Register another account
5. Send messages between accounts
6. Check WebSocket connection in browser DevTools → Network → WS

## Troubleshooting

### CORS Errors
- Ensure `CLIENT_URL` is set correctly on both Render and Vercel
- Check that URLs don't have trailing slashes

### WebSocket Connection Failed
- Verify Render service is running (check Render dashboard logs)
- Ensure you're using `wss://` (not `ws://`) in production
- Check browser console for connection errors

### MongoDB Connection Error
- Verify `MONGO_URL` is correct on both services
- Check MongoDB Atlas → Network Access → IP is `0.0.0.0/0`
- Verify database user has read/write permissions

### JWT/Authentication Issues
- Ensure `JWT_SECRET` is the same on both Render and Vercel
- Check cookies are being sent with `withCredentials: true`

## Cost
- **Total: $0/month** (all services are on free tiers)
- Render free tier: 750 hours/month
- Vercel free tier: 100GB bandwidth/month
- MongoDB Atlas M0: 512MB storage

## Custom Domain (Optional)
1. Buy domain from Namecheap, GoDaddy, etc.
2. In Vercel: Settings → Domains → Add domain
3. Follow DNS instructions provided by Vercel
