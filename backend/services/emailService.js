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

module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendMaidApprovalEmail,
  sendMaidRejectionEmail
};

