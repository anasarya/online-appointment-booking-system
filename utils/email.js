const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Email templates
const templates = {
  appointmentConfirmation: (data) => ({
    subject: 'Appointment Confirmation',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Appointment Confirmed</h2>
        <p>Dear ${data.customerName},</p>
        <p>Your appointment has been confirmed with the following details:</p>
        
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Service:</strong> ${data.serviceName}</p>
          <p><strong>Staff:</strong> ${data.staffName}</p>
          <p><strong>Date:</strong> ${data.appointmentDate}</p>
          <p><strong>Time:</strong> ${data.startTime} - ${data.endTime}</p>
        </div>
        
        <p>Please arrive 10 minutes before your scheduled time.</p>
        <p>If you need to reschedule or cancel, please contact us at least 24 hours in advance.</p>
        
        <p>Thank you for choosing our services!</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      </div>
    `
  }),

  appointmentReminder: (data) => ({
    subject: 'Appointment Reminder - Tomorrow',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #f59e0b;">Appointment Reminder</h2>
        <p>Dear ${data.customerName},</p>
        <p>This is a friendly reminder about your upcoming appointment:</p>
        
        <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Service:</strong> ${data.serviceName}</p>
          <p><strong>Staff:</strong> ${data.staffName}</p>
          <p><strong>Date:</strong> ${data.appointmentDate}</p>
          <p><strong>Time:</strong> ${data.startTime} - ${data.endTime}</p>
        </div>
        
        <p>Please arrive 10 minutes before your scheduled time.</p>
        <p>If you need to reschedule or cancel, please contact us as soon as possible.</p>
        
        <p>We look forward to seeing you!</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      </div>
    `
  }),

  appointmentCancellation: (data) => ({
    subject: 'Appointment Cancelled',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Appointment Cancelled</h2>
        <p>Dear ${data.customerName},</p>
        <p>Your appointment has been cancelled:</p>
        
        <div style="background-color: #fee2e2; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Service:</strong> ${data.serviceName}</p>
          <p><strong>Staff:</strong> ${data.staffName}</p>
          <p><strong>Date:</strong> ${data.appointmentDate}</p>
          <p><strong>Time:</strong> ${data.startTime} - ${data.endTime}</p>
        </div>
        
        <p>If you would like to reschedule, please contact us or book a new appointment online.</p>
        
        <p>Thank you for your understanding.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      </div>
    `
  })
};

// Send email function
const sendEmail = async ({ to, subject, template, data }) => {
  try {
    const transporter = createTransporter();
    
    let emailContent;
    if (template && templates[template]) {
      emailContent = templates[template](data);
    } else {
      emailContent = { subject, html: data.html || data.text };
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject: emailContent.subject,
      html: emailContent.html
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return result;
  } catch (error) {
    console.error('Email sending failed:', error);
    throw error;
  }
};

module.exports = { sendEmail };