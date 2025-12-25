# 🏥 Advanced Online Appointment Booking System

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/appointment-booking-system)

> **Professional appointment booking and management system built with React.js, Node.js, Express, and MongoDB Atlas. Perfect for clinics, salons, consultants, and service-based businesses.**

## ✨ **Live Demo**

🌐 **[View Live Demo](https://your-app.vercel.app)**

**Demo Accounts:**
- 👑 **Admin:** admin@demo.com / password123
- 👨‍⚕️ **Staff:** staff@demo.com / password123
- 👤 **Customer:** customer@demo.com / password123

## 🚀 **Features**

### 🎯 **For Customers**
- ✅ **Advanced Booking Wizard** - Step-by-step appointment booking
- ✅ **Real-time Availability** - Live time slot checking
- ✅ **Service Browsing** - Beautiful service catalog with details
- ✅ **Appointment Management** - View, reschedule, cancel appointments
- ✅ **Email Notifications** - Automatic confirmations and reminders
- ✅ **Mobile Responsive** - Perfect on all devices

### 👨‍⚕️ **For Staff**
- ✅ **Personal Dashboard** - Overview of daily schedule
- ✅ **Appointment Management** - Update status, add notes
- ✅ **Schedule Management** - Set working hours and holidays
- ✅ **Customer History** - View customer appointment history
- ✅ **Performance Reports** - Track your performance metrics

### 👑 **For Administrators**
- ✅ **Complete System Control** - Manage all aspects of the business
- ✅ **Service Management** - Create, edit, delete services
- ✅ **Staff Management** - Manage staff schedules and permissions
- ✅ **Advanced Analytics** - Revenue reports and business insights
- ✅ **Customer Management** - View and manage all customers
- ✅ **Role-based Access** - Secure permission system

## 🛠 **Technology Stack**

### **Frontend**
- ⚛️ **React.js** - Modern UI library
- 🎨 **Tailwind CSS** - Utility-first CSS framework
- 🔄 **React Query** - Data fetching and caching
- 📝 **React Hook Form** - Form management
- 📅 **React Calendar** - Date selection
- 🎯 **Heroicons** - Beautiful icons
- 📱 **Responsive Design** - Mobile-first approach

### **Backend**
- 🟢 **Node.js** - JavaScript runtime
- 🚀 **Express.js** - Web framework
- 🗄️ **MongoDB Atlas** - Cloud database
- 🔐 **JWT Authentication** - Secure token-based auth
- 📧 **Nodemailer** - Email notifications
- ⏰ **Node-cron** - Scheduled tasks
- 🛡️ **Security Middleware** - Rate limiting, CORS, Helmet

### **Database**
- 🍃 **MongoDB Atlas** - Cloud-hosted MongoDB
- 📊 **Mongoose ODM** - Object document mapping
- 🔍 **Indexed Queries** - Optimized performance
- 💾 **Automatic Backups** - Data protection

## 🎨 **Screenshots**

### Modern Dashboard
![Dashboard](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=Modern+Dashboard)

### Advanced Booking Wizard
![Booking](https://via.placeholder.com/800x400/059669/FFFFFF?text=Booking+Wizard)

### Admin Panel
![Admin](https://via.placeholder.com/800x400/DC2626/FFFFFF?text=Admin+Panel)

## 🚀 **Quick Start**

### **1. One-Click Deploy**
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/appointment-booking-system)

### **2. Local Development**

```bash
# Clone the repository
git clone https://github.com/yourusername/appointment-booking-system.git
cd appointment-booking-system

# Install dependencies
npm install
cd client && npm install && cd ..

# Set up environment variables
cp .env.example .env
# Edit .env with your MongoDB Atlas connection string

# Start development servers
npm run dev
```

**Access the application:**
- 🌐 **Frontend:** http://localhost:3000
- 🔧 **Backend:** http://localhost:5001

### **3. Environment Setup**

Create `.env` file with:
```env
NODE_ENV=development
PORT=5001
MONGODB_URI=mongodb+srv://admin:password@cluster.mongodb.net/appointment_booking
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:3000

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=noreply@yourapp.com
```

## 📱 **API Documentation**

### **Authentication**
```javascript
POST /api/auth/login
POST /api/auth/register
GET  /api/auth/me
```

### **Services**
```javascript
GET    /api/services
POST   /api/services          // Admin only
PUT    /api/services/:id      // Admin only
DELETE /api/services/:id      // Admin only
```

### **Appointments**
```javascript
GET    /api/appointments
POST   /api/appointments
PUT    /api/appointments/:id
DELETE /api/appointments/:id
GET    /api/appointments/available-slots
```

### **Reports**
```javascript
GET /api/reports/dashboard     // Admin/Staff only
GET /api/reports/appointments  // Admin/Staff only
GET /api/reports/revenue       // Admin only
```

## 🔒 **Security Features**

- 🔐 **JWT Authentication** - Secure token-based authentication
- 🛡️ **Password Hashing** - bcrypt encryption
- 🚦 **Rate Limiting** - Prevent brute force attacks
- ✅ **Input Validation** - Comprehensive data validation
- 🌐 **CORS Protection** - Cross-origin request security
- 🔒 **Security Headers** - Helmet.js protection
- 👥 **Role-based Access** - Granular permissions

## 📊 **Performance Features**

- ⚡ **Optimized Queries** - Indexed database operations
- 💾 **Data Caching** - React Query caching
- 📱 **Responsive Design** - Mobile-optimized
- 🔄 **Real-time Updates** - Live data synchronization
- 📈 **Scalable Architecture** - Cloud-ready deployment

## 🌐 **Deployment Options**

### **Vercel (Recommended)**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### **Railway**
1. Connect GitHub repository
2. Add MongoDB service
3. Set environment variables
4. Deploy automatically

### **Heroku**
```bash
# Create Heroku app
heroku create your-app-name

# Add MongoDB Atlas addon
heroku addons:create mongolab:sandbox

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret

# Deploy
git push heroku main
```

## 📧 **Email Configuration**

### **Gmail Setup**
1. Enable 2-Factor Authentication
2. Generate App Password
3. Use in `EMAIL_PASS` environment variable

### **Other Providers**
Update SMTP settings in environment variables for your email provider.

## 🧪 **Testing**

```bash
# Run backend tests
npm test

# Run frontend tests
cd client && npm test

# Test API endpoints
npm run test:api

# Test database connection
node test-mongodb.js
```

## 📈 **Analytics & Monitoring**

- 📊 **Built-in Reports** - Revenue, appointments, performance
- 📈 **Real-time Analytics** - Live business metrics
- 🔍 **Error Tracking** - Comprehensive logging
- 📱 **Performance Monitoring** - Speed and reliability tracking

## 🤝 **Contributing**

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 **Support**

- 📖 **Documentation:** Check the `/docs` folder
- 🐛 **Issues:** [GitHub Issues](https://github.com/yourusername/appointment-booking-system/issues)
- 💬 **Discussions:** [GitHub Discussions](https://github.com/yourusername/appointment-booking-system/discussions)
- 📧 **Email:** support@yourapp.com

## 🙏 **Acknowledgments**

- React.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- MongoDB Atlas for reliable cloud database
- Vercel for seamless deployment platform
- All open-source contributors

## 🎯 **Roadmap**

- [ ] **Mobile App** - React Native version
- [ ] **Payment Integration** - Stripe/PayPal support
- [ ] **Video Consultations** - Integrated video calls
- [ ] **Multi-language** - Internationalization support
- [ ] **Advanced Analytics** - AI-powered insights
- [ ] **API Webhooks** - Third-party integrations

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

**🚀 [Deploy Now](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/appointment-booking-system) | 📖 [Documentation](./docs) | 🐛 [Report Bug](https://github.com/yourusername/appointment-booking-system/issues)**

Made with ❤️ by [Your Name](https://github.com/yourusername)

</div>