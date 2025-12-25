# 🚀 Quick Vercel Deployment Steps

## ✅ Error Fixed!
The `Environment Variable "MONGODB_URI" references Secret "mongodb_uri", which does not exist` error has been resolved.

## 📋 Deploy Now (3 Simple Steps):

### Step 1: Go to Vercel Dashboard
- Visit: https://vercel.com/dashboard
- Click "New Project"
- Import: `https://github.com/anasarya/online-appointment-booking-system`

### Step 2: Add Environment Variables
In Vercel project settings, add these **exact** environment variables:

```
MONGODB_URI=mongodb+srv://admin:admin123@cluster-1.tzvz69i.mongodb.net/appointment_booking?retryWrites=true&w=majority&appName=Cluster-1
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=30d
NODE_ENV=production
```

### Step 3: Deploy
- Click "Deploy"
- Wait for build to complete
- Your app will be live!

## 🎯 What Was Fixed:
- ✅ Removed `@mongodb_uri` secret reference from vercel.json
- ✅ Updated to use `server-mongodb.js` as entry point
- ✅ Simplified configuration for direct environment variables

## 📱 After Deployment:
- Update `CLIENT_URL` environment variable with your actual Vercel URL
- Test with demo accounts:
  - Admin: admin@demo.com / password123
  - Staff: staff@demo.com / password123
  - Customer: customer@demo.com / password123

## 🎉 That's It!
Your appointment booking system will be live on Vercel without any MongoDB URI errors!