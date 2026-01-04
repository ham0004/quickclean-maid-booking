const sgMail = require('@sendgrid/mail');
const EmailLog = require('../models/EmailLog');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Helper function to log email
const logEmail = async (userId, recipientEmail, emailType, status, errorMessage = null) => {
  try {
    await EmailLog.create({
      userId,
      recipientEmail,
      emailType,
      status,
      errorMessage
    });
  } catch (err) {
    console.error('Failed to log email:', err);
  }
};

const sendVerificationEmail = async (email, name, verificationToken) => {
  const verificationUrl = `${process.env.FRONTEND_URL}/verify/${verificationToken}`;

  const msg = {
    to: email,
    from: {
      email: process.env.SENDGRID_FROM_EMAIL,
      name: 'QuickClean'
    },
    replyTo: process.env.SENDGRID_FROM_EMAIL,
    subject: 'Verify Your QuickClean Account',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f7fa;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <tr>
            <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🧹 QuickClean</h1>
              <p style="color: #e8e8ff; margin: 10px 0 0 0; font-size: 14px;">Professional Maid Booking Platform</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #333; margin: 0 0 20px 0;">Welcome, ${name}! 👋</h2>
              <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Thank you for registering with QuickClean. To complete your registration and start using our platform, please verify your email address by clicking the button below.
              </p>
              <div style="text-align: center; margin: 35px 0;">
                <a href="${verificationUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 30px; font-weight: bold; font-size: 16px; display: inline-block;">
                  Verify Email Address
                </a>
              </div>
              <p style="color: #999; font-size: 14px; line-height: 1.6; margin: 20px 0 0 0;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="color: #667eea; font-size: 14px; word-break: break-all;">
                <a href="${verificationUrl}" style="color: #667eea;">${verificationUrl}</a>
              </p>
              <p style="color: #999; font-size: 13px; margin-top: 30px;">
                This verification link will expire in 24 hours.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px; text-align: center; background-color: #f8f9fa; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 12px; margin: 0;">
                If you didn't create an account with QuickClean, please ignore this email.
              </p>
              <p style="color: #aaa; font-size: 11px; margin: 15px 0 0 0;">
                © 2024 QuickClean. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  };

  try {
    await sgMail.send(msg);
    console.log(`Verification email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('SendGrid Error:', error);
    if (error.response) {
      console.error('Error body:', error.response.body);
    }
    throw new Error('Failed to send verification email');
  }
};

const sendWelcomeEmail = async (email, name) => {
  const msg = {
    to: email,
    from: {
      email: process.env.SENDGRID_FROM_EMAIL,
      name: 'QuickClean'
    },
    replyTo: process.env.SENDGRID_FROM_EMAIL,
    subject: 'Welcome to QuickClean! 🎉',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f7fa;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <tr>
            <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🧹 QuickClean</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #333; margin: 0 0 20px 0;">Your Email is Verified! ✅</h2>
              <p style="color: #666; font-size: 16px; line-height: 1.6;">
                Hi ${name},<br><br>
                Congratulations! Your email has been successfully verified. You can now enjoy all the features of QuickClean.
              </p>
              <div style="text-align: center; margin: 35px 0;">
                <a href="${process.env.FRONTEND_URL}/login" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 30px; font-weight: bold; font-size: 16px; display: inline-block;">
                  Login Now
                </a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px; text-align: center; background-color: #f8f9fa; border-top: 1px solid #eee;">
              <p style="color: #aaa; font-size: 11px; margin: 0;">
                © 2024 QuickClean. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  };

  try {
    await sgMail.send(msg);
    console.log(`Welcome email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('SendGrid Error:', error);
    return false;
  }
};

// Send maid approval email
const sendMaidApprovalEmail = async (userId, email, name) => {
  const dashboardUrl = `${process.env.FRONTEND_URL}/dashboard`;

  const msg = {
    to: email,
    from: {
      email: process.env.SENDGRID_FROM_EMAIL,
      name: 'QuickClean'
    },
    replyTo: process.env.SENDGRID_FROM_EMAIL,
    subject: '🎉 Congratulations! Your Maid Profile is Approved!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f7fa;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <tr>
            <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🧹 QuickClean</h1>
              <p style="color: #d1fae5; margin: 10px 0 0 0; font-size: 14px;">Professional Maid Booking Platform</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <span style="font-size: 60px;">🎉</span>
              </div>
              <h2 style="color: #333; margin: 0 0 20px 0; text-align: center;">Congratulations, ${name}!</h2>
              <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Great news! Your maid profile has been <strong style="color: #10b981;">approved</strong> by our team. 
                You are now officially part of the QuickClean family! 🎊
              </p>
              <div style="background-color: #ecfdf5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0;">
                <p style="color: #065f46; margin: 0; font-size: 14px;">
                  <strong>What's next?</strong><br>
                  • Complete your availability schedule<br>
                  • Set up your service preferences<br>
                  • Start accepting booking requests!
                </p>
              </div>
              <div style="text-align: center; margin: 35px 0;">
                <a href="${dashboardUrl}" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 30px; font-weight: bold; font-size: 16px; display: inline-block;">
                  Go to Dashboard
                </a>
              </div>
              <p style="color: #999; font-size: 14px; text-align: center;">
                We're excited to have you on board! 🚀
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px; text-align: center; background-color: #f8f9fa; border-top: 1px solid #eee;">
              <p style="color: #aaa; font-size: 11px; margin: 0;">
                © 2024 QuickClean. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  };

  try {
    await sgMail.send(msg);
    await logEmail(userId, email, 'Approval', 'Sent');
    console.log(`Approval email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('SendGrid Error:', error);
    await logEmail(userId, email, 'Approval', 'Failed', error.message);
    return false;
  }
};

// Send maid rejection email
const sendMaidRejectionEmail = async (userId, email, name, reason) => {
  const msg = {
    to: email,
    from: {
      email: process.env.SENDGRID_FROM_EMAIL,
      name: 'QuickClean'
    },
    replyTo: process.env.SENDGRID_FROM_EMAIL,
    subject: 'Update on Your QuickClean Maid Application',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f7fa;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <tr>
            <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🧹 QuickClean</h1>
              <p style="color: #e8e8ff; margin: 10px 0 0 0; font-size: 14px;">Professional Maid Booking Platform</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #333; margin: 0 0 20px 0;">Hi ${name},</h2>
              <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Thank you for your interest in joining QuickClean as a service provider. 
                After careful review of your application, we regret to inform you that we are unable to approve your profile at this time.
              </p>
              <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0;">
                <p style="color: #991b1b; margin: 0 0 10px 0; font-size: 14px;"><strong>Reason:</strong></p>
                <p style="color: #7f1d1d; margin: 0; font-size: 14px;">${reason}</p>
              </div>
              <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 20px 0;">
                <strong>What can you do?</strong><br>
                You can update your profile and documents, then re-apply for verification. 
                If you believe this decision was made in error, please contact our support team.
              </p>
              <div style="text-align: center; margin: 35px 0;">
                <a href="${process.env.FRONTEND_URL}/register" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 30px; font-weight: bold; font-size: 16px; display: inline-block;">
                  Re-apply Now
                </a>
              </div>
              <p style="color: #999; font-size: 14px; text-align: center;">
                We appreciate your understanding and hope to welcome you to our platform soon.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px; text-align: center; background-color: #f8f9fa; border-top: 1px solid #eee;">
              <p style="color: #666; font-size: 12px; margin: 0 0 10px 0;">
                Need help? Contact us at support@quickclean.com
              </p>
              <p style="color: #aaa; font-size: 11px; margin: 0;">
                © 2024 QuickClean. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  };

  try {
    await sgMail.send(msg);
    await logEmail(userId, email, 'Rejection', 'Sent');
    console.log(`Rejection email sent to ${email}`);
    return true;
  } catch (error) {
    console.error('SendGrid Error:', error);
    await logEmail(userId, email, 'Rejection', 'Failed', error.message);
    return false;
  }
};

// Send booking confirmation email to customer
const sendBookingConfirmationEmail = async (booking, customer, maid) => {
  const dashboardUrl = `${process.env.FRONTEND_URL}/dashboard`;
  const bookingDate = new Date(booking.bookingDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const msg = {
    to: customer.email,
    from: {
      email: process.env.SENDGRID_FROM_EMAIL,
      name: 'QuickClean'
    },
    replyTo: process.env.SENDGRID_FROM_EMAIL,
    subject: '📅 Booking Confirmation - QuickClean',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f7fa;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <tr>
            <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🧹 QuickClean</h1>
              <p style="color: #e8e8ff; margin: 10px 0 0 0; font-size: 14px;">Booking Confirmation</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #333; margin: 0 0 20px 0;">Hi ${customer.name}! 👋</h2>
              <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Your booking request has been submitted successfully! The maid will confirm your booking shortly.
              </p>
              <div style="background-color: #f8f9fa; border-radius: 10px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #333; margin: 0 0 15px 0;">📋 Booking Details</h3>
                <table style="width: 100%; font-size: 14px;">
                  <tr><td style="color: #666; padding: 5px 0;"><strong>Booking ID:</strong></td><td style="color: #333;">${booking._id}</td></tr>
                  <tr><td style="color: #666; padding: 5px 0;"><strong>Maid:</strong></td><td style="color: #333;">${maid.name}</td></tr>
                  <tr><td style="color: #666; padding: 5px 0;"><strong>Service:</strong></td><td style="color: #333;">${booking.serviceId?.name || 'N/A'}</td></tr>
                  <tr><td style="color: #666; padding: 5px 0;"><strong>Date:</strong></td><td style="color: #333;">${bookingDate}</td></tr>
                  <tr><td style="color: #666; padding: 5px 0;"><strong>Time:</strong></td><td style="color: #333;">${booking.bookingTime}</td></tr>
                  <tr><td style="color: #666; padding: 5px 0;"><strong>Duration:</strong></td><td style="color: #333;">${booking.duration} hours</td></tr>
                  <tr><td style="color: #666; padding: 5px 0;"><strong>Total Price:</strong></td><td style="color: #10b981; font-weight: bold;">৳${booking.totalPrice}</td></tr>
                  <tr><td style="color: #666; padding: 5px 0;"><strong>Status:</strong></td><td style="color: #f59e0b; font-weight: bold;">⏳ Pending Confirmation</td></tr>
                </table>
              </div>
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
                <p style="color: #92400e; margin: 0; font-size: 14px;">
                  <strong>What's next?</strong><br>
                  The maid will review your request and confirm availability. You'll receive an email once confirmed.
                </p>
              </div>
              <div style="text-align: center; margin: 35px 0;">
                <a href="${dashboardUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 30px; font-weight: bold; font-size: 16px; display: inline-block;">
                  View My Bookings
                </a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px; text-align: center; background-color: #f8f9fa; border-top: 1px solid #eee;">
              <p style="color: #aaa; font-size: 11px; margin: 0;">
                © 2024 QuickClean. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  };

  try {
    await sgMail.send(msg);
    await logEmail(customer._id, customer.email, 'Booking', 'Sent');
    console.log(`Booking confirmation email sent to ${customer.email}`);
    return true;
  } catch (error) {
    console.error('SendGrid Error:', error);
    await logEmail(customer._id, customer.email, 'Booking', 'Failed', error.message);
    return false;
  }
};

// Send new booking alert email to maid
const sendNewBookingAlertEmail = async (booking, customer, maid) => {
  const dashboardUrl = `${process.env.FRONTEND_URL}/dashboard`;
  const bookingDate = new Date(booking.bookingDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const msg = {
    to: maid.email,
    from: {
      email: process.env.SENDGRID_FROM_EMAIL,
      name: 'QuickClean'
    },
    replyTo: process.env.SENDGRID_FROM_EMAIL,
    subject: '🔔 New Booking Request - QuickClean',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f7fa;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <tr>
            <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🧹 QuickClean</h1>
              <p style="color: #dbeafe; margin: 10px 0 0 0; font-size: 14px;">New Booking Request</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <span style="font-size: 50px;">🔔</span>
              </div>
              <h2 style="color: #333; margin: 0 0 20px 0; text-align: center;">New Booking Request!</h2>
              <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Hi ${maid.name}, you have received a new booking request. Please review and respond soon!
              </p>
              <div style="background-color: #f8f9fa; border-radius: 10px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #333; margin: 0 0 15px 0;">👤 Customer Details</h3>
                <table style="width: 100%; font-size: 14px;">
                  <tr><td style="color: #666; padding: 5px 0;"><strong>Name:</strong></td><td style="color: #333;">${customer.name}</td></tr>
                  <tr><td style="color: #666; padding: 5px 0;"><strong>Phone:</strong></td><td style="color: #333;">${customer.phone}</td></tr>
                </table>
              </div>
              <div style="background-color: #f8f9fa; border-radius: 10px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #333; margin: 0 0 15px 0;">📋 Booking Details</h3>
                <table style="width: 100%; font-size: 14px;">
                  <tr><td style="color: #666; padding: 5px 0;"><strong>Service:</strong></td><td style="color: #333;">${booking.serviceId?.name || 'N/A'}</td></tr>
                  <tr><td style="color: #666; padding: 5px 0;"><strong>Date:</strong></td><td style="color: #333;">${bookingDate}</td></tr>
                  <tr><td style="color: #666; padding: 5px 0;"><strong>Time:</strong></td><td style="color: #333;">${booking.bookingTime}</td></tr>
                  <tr><td style="color: #666; padding: 5px 0;"><strong>Duration:</strong></td><td style="color: #333;">${booking.duration} hours</td></tr>
                  <tr><td style="color: #666; padding: 5px 0;"><strong>Address:</strong></td><td style="color: #333;">${booking.address.street}, ${booking.address.city}</td></tr>
                  <tr><td style="color: #666; padding: 5px 0;"><strong>Your Earnings:</strong></td><td style="color: #10b981; font-weight: bold;">৳${booking.totalPrice}</td></tr>
                </table>
                ${booking.specialInstructions ? `
                <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #eee;">
                  <strong style="color: #666;">Special Instructions:</strong>
                  <p style="color: #333; margin: 5px 0 0 0;">${booking.specialInstructions}</p>
                </div>
                ` : ''}
              </div>
              <div style="text-align: center; margin: 35px 0;">
                <a href="${dashboardUrl}" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 30px; font-weight: bold; font-size: 14px; display: inline-block; margin: 5px;">
                  ✓ Accept
                </a>
                <a href="${dashboardUrl}" style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 30px; font-weight: bold; font-size: 14px; display: inline-block; margin: 5px;">
                  ✗ Reject
                </a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px; text-align: center; background-color: #f8f9fa; border-top: 1px solid #eee;">
              <p style="color: #aaa; font-size: 11px; margin: 0;">
                © 2024 QuickClean. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  };

  try {
    await sgMail.send(msg);
    await logEmail(maid._id, maid.email, 'Booking', 'Sent');
    console.log(`New booking alert email sent to ${maid.email}`);
    return true;
  } catch (error) {
    console.error('SendGrid Error:', error);
    await logEmail(maid._id, maid.email, 'Booking', 'Failed', error.message);
    return false;
  }
};

// Send booking accepted email to customer
const sendBookingAcceptedEmail = async (booking, customer, maid) => {
  const dashboardUrl = `${process.env.FRONTEND_URL}/dashboard`;
  const bookingDate = new Date(booking.bookingDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const msg = {
    to: customer.email,
    from: {
      email: process.env.SENDGRID_FROM_EMAIL,
      name: 'QuickClean'
    },
    replyTo: process.env.SENDGRID_FROM_EMAIL,
    subject: '✅ Booking Confirmed - QuickClean',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f7fa;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <tr>
            <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🧹 QuickClean</h1>
              <p style="color: #d1fae5; margin: 10px 0 0 0; font-size: 14px;">Booking Confirmed!</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <span style="font-size: 60px;">🎉</span>
              </div>
              <h2 style="color: #333; margin: 0 0 20px 0; text-align: center;">Great News, ${customer.name}!</h2>
              <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Your booking has been <strong style="color: #10b981;">confirmed</strong> by ${maid.name}! 
                Please prepare for the service on the scheduled date.
              </p>
              <div style="background-color: #ecfdf5; border-radius: 10px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #065f46; margin: 0 0 15px 0;">📋 Confirmed Booking</h3>
                <table style="width: 100%; font-size: 14px;">
                  <tr><td style="color: #047857; padding: 5px 0;"><strong>Maid:</strong></td><td style="color: #065f46;">${maid.name}</td></tr>
                  <tr><td style="color: #047857; padding: 5px 0;"><strong>Contact:</strong></td><td style="color: #065f46;">${maid.phone}</td></tr>
                  <tr><td style="color: #047857; padding: 5px 0;"><strong>Service:</strong></td><td style="color: #065f46;">${booking.serviceId?.name || 'N/A'}</td></tr>
                  <tr><td style="color: #047857; padding: 5px 0;"><strong>Date:</strong></td><td style="color: #065f46;">${bookingDate}</td></tr>
                  <tr><td style="color: #047857; padding: 5px 0;"><strong>Time:</strong></td><td style="color: #065f46;">${booking.bookingTime}</td></tr>
                  <tr><td style="color: #047857; padding: 5px 0;"><strong>Total:</strong></td><td style="color: #065f46; font-weight: bold;">৳${booking.totalPrice}</td></tr>
                </table>
              </div>
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0;">
                <p style="color: #92400e; margin: 0; font-size: 14px;">
                  <strong>Reminder:</strong> Please ensure someone is available at the address to receive the maid on the scheduled date and time.
                </p>
              </div>
              <div style="text-align: center; margin: 35px 0;">
                <a href="${dashboardUrl}" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 30px; font-weight: bold; font-size: 16px; display: inline-block;">
                  View Booking Details
                </a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px; text-align: center; background-color: #f8f9fa; border-top: 1px solid #eee;">
              <p style="color: #aaa; font-size: 11px; margin: 0;">
                © 2024 QuickClean. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  };

  try {
    await sgMail.send(msg);
    await logEmail(customer._id, customer.email, 'Booking', 'Sent');
    console.log(`Booking accepted email sent to ${customer.email}`);
    return true;
  } catch (error) {
    console.error('SendGrid Error:', error);
    await logEmail(customer._id, customer.email, 'Booking', 'Failed', error.message);
    return false;
  }
};

// Send booking rejected email to customer
const sendBookingRejectedEmail = async (booking, customer, maid, reason) => {
  const maidsUrl = `${process.env.FRONTEND_URL}/maids`;
  const bookingDate = new Date(booking.bookingDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const msg = {
    to: customer.email,
    from: {
      email: process.env.SENDGRID_FROM_EMAIL,
      name: 'QuickClean'
    },
    replyTo: process.env.SENDGRID_FROM_EMAIL,
    subject: 'Booking Update - QuickClean',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f7fa;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <tr>
            <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px;">🧹 QuickClean</h1>
              <p style="color: #e8e8ff; margin: 10px 0 0 0; font-size: 14px;">Booking Update</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #333; margin: 0 0 20px 0;">Hi ${customer.name},</h2>
              <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                We're sorry to inform you that your booking request for <strong>${bookingDate}</strong> 
                could not be accepted by the maid at this time.
              </p>
              ${reason ? `
              <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0;">
                <p style="color: #991b1b; margin: 0 0 5px 0; font-size: 14px;"><strong>Reason:</strong></p>
                <p style="color: #7f1d1d; margin: 0; font-size: 14px;">${reason}</p>
              </div>
              ` : ''}
              <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 20px 0;">
                Don't worry! There are many other talented maids available on QuickClean. 
                We encourage you to browse and book with another maid.
              </p>
              <div style="text-align: center; margin: 35px 0;">
                <a href="${maidsUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 15px 40px; border-radius: 30px; font-weight: bold; font-size: 16px; display: inline-block;">
                  Browse Other Maids
                </a>
              </div>
              <p style="color: #999; font-size: 14px; text-align: center;">
                We're here to help you find the perfect cleaning service!
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 30px; text-align: center; background-color: #f8f9fa; border-top: 1px solid #eee;">
              <p style="color: #aaa; font-size: 11px; margin: 0;">
                © 2024 QuickClean. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `
  };

  try {
    await sgMail.send(msg);
    await logEmail(customer._id, customer.email, 'Booking', 'Sent');
    console.log(`Booking rejected email sent to ${customer.email}`);
    return true;
  } catch (error) {
    console.error('SendGrid Error:', error);
    await logEmail(customer._id, customer.email, 'Booking', 'Failed', error.message);
    return false;
  }
};

module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendMaidApprovalEmail,
  sendMaidRejectionEmail,
  sendBookingConfirmationEmail,
  sendNewBookingAlertEmail,
  sendBookingAcceptedEmail,
  sendBookingRejectedEmail
};
