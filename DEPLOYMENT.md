# 🚀 Deployment Guide

## Quick Deploy Options

### 1. Heroku (Recommended)

#### One-Click Deploy
[![Deploy to Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

#### Manual Heroku Deployment

1. **Install Heroku CLI**
   ```bash
   # Download from: https://devcenter.heroku.com/articles/heroku-cli
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku App**
   ```bash
   heroku create your-app-name
   ```

4. **Add MongoDB Atlas**
   ```bash
   heroku addons:create mongolab:sandbox
   ```

5. **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=$(openssl rand -base64 32)
   heroku config:set JWT_EXPIRE=30d
   
   # Optional: Email configuration
   heroku config:set EMAIL_HOST=smtp.gmail.com
   heroku config:set EMAIL_PORT=587
   heroku config:set EMAIL_USER=your-email@gmail.com
   heroku config:set EMAIL_PASS=your-app-password
   heroku config:set EMAIL_FROM=noreply@yourapp.com
   ```

6. **Deploy**
   ```bash
   git add .
   git commit -m "Initial deployment"
   git push heroku main
   ```

7. **Seed Database**
   ```bash
   heroku run npm run seed
   ```

### 2. Railway

1. **Connect GitHub Repository**
   - Go to [Railway.app](https://railway.app)
   - Connect your GitHub account
   - Import this repository

2. **Add MongoDB**
   - Add MongoDB service from Railway marketplace
   - Copy the connection string

3. **Set Environment Variables**
   ```
   NODE_ENV=production
   MONGODB_URI=your-railway-mongodb-url
   JWT_SECRET=your-secure-secret
   JWT_EXPIRE=30d
   CLIENT_URL=https://your-app.railway.app
   ```

4. **Deploy**
   - Railway will automatically deploy on git push

### 3. DigitalOcean App Platform

1. **Create App**
   - Go to DigitalOcean App Platform
   - Connect GitHub repository

2. **Configure Build Settings**
   ```yaml
   name: appointment-booking-system
   services:
   - name: api
     source_dir: /
     github:
       repo: your-username/appointment-booking-system
       branch: main
     run_command: npm start
     environment_slug: node-js
     instance_count: 1
     instance_size_slug: basic-xxs
     envs:
     - key: NODE_ENV
       value: production
     - key: MONGODB_URI
       value: your-mongodb-connection-string
     - key: JWT_SECRET
       value: your-jwt-secret
   ```

### 4. Vercel (Frontend) + Railway (Backend)

#### Deploy Frontend to Vercel
1. **Connect Repository**
   - Go to [Vercel.com](https://vercel.com)
   - Import GitHub repository
   - Set root directory to `client`

2. **Environment Variables**
   ```
   REACT_APP_API_URL=https://your-backend-url.railway.app/api
   ```

#### Deploy Backend to Railway
1. **Create New Project**
   - Import repository
   - Set start command: `npm start`

## 🔧 Production Configuration

### Environment Variables
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/appointment_booking
JWT_SECRET=your-very-secure-jwt-secret
JWT_EXPIRE=30d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@yourapp.com

# Frontend URL
CLIENT_URL=https://your-frontend-domain.com
```

### MongoDB Atlas Setup
1. **Create Account** at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. **Create Cluster** (Free tier available)
3. **Create Database User**
4. **Whitelist IP Addresses** (0.0.0.0/0 for all IPs)
5. **Get Connection String**

### Email Configuration (Gmail)
1. **Enable 2-Factor Authentication**
2. **Generate App Password**:
   - Google Account → Security → App passwords
   - Select "Mail" and generate password
3. **Use App Password** in EMAIL_PASS variable

## 📱 Mobile App (Optional)

### React Native Setup
```bash
# Install React Native CLI
npm install -g @react-native-community/cli

# Create new React Native project
npx react-native init AppointmentBookingApp

# Install dependencies
npm install axios @react-navigation/native
```

### Expo Setup (Easier)
```bash
# Install Expo CLI
npm install -g expo-cli

# Create Expo project
expo init AppointmentBookingApp
cd AppointmentBookingApp

# Install dependencies
expo install axios
```

## 🔒 Security Checklist

- ✅ Environment variables properly set
- ✅ JWT secret is secure and random
- ✅ MongoDB connection uses authentication
- ✅ CORS configured for production domain
- ✅ Rate limiting enabled
- ✅ Input validation on all endpoints
- ✅ HTTPS enabled (automatic on most platforms)

## 📊 Monitoring & Analytics

### Add Monitoring
```bash
# Install monitoring packages
npm install newrelic @sentry/node

# Add to server.js
require('newrelic');
const Sentry = require('@sentry/node');
```

### Performance Monitoring
- **New Relic**: Application performance monitoring
- **Sentry**: Error tracking and performance
- **LogRocket**: Frontend monitoring
- **MongoDB Atlas**: Database monitoring

## 🚀 CI/CD Pipeline

### GitHub Actions
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '16'
        
    - name: Install dependencies
      run: |
        npm install
        cd client && npm install
        
    - name: Build application
      run: npm run build
      
    - name: Deploy to Heroku
      uses: akhileshns/heroku-deploy@v3.12.12
      with:
        heroku_api_key: ${{secrets.HEROKU_API_KEY}}
        heroku_app_name: "your-app-name"
        heroku_email: "your-email@example.com"
```

## 🎯 Post-Deployment Steps

1. **Test All Features**
   - User registration and login
   - Appointment booking flow
   - Admin panel functionality
   - Email notifications

2. **Create Admin Account**
   ```bash
   # SSH into your server or use Heroku console
   heroku run node -e "
   const User = require('./models/User');
   const mongoose = require('mongoose');
   mongoose.connect(process.env.MONGODB_URI);
   const admin = new User({
     firstName: 'Admin',
     lastName: 'User',
     email: 'admin@yourcompany.com',
     password: 'secure-password',
     phone: '+1234567890',
     role: 'admin'
   });
   admin.save().then(() => console.log('Admin created'));
   "
   ```

3. **Configure Domain** (if using custom domain)
4. **Set up SSL Certificate** (usually automatic)
5. **Configure Email Templates**
6. **Set up Backup Strategy**

## 🆘 Troubleshooting

### Common Issues
- **Build Failures**: Check Node.js version compatibility
- **Database Connection**: Verify MongoDB URI and network access
- **Email Not Working**: Check SMTP credentials and firewall
- **CORS Errors**: Update CLIENT_URL environment variable

### Logs
```bash
# Heroku logs
heroku logs --tail

# Railway logs
railway logs

# DigitalOcean logs
doctl apps logs your-app-id
```

## 🎉 Success!

Your appointment booking system is now live! 🚀

**Demo Accounts:**
- Admin: admin@demo.com / password123
- Staff: staff@demo.com / password123
- Customer: customer@demo.com / password123

**Next Steps:**
1. Customize branding and colors
2. Add more services and staff
3. Configure email templates
4. Set up analytics and monitoring
5. Add mobile app (optional)

Happy booking! 📅✨