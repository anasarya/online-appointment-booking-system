# Online Appointment Booking & Management System

A complete appointment booking and management system built with React.js, Node.js, Express, and MongoDB. Perfect for service-based businesses like clinics, salons, consultants, and more.

## 🚀 Features

### User Management
- **Multi-role authentication** (Admin, Staff, Customer)
- **Secure login/registration** with JWT tokens
- **Role-based access control** with protected routes
- **User profile management** with customizable settings

### Appointment Management
- **Real-time appointment booking** with conflict prevention
- **Available time slot detection** based on staff schedules
- **Appointment confirmation, rescheduling, and cancellation**
- **Automated email notifications** for bookings and reminders
- **Appointment history and status tracking**

### Admin Dashboard
- **Service management** (create, edit, delete services)
- **Staff schedule management** with working hours and holidays
- **Customer management** and appointment oversight
- **Comprehensive reporting** with daily, weekly, and monthly views
- **Revenue tracking** and performance analytics

### Staff Features
- **Personal schedule management**
- **Appointment calendar view**
- **Customer notes and appointment details**
- **Working hours and holiday management**

### Customer Features
- **Easy online booking interface**
- **Service browsing with detailed descriptions**
- **Appointment history and management**
- **Email confirmations and reminders**

## 🛠 Technology Stack

### Backend
- **Node.js** with Express.js framework
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Nodemailer** for email notifications
- **Node-cron** for scheduled tasks
- **Express-validator** for input validation

### Frontend
- **React.js** with functional components and hooks
- **React Router** for navigation
- **React Query** for data fetching and caching
- **React Hook Form** for form management
- **Tailwind CSS** for styling
- **Headless UI** for accessible components
- **React Calendar** for date selection
- **React Toastify** for notifications

### Security Features
- **Helmet.js** for security headers
- **Rate limiting** to prevent abuse
- **CORS** configuration
- **Input validation and sanitization**
- **Password hashing** with bcrypt
- **JWT token expiration** and refresh

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn** package manager

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd appointment-booking-system
```

### 2. Install Backend Dependencies
```bash
npm install
```

### 3. Install Frontend Dependencies
```bash
cd client
npm install
cd ..
```

### 4. Environment Configuration
Create a `.env` file in the root directory with the following variables:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/appointment_booking
JWT_SECRET=your_jwt_secret_key_here_change_in_production
JWT_EXPIRE=30d

# Email Configuration (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=noreply@appointmentbooking.com

# Frontend URL
CLIENT_URL=http://localhost:3000
```

### 5. Database Setup

#### Start MongoDB
Make sure MongoDB is running on your system:
```bash
# On Windows (if MongoDB is installed as a service)
net start MongoDB

# On macOS with Homebrew
brew services start mongodb-community

# On Linux
sudo systemctl start mongod
```

#### Seed the Database
Run the database seeder to create sample data:
```bash
node scripts/seedDatabase.js
```

This will create:
- Admin user: `admin@demo.com` / `password123`
- Staff users: `staff@demo.com` / `password123`
- Customer users: `customer@demo.com` / `password123`
- Sample services and appointments

### 6. Configure Email (Optional)
For email notifications to work, you need to configure SMTP settings:

#### Gmail Setup:
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password: Google Account → Security → App passwords
3. Use the app password in the `EMAIL_PASS` environment variable

#### Other Email Providers:
Update the `EMAIL_HOST`, `EMAIL_PORT`, and authentication settings accordingly.

## 🏃‍♂️ Running the Application

### Development Mode
Run both backend and frontend concurrently:
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend development server on `http://localhost:3000`

### Production Mode
```bash
# Build the frontend
npm run build

# Start the production server
npm start
```

## 📱 Usage

### Demo Accounts
Use these accounts to test different user roles:

**Admin Account:**
- Email: `admin@demo.com`
- Password: `password123`
- Access: Full system management

**Staff Account:**
- Email: `staff@demo.com`
- Password: `password123`
- Access: Appointment management, schedule management

