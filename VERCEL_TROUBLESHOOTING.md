# 🔧 Vercel Deployment Troubleshooting

## 🚨 Issue: Deployed App Not Showing Content

If your Vercel deployment shows a blank page or doesn't work, follow these steps:

### 1. **Check Build Logs**
- Go to your Vercel dashboard
- Click on your project
- Check the "Functions" and "Deployments" tabs for errors

### 2. **Verify Environment Variables**
Make sure these are set in Vercel project settings:

```
MONGODB_URI=mongodb+srv://admin:admin123@cluster-1.tzvz69i.mongodb.net/appointment_booking?retryWrites=true&w=majority&appName=Cluster-1
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=30d
NODE_ENV=production
```

### 3. **Check API Endpoints**
Test these URLs after deployment:
- `https://your-app.vercel.app/health` - Should return system status
- `https://your-app.vercel.app/api/services` - Should return services data

### 4. **Common Issues & Solutions**

#### Issue: Blank Page
**Solution**: Check if the React build is working
- Verify `client/build` folder is created during deployment
- Check browser console for JavaScript errors

#### Issue: API Not Working
**Solution**: Check server configuration
- Verify `server-mongodb.js` is the correct entry point
- Check environment variables are set
- Test MongoDB connection

#### Issue: 404 Errors
**Solution**: Check routing configuration
- Verify `vercel.json` routes are correct
- Make sure all API routes start with `/api/`

### 5. **Manual Deployment Steps**

If automatic deployment fails, try manual deployment:

```bash
# Install Vercel CLI
npm i -g vercel

# Build the client
cd client && npm run build && cd ..

# Deploy
vercel --prod
```

### 6. **Alternative: Deploy Backend and Frontend Separately**

#### Backend Only (Vercel):
1. Create new Vercel project
2. Deploy only the backend files
3. Set environment variables
4. Test API endpoints

#### Frontend Only (Netlify/Vercel):
1. Build the React app: `cd client && npm run build`
2. Deploy the `client/build` folder
3. Set `REACT_APP_API_URL` to your backend URL

### 7. **Debug Checklist**

- [ ] Environment variables set correctly
- [ ] MongoDB Atlas allows connections from anywhere (0.0.0.0/0)
- [ ] `server-mongodb.js` exists and is correct entry point
- [ ] `client/build` folder is created during deployment
- [ ] No console errors in browser
- [ ] API endpoints respond correctly
- [ ] CORS is configured for your domain

### 8. **Test Deployment Locally**

Before deploying, test the production build locally:

```bash
# Build the client
cd client && npm run build && cd ..

# Start production server
NODE_ENV=production node server-mongodb.js

# Test at http://localhost:5001
```

### 9. **Contact Support**

If issues persist:
1. Check Vercel documentation
2. Share build logs
3. Test API endpoints directly
4. Verify all files are in the repository

## 🎯 Quick Fix Commands

```bash
# Re-deploy with latest changes
git add . && git commit -m "Fix deployment" && git push

# Test local production build
npm run build && NODE_ENV=production npm start

# Check if services are working
curl https://your-app.vercel.app/health
curl https://your-app.vercel.app/api/services
```

Your app should work after following these steps! 🚀