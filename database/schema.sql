-- Online Appointment Booking & Management System
-- Database Schema Documentation
-- This system uses MongoDB, but here's the equivalent SQL schema for reference

-- Users Table (Admin, Staff, Customer roles)
CREATE TABLE users (
    id VARCHAR(24) PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role ENUM('admin', 'staff', 'customer') DEFAULT 'customer',
    is_active BOOLEAN DEFAULT TRUE,
    profile_image VARCHAR(255),
    specialization VARCHAR(255), -- For staff members
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Staff Working Hours Table
CREATE TABLE staff_working_hours (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(24) NOT NULL,
    day_of_week ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'),
    start_time TIME,
    end_time TIME,
    is_working BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_day (user_id, day_of_week)
);

-- Staff Holidays Table
CREATE TABLE staff_holidays (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(24) NOT NULL,
    holiday_date DATE NOT NULL,
    reason VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Services Table
CREATE TABLE services (
    id VARCHAR(24) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    duration INT NOT NULL, -- in minutes
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Service Staff Members (Many-to-Many relationship)
CREATE TABLE service_staff (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_id VARCHAR(24) NOT NULL,
    staff_id VARCHAR(24) NOT NULL,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_service_staff (service_id, staff_id)
);

-- Appointments Table
CREATE TABLE appointments (
    id VARCHAR(24) PRIMARY KEY,
    customer_id VARCHAR(24) NOT NULL,
    staff_id VARCHAR(24) NOT NULL,
    service_id VARCHAR(24) NOT NULL,
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status ENUM('scheduled', 'confirmed', 'completed', 'cancelled', 'no-show') DEFAULT 'scheduled',
    notes TEXT,
    customer_notes TEXT,
    total_amount DECIMAL(10,2) NOT NULL,
    payment_status ENUM('pending', 'paid', 'refunded') DEFAULT 'pending',
    reminder_sent BOOLEAN DEFAULT FALSE,
    confirmation_sent BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
    INDEX idx_appointment_date_staff (appointment_date, staff_id),
    INDEX idx_customer_date (customer_id, appointment_date)
);

-- Indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_services_category ON services(category);
CREATE INDEX idx_services_active ON services(is_active);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);

-- Sample Data Insertion Queries

-- Insert Admin User
INSERT INTO users (id, first_name, last_name, email, password_hash, phone, role) VALUES
('admin_id_123', 'Admin', 'User', 'admin@demo.com', '$2a$10$hashed_password', '+1234567890', 'admin');

-- Insert Staff Users
INSERT INTO users (id, first_name, last_name, email, password_hash, phone, role, specialization) VALUES
('staff_id_123', 'Dr. Sarah', 'Johnson', 'staff@demo.com', '$2a$10$hashed_password', '+1234567891', 'staff', 'General Practitioner'),
('staff_id_124', 'Dr. Michael', 'Brown', 'michael@demo.com', '$2a$10$hashed_password', '+1234567892', 'staff', 'Dermatologist'),
('staff_id_125', 'Lisa', 'Davis', 'lisa@demo.com', '$2a$10$hashed_password', '+1234567893', 'staff', 'Hair Stylist');

-- Insert Customer Users
INSERT INTO users (id, first_name, last_name, email, password_hash, phone, role) VALUES
('customer_id_123', 'John', 'Doe', 'customer@demo.com', '$2a$10$hashed_password', '+1234567894', 'customer'),
('customer_id_124', 'Jane', 'Smith', 'jane@demo.com', '$2a$10$hashed_password', '+1234567895', 'customer');

-- Insert Working Hours for Staff
INSERT INTO staff_working_hours (user_id, day_of_week, start_time, end_time, is_working) VALUES
('staff_id_123', 'monday', '09:00:00', '17:00:00', TRUE),
('staff_id_123', 'tuesday', '09:00:00', '17:00:00', TRUE),
('staff_id_123', 'wednesday', '09:00:00', '17:00:00', TRUE),
('staff_id_123', 'thursday', '09:00:00', '17:00:00', TRUE),
('staff_id_123', 'friday', '09:00:00', '17:00:00', TRUE),
('staff_id_123', 'saturday', '09:00:00', '13:00:00', TRUE),
('staff_id_123', 'sunday', NULL, NULL, FALSE);

-- Insert Services
INSERT INTO services (id, name, description, duration, price, category) VALUES
('service_id_123', 'General Consultation', 'General health consultation and checkup', 30, 75.00, 'Medical'),
('service_id_124', 'Skin Examination', 'Comprehensive skin examination and treatment', 45, 120.00, 'Medical'),
('service_id_125', 'Haircut & Style', 'Professional haircut and styling service', 60, 45.00, 'Beauty');

-- Link Services to Staff
INSERT INTO service_staff (service_id, staff_id) VALUES
('service_id_123', 'staff_id_123'),
('service_id_124', 'staff_id_124'),
('service_id_125', 'staff_id_125');

-- Insert Sample Appointments
INSERT INTO appointments (id, customer_id, staff_id, service_id, appointment_date, start_time, end_time, status, total_amount) VALUES
('appointment_id_123', 'customer_id_123', 'staff_id_123', 'service_id_123', '2024-01-15', '10:00:00', '10:30:00', 'scheduled', 75.00),
('appointment_id_124', 'customer_id_124', 'staff_id_124', 'service_id_124', '2024-01-15', '14:00:00', '14:45:00', 'confirmed', 120.00);

-- Useful Queries for Reports

-- Daily Appointments Report
SELECT 
    a.appointment_date,
    COUNT(*) as total_appointments,
    SUM(CASE WHEN a.status = 'completed' THEN a.total_amount ELSE 0 END) as daily_revenue,
    COUNT(CASE WHEN a.status = 'scheduled' THEN 1 END) as scheduled,
    COUNT(CASE WHEN a.status = 'confirmed' THEN 1 END) as confirmed,
    COUNT(CASE WHEN a.status = 'completed' THEN 1 END) as completed,
    COUNT(CASE WHEN a.status = 'cancelled' THEN 1 END) as cancelled
FROM appointments a
WHERE a.appointment_date BETWEEN '2024-01-01' AND '2024-01-31'
GROUP BY a.appointment_date
ORDER BY a.appointment_date;

-- Staff Performance Report
SELECT 
    CONCAT(u.first_name, ' ', u.last_name) as staff_name,
    COUNT(*) as total_appointments,
    SUM(CASE WHEN a.status = 'completed' THEN a.total_amount ELSE 0 END) as revenue,
    AVG(CASE WHEN a.status = 'completed' THEN a.total_amount ELSE NULL END) as avg_appointment_value
FROM appointments a
JOIN users u ON a.staff_id = u.id
WHERE a.appointment_date BETWEEN '2024-01-01' AND '2024-01-31'
    AND u.role = 'staff'
GROUP BY a.staff_id, u.first_name, u.last_name
ORDER BY revenue DESC;

-- Service Popularity Report
SELECT 
    s.name as service_name,
    s.category,
    COUNT(*) as bookings,
    SUM(CASE WHEN a.status = 'completed' THEN a.total_amount ELSE 0 END) as revenue,
    s.price as service_price
FROM appointments a
JOIN services s ON a.service_id = s.id
WHERE a.appointment_date BETWEEN '2024-01-01' AND '2024-01-31'
GROUP BY a.service_id, s.name, s.category, s.price
ORDER BY bookings DESC;

-- Customer Appointment History
SELECT 
    CONCAT(u.first_name, ' ', u.last_name) as customer_name,
    s.name as service_name,
    CONCAT(staff.first_name, ' ', staff.last_name) as staff_name,
    a.appointment_date,
    a.start_time,
    a.status,
    a.total_amount
FROM appointments a
JOIN users u ON a.customer_id = u.id
JOIN services s ON a.service_id = s.id
JOIN users staff ON a.staff_id = staff.id
WHERE u.id = 'customer_id_123'
ORDER BY a.appointment_date DESC, a.start_time DESC;