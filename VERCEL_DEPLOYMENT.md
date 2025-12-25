# 🚀 Vercel Deployment Guide

## Quick Deploy to Vercel

### Option 1: One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/appointment-booking-system)

### Option 2: Manual Deployment

#### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

#### Step 2: Login to Vercel
```bash
vercel login
```

#### Step 3: Deploy
```bash
# From your project root
vercel

# Follow the prompts:
# ? Set up and deploy "appointment-booking-system"? [Y/n] Y
# ? Which scope do you want to deploy to? [Your Account]
# ? Link to existing project? [y/N] N
# ? What's your project's name? appointment-booking-system
# ? In which directory is your code located? ./
```

#### Step 4: Set Environment Variables
```bash
# Add your MongoDB Atlas connection string
vercel env add MONGODB_URI

# Add JWT secret
vercel env add JWT_SECRET

# Add other environment variables
vercel env add JWT_EXPIRE
vercel env add CLIENT_URL
```

**Environment Variables to Add:**
```
MONGODB_URI=mongodb+srv://admin:admin123@cluster-1.tzvz69i.mongodb.net/appointment_booking?retryWrites=true&w=majority&appName=Cluster-1
JWT_SECRET=your_secure_jwt_secret_here
JWT_EXPIRE=30d
CLIENT_URL=https://your-app.vercel.app
NODE_ENV=production
```

#### Step 5: Redeploy with Environment Variables
```bash
vercel --prod
```

## Alternative: Deploy Frontend and Backend Separately

### Frontend (React) on Vercel
1. **Create new Vercel project**
2. **Connect GitHub repository**
3. **Set build settings:**
   - Framework Preset: `Create React App`
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `build`

4. **Environment Variables:**
   ```
   REACT_APP_API_URL=https://your-backend-url.railway.app/api
   ```

### Backend (Node.js) on Railway
1. **Go to Railway.app**
2. **Connect GitHub repository**
3. **Add MongoDB service**
4. **Set environment variables:**
   ```
   NODE_ENV=production
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=your-jwt-secret
   CLIENT_URL=https://your-frontend.vercel.app
   ```

## GitHub Repository Setup

### Step 1: Create GitHub Repository
```bash
# Initialize git (if not done)
git init

# Add remote repository
git remote add origin https://github.com/yourusername/appointment-booking-system.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 2: Connect to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import from GitHub
4. Select your repository
5. Configure build settings

## Build Configuration

### Root Directory Structure
```
appointment-booking-system/
├── client/          # React frontend
├── server.js        # Node.js backend
├── models/          # MongoDB models
├── routes/          # API routes
├── vercel.json      # Vercel configuration
└── package.json     # Backend dependencies
```

### Vercel Build Settings
- **Framework Preset:** Other
- **Root Directory:** `./`
- **Build Command:** `npm run build`
- **Output Directory:** `client/build`
- **Install Command:** `npm install && cd client && npm install`

## Environment Variables Setup

### Required Variables:
```bash
# Database
MONGODB_URI=mongodb+srv://admin:admin123@cluster-1.tzvz69i.mongodb.net/appointment_booking?retryWrites=true&w=majority&appName=Cluster-1

# Authentication
JWT_SECRET=your_very_secure_jwt_secret_for_production
JWT_EXPIRE=30d

# URLs
CLIENT_URL=https://your-app-name.vercel.app
NODE_ENV=production

# Optional: Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@your-app-name.vercel.app
```

## Custom Domain (Optional)

### Step 1: Add Domain in Vercel
1. Go to Project Settings
2. Click "Domains"
3. Add your custom domain

### Step 2: Configure DNS
Point your domain to Vercel:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

## Troubleshooting

### Common Issues:

**Build Fails:**
```bash
# Check build logs in Vercel dashboard
# Ensure all dependencies are in package.json
# Verify build commands are correct
```

**API Routes Not Working:**
```bash
# Check vercel.json configuration
# Verify API routes are properly defined
# Check environment variables are set
```

**Database Connection Issues:**
```bash
# Verify MongoDB Atlas connection string
# Check network access settings in Atlas
# Ensure environment variables are correct
```

**Frontend Not Loading:**
```bash
# Check build output directory
# Verify React build is successful
# Check for any console errors
```

## Performance Optimization

### Enable Caching:
```json
{
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "s-maxage=60, stale-while-revalidate"
        }
      ]
    }
  ]
}
```

### Enable Compression:
```json
{
  "functions": {
    "server.js": {
      "maxDuration": 30
    }
  }
}
```

## Monitoring & Analytics

### Add Vercel Analytics:
```bash
npm install @vercel/analytics
```

```javascript
// In your React app
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <>
      <YourApp />
      <Analytics />
    </>
  );
}
```

## Success! 🎉

Your appointment booking system is now deployed on Vercel!

**Access your app:**
- **Production URL:** https://your-app-name.vercel.app
- **Custom Domain:** https://your-domain.com (if configured)

**Admin Panel:** https://your-app-name.vercel.app/login
- Email: admin@demo.com
- Password: password123

**Features Working:**
- ✅ Complete appointment booking system
- ✅ Real-time database with MongoDB Atlas
- ✅ Secure authentication
- ✅ Responsive design
- ✅ Admin dashboard
- ✅ Email notifications (if configured)

**Next Steps:**
1. Test all features
2. Configure custom domain
3. Set up email notifications
4. Add your real services and staff
5. Start taking bookings!

---

**Need Help?** Check Vercel documentation or create an issue in the repository.