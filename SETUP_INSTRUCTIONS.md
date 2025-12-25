# Complete Setup Instructions

## 🚀 Quick Start Guide

### Prerequisites
1. **Node.js** (v14 or higher) - [Download here](https://nodejs.org/)
2. **MongoDB** (v4.4 or higher) - [Download here](https://www.mongodb.com/try/download/community)
3. **Git** - [Download here](https://git-scm.com/)

### Step 1: Install MongoDB

#### Windows:
1. Download MongoDB Community Server from the official website
2. Run the installer and follow the setup wizard
3. Choose "Complete" installation
4. Install MongoDB as a Windows Service (recommended)
5. MongoDB will start automatically

#### macOS (with Homebrew):
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Linux (Ubuntu/Debian):
```bash
sudo apt-get update
sudo apt-get install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

### Step 2: Verify MongoDB Installation
Open a terminal/command prompt and run:
```bash
mongosh
```
If MongoDB is running, you'll see a connection message. Type `exit` to quit.

### Step 3: Clone and Setup the Project

1. **Clone the repository** (or extract if downloaded as ZIP)
2. **Navigate to the project directory**
3. **Run the setup script:**

#### Windows:
```cmd
setup.bat
```

#### macOS/Linux:
```bash
chmod +x setup.sh
./setup.sh
```

### Step 4: Configure Environment Variables

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Edit the `.env` file with your settings:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/appointment_booking
JWT_SECRET=your_secure_jwt_secret_here
JWT_EXPIRE=30d

# Email Configuration (Optional - for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=noreply@appointmentbooking.com

CLIENT_URL=http://localhost:3000
```

### Step 5: Seed the Database

Run the database seeder to create sample data:
```bash
node scripts/seedDatabase.js
```

This creates:
- **Admin:** admin@demo.com / password123
- **Staff:** staff@demo.com / password123
- **Customer:** customer@demo.com / password123
- Sample services and appointments

### Step 6: Start the Application

Run both backend and frontend:
```bash
npm run dev
```

The application will be available at:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

## 🔧 Manual Installation (if setup script fails)

### Backend Dependencies:
```bash
npm install
```

### Frontend Dependencies:
```bash
cd client
npm install --legacy-peer-deps
cd ..
```

### Start Development Servers:
```bash
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

## 📧 Email Configuration (Optional)

### Gmail Setup:
1. Enable 2-Factor Authentication on your Gmail account
2. Go to Google Account → Security → App passwords
3. Generate an app password for "Mail"
4. Use this password in the `EMAIL_PASS` environment variable

### Other Email Providers:
Update the SMTP settings in `.env` according to your provider's documentation.

## 🎯 Demo Accounts

After seeding the database, use these accounts to test:

### Admin Account
- **Email:** admin@demo.com
- **Password:** password123
- **Access:** Full system management, reports, user management

### Staff Account
- **Email:** staff@demo.com
- **Password:** password123
- **Access:** Appointment management, schedule management, reports

### Customer Account
- **Email:** customer@demo.com
- **Password:** password123
- **Access:** Book appointments, view history, manage profile

## 🌐 Production Deployment

### Environment Variables for Production:
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/appointment_booking
JWT_SECRET=your_very_secure_jwt_secret_for_production
# ... other production settings
```

### Recommended Platforms:
- **Heroku** (with MongoDB Atlas)
- **DigitalOcean** App Platform
- **Railway** (backend) + **Vercel** (frontend)
- **AWS** Elastic Beanstalk

## 🔍 Troubleshooting

### MongoDB Connection Issues:
1. Ensure MongoDB is running: `mongosh`
2. Check if port 27017 is available
3. Verify MongoDB service is started

### Port Already in Use:
1. Change PORT in `.env` file
2. Or kill the process using the port:
   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   
   # macOS/Linux
   lsof -ti:5000 | xargs kill -9
   ```

### Frontend Build Issues:
1. Delete `node_modules` and `package-lock.json`
2. Run `npm install --legacy-peer-deps`
3. Clear npm cache: `npm cache clean --force`

### Email Not Working:
1. Check SMTP settings in `.env`
2. Verify email credentials
3. Check firewall/antivirus blocking SMTP

## 📱 Features Overview

### For Customers:
- ✅ Online appointment booking
- ✅ Service browsing with details
- ✅ Real-time availability checking
- ✅ Appointment history and management
- ✅ Email confirmations and reminders
- ✅ Profile management

### For Staff:
- ✅ Personal dashboard with schedule
- ✅ Appointment management
- ✅ Working hours configuration
- ✅ Holiday scheduling
- ✅ Customer notes and history
- ✅ Performance reports

### For Admins:
- ✅ Complete system management
- ✅ Service management (CRUD)
- ✅ Staff management and scheduling
- ✅ Customer management
- ✅ Comprehensive reporting
- ✅ Revenue tracking and analytics
- ✅ User role management

## 🔒 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Role-based access control
- ✅ Input validation and sanitization
- ✅ Rate limiting
- ✅ CORS configuration
- ✅ Security headers with Helmet.js

## 📊 API Documentation

The system provides RESTful APIs for:
- Authentication (`/api/auth/*`)
- User management (`/api/users/*`)
- Service management (`/api/services/*`)
- Appointment management (`/api/appointments/*`)
- Staff management (`/api/staff/*`)
- Reports and analytics (`/api/reports/*`)

## 🆘 Support

If you encounter issues:
1. Check this troubleshooting guide
2. Verify all prerequisites are installed
3. Ensure MongoDB is running
4. Check the console for error messages
5. Review the `.env` configuration

## 🎉 Success!

Once everything is set up, you should see:
- Frontend running on http://localhost:3000
- Backend API on http://localhost:5000
- MongoDB connected and seeded with sample data
- All demo accounts working

**Happy booking! 📅✨**