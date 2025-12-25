# 🗄️ MongoDB Setup Guide

## Option 1: Local MongoDB Installation

### Windows Installation:

1. **Download MongoDB Community Server**
   - Go to: https://www.mongodb.com/try/download/community
   - Select: Windows x64
   - Download the MSI installer

2. **Install MongoDB**
   ```
   - Run the downloaded .msi file
   - Choose "Complete" installation
   - ✅ Install MongoDB as a Windows Service
   - ✅ Install MongoDB Compass (GUI tool)
   - Click "Install"
   ```

3. **Verify Installation**
   ```bash
   # Open Command Prompt and run:
   mongosh
   
   # If successful, you'll see:
   # Current Mongosh Log ID: ...
   # Connecting to: mongodb://127.0.0.1:27017
   # test>
   ```

4. **Create Database**
   ```javascript
   // In mongosh:
   use appointment_booking
   
   // Create a test collection
   db.test.insertOne({message: "Database created!"})
   
   // Exit
   exit
   ```

### macOS Installation:

```bash
# 1. Install using Homebrew
brew tap mongodb/brew
brew install mongodb-community

# 2. Start MongoDB service
brew services start mongodb-community

# 3. Verify installation
mongosh

# 4. Create database
use appointment_booking
db.test.insertOne({message: "Database created!"})
exit
```

### Linux (Ubuntu/Debian) Installation:

```bash
# 1. Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# 2. Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# 3. Update package database
sudo apt-get update

# 4. Install MongoDB
sudo apt-get install -y mongodb-org

# 5. Start MongoDB service
sudo systemctl start mongod
sudo systemctl enable mongod

# 6. Verify installation
mongosh

# 7. Create database
use appointment_booking
db.test.insertOne({message: "Database created!"})
exit
```

## Option 2: MongoDB Atlas (Cloud - Free)

### Step 1: Create Account
1. Go to: https://www.mongodb.com/atlas
2. Click "Try Free"
3. Sign up with email or Google

### Step 2: Create Cluster
1. Choose "Build a Database"
2. Select "M0 Sandbox" (FREE)
3. Choose cloud provider (AWS recommended)
4. Select region closest to you
5. Name your cluster: "appointment-booking"
6. Click "Create"

### Step 3: Create Database User
1. Go to "Database Access"
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `admin`
5. Password: `password123` (or generate secure password)
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

### Step 4: Configure Network Access
1. Go to "Network Access"
2. Click "Add IP Address"
3. Choose "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### Step 5: Get Connection String
1. Go to "Database" → "Connect"
2. Choose "Connect your application"
3. Select "Node.js" and version "4.1 or later"
4. Copy the connection string:
   ```
   mongodb+srv://admin:<password>@appointment-booking.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## Configure Your Application

### Update .env File:

**For Local MongoDB:**
```env
MONGODB_URI=mongodb://localhost:27017/appointment_booking
```

**For MongoDB Atlas:**
```env
MONGODB_URI=mongodb+srv://admin:password123@appointment-booking.xxxxx.mongodb.net/appointment_booking?retryWrites=true&w=majority
```

### Test Connection:

```bash
# 1. Update your .env file with MongoDB URI
# 2. Test the connection
node -e "
const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected Successfully!'))
  .catch(err => console.log('❌ Connection Error:', err.message));
"
```

## Seed Database with Sample Data

```bash
# Run the seeder script
npm run seed

# You should see:
# MongoDB connected
# Cleared existing data
# Admin user created
# Staff users created
# Customer users created
# Services created
# Sample appointments created
# === Database Seeded Successfully ===
```

## Switch from Demo Mode to Production

### Update package.json scripts:
```json
{
  "scripts": {
    "dev": "concurrently \"npm run server\" \"npm run client\"",
    "start": "node server.js"
  }
}
```

### Run with MongoDB:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Verify Everything Works

1. **Start the application:**
   ```bash
   npm run dev
   ```

2. **Check logs:**
   ```
   ✅ Should see: "MongoDB connected"
   ✅ Should see: "Server running on port 5001"
   ```

3. **Test login:**
   - Go to: http://localhost:3000
   - Login with: admin@demo.com / password123

## Troubleshooting

### Common Issues:

**Connection Refused:**
```bash
# Check if MongoDB is running
# Windows:
net start MongoDB

# macOS:
brew services start mongodb-community

# Linux:
sudo systemctl start mongod
```

**Authentication Failed (Atlas):**
- Check username/password in connection string
- Verify database user exists
- Check network access (IP whitelist)

**Port Already in Use:**
```bash
# Check what's using port 27017
netstat -ano | findstr :27017

# Kill the process if needed
taskkill /PID <PID> /F
```

**Database Not Found:**
- MongoDB creates databases automatically
- Run the seed script: `npm run seed`

## MongoDB GUI Tools

### MongoDB Compass (Recommended):
- Download: https://www.mongodb.com/products/compass
- Connect using your MongoDB URI
- Visual interface for database management

### Studio 3T (Advanced):
- Download: https://studio3t.com/
- 30-day free trial
- Advanced querying and management

## Production Considerations

### Security:
```env
# Use strong passwords
MONGODB_URI=mongodb://admin:STRONG_PASSWORD@localhost:27017/appointment_booking

# For Atlas, enable IP whitelisting
# Add only your server's IP address
```

### Backup:
```bash
# Local backup
mongodump --db appointment_booking --out ./backup

# Restore
mongorestore --db appointment_booking ./backup/appointment_booking
```

### Monitoring:
- Enable MongoDB logs
- Set up Atlas monitoring (free tier included)
- Monitor connection pool and performance

## Success! 🎉

Once MongoDB is connected:
- ✅ Real data persistence
- ✅ User registration works
- ✅ Appointments are saved
- ✅ Email notifications work
- ✅ All features fully functional

Your appointment booking system is now production-ready! 🚀