**Customer Account:**
- Email: `customer@demo.com`
- Password: `password123`
- Access: Book appointments, view history

### Key Workflows

#### For Customers:
1. Register/Login to the system
2. Browse available services
3. Select service, staff, date, and time
4. Book appointment and receive confirmation
5. Manage appointments from dashboard

#### For Staff:
1. Login with staff credentials
2. View daily/weekly schedule
3. Manage working hours and holidays
4. Update appointment status and notes
5. View performance reports

#### For Admins:
1. Login with admin credentials
2. Manage services (add/edit/delete)
3. Manage staff accounts and schedules
4. View comprehensive reports
5. Monitor system activity

## 🗂 Project Structure

```
appointment-booking-system/
├── client/                     # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── Auth/          # Authentication components
│   │   │   ├── Dashboard/     # Dashboard components
│   │   │   ├── Booking/       # Booking components
│   │   │   ├── Admin/         # Admin components
│   │   │   └── Layout/        # Layout components
│   │   ├── contexts/          # React contexts
│   │   └── utils/             # Utility functions
│   └── package.json
├── models/                     # MongoDB models
│   ├── User.js
│   ├── Service.js
│   └── Appointment.js
├── routes/                     # Express routes
│   ├── auth.js
│   ├── users.js
│   ├── services.js
│   ├── appointments.js
│   ├── staff.js
│   └── reports.js
├── middleware/                 # Express middleware
│   └── auth.js
├── utils/                      # Utility functions
│   ├── email.js
│   └── scheduler.js
├── scripts/                    # Database scripts
│   └── seedDatabase.js
├── database/                   # Database documentation
│   └── schema.sql
├── server.js                   # Express server
├── package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users (Admin)
- `GET /api/users/staff` - Get staff members
- `PUT /api/users/:id` - Update user profile
- `PUT /api/users/:id/working-hours` - Update staff working hours

### Services
- `GET /api/services` - Get all services
- `POST /api/services` - Create service (Admin)
- `PUT /api/services/:id` - Update service (Admin)
- `DELETE /api/services/:id` - Delete service (Admin)

### Appointments
- `GET /api/appointments` - Get appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment
- `GET /api/appointments/available-slots` - Get available time slots

### Reports
- `GET /api/reports/dashboard` - Dashboard statistics
- `GET /api/reports/appointments` - Appointment reports
- `GET /api/reports/revenue` - Revenue reports (Admin)

## 🔒 Security Features

- **JWT Authentication** with secure token handling
- **Password Hashing** using bcrypt
- **Rate Limiting** to prevent brute force attacks
- **Input Validation** on all endpoints
- **CORS Configuration** for cross-origin requests
- **Security Headers** with Helmet.js
- **Role-based Access Control** for protected resources

## 📧 Email Notifications

The system automatically sends:
- **Appointment confirmations** when bookings are made
- **Reminder emails** 24 hours before appointments
- **Cancellation notifications** when appointments are cancelled

## 📊 Reporting Features

### Dashboard Analytics
- Today's appointment count
- Weekly appointment summary
- Monthly revenue tracking
- Recent appointment activity

### Detailed Reports
- Appointment reports by date range
- Revenue analysis by staff and service
- Service popularity metrics
- Customer appointment history

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://your-production-db-url
JWT_SECRET=your-secure-jwt-secret
# ... other production configurations
```

### Deployment Platforms
This application can be deployed on:
- **Heroku** (with MongoDB Atlas)
- **DigitalOcean** App Platform
- **AWS** Elastic Beanstalk
- **Vercel** (frontend) + **Railway** (backend)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) section
2. Create a new issue with detailed information
3. Include error messages and steps to reproduce

## 🙏 Acknowledgments

- React.js team for the amazing frontend framework
- Express.js for the robust backend framework
- MongoDB for the flexible database solution
- Tailwind CSS for the utility-first CSS framework
- All open-source contributors who made this project possible

---

**Happy Booking! 📅✨**