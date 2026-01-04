const cron = require('node-cron');
const sgMail = require('@sendgrid/mail');
const EmailLog = require('../models/EmailLog');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Maximum retry attempts
const MAX_RETRIES = 5;
// Retry interval in minutes
const RETRY_INTERVAL_MINUTES = 15;

/**
 * Retry sending a failed email
 * @param {Object} emailLog - The email log document
 * @returns {Boolean} - Whether the email was sent successfully
 */
const retrySendEmail = async (emailLog) => {
    try {
        // Reconstruct the email message from stored data
        const msg = {
            to: emailLog.recipientEmail,
            from: {
                email: process.env.SENDGRID_FROM_EMAIL,
                name: 'QuickClean'
            },
            replyTo: process.env.SENDGRID_FROM_EMAIL,
            subject: emailLog.emailData?.subject || 'QuickClean Notification',
            html: emailLog.emailData?.html || '<p>This is a notification from QuickClean.</p>'
        };

        await sgMail.send(msg);

        // Update email log as sent
        emailLog.status = 'Sent';
        emailLog.sentAt = new Date();
        emailLog.errorMessage = null;
        await emailLog.save();

        console.log(`[Email Retry] Successfully sent email to ${emailLog.recipientEmail} (attempt ${emailLog.retryCount + 1})`);
        return true;

    } catch (error) {
        // Increment retry count
        emailLog.retryCount += 1;
        emailLog.errorMessage = error.message;

        if (emailLog.retryCount >= MAX_RETRIES) {
            // Mark as permanently failed
            emailLog.status = 'PermanentlyFailed';
            emailLog.nextRetryAt = null;
            console.error(`[Email Retry] Permanently failed for ${emailLog.recipientEmail} after ${MAX_RETRIES} attempts`);
        } else {
            // Schedule next retry
            emailLog.nextRetryAt = new Date(Date.now() + RETRY_INTERVAL_MINUTES * 60 * 1000);
            console.log(`[Email Retry] Failed for ${emailLog.recipientEmail}, will retry at ${emailLog.nextRetryAt}`);
        }

        await emailLog.save();
        return false;
    }
};

/**
 * Process all failed emails that are due for retry
 */
const processFailedEmails = async () => {
    try {
        const now = new Date();

        // Find all failed emails that are due for retry
        const failedEmails = await EmailLog.find({
            status: 'Failed',
            retryCount: { $lt: MAX_RETRIES },
            $or: [
                { nextRetryAt: { $lte: now } },
                { nextRetryAt: null }
            ]
        }).limit(50); // Process max 50 emails per batch

        if (failedEmails.length === 0) {
            return;
        }

        console.log(`[Email Retry Scheduler] Processing ${failedEmails.length} failed emails...`);

        for (const emailLog of failedEmails) {
            await retrySendEmail(emailLog);
            // Small delay between retries to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

    } catch (error) {
        console.error('[Email Retry Scheduler] Error processing failed emails:', error);
    }
};

/**
 * Start the email retry scheduler
 * Runs every 15 minutes
 */
const startEmailRetryScheduler = () => {
    // Run every 15 minutes
    cron.schedule('*/15 * * * *', () => {
        console.log('[Email Retry Scheduler] Running scheduled retry check...');
        processFailedEmails();
    });

    console.log('[Email Retry Scheduler] Started - will check for failed emails every 15 minutes');
};

/**
 * Log a failed email for retry
 * This function should be called when an email fails to send
 */
const logFailedEmailForRetry = async (userId, recipientEmail, emailType, emailData, errorMessage) => {
    try {
        const nextRetryAt = new Date(Date.now() + RETRY_INTERVAL_MINUTES * 60 * 1000);

        await EmailLog.create({
            userId,
            recipientEmail,
            emailType,
            status: 'Failed',
            retryCount: 0,
            maxRetries: MAX_RETRIES,
            nextRetryAt,
            errorMessage,
            emailData
        });

        console.log(`[Email Retry] Logged failed email for ${recipientEmail}, will retry at ${nextRetryAt}`);
    } catch (err) {
        console.error('[Email Retry] Failed to log email for retry:', err);
    }
};

module.exports = {
    startEmailRetryScheduler,
    processFailedEmails,
    logFailedEmailForRetry,
    retrySendEmail
};
