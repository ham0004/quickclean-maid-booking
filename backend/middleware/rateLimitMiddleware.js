const rateLimit = require('express-rate-limit');

// Rate limiter for resend verification emails
// Max 3 requests per 15 minutes per IP
const resendVerificationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // Maximum 3 requests per window
    message: {
        success: false,
        message: 'Too many verification email requests. Please try again after 15 minutes.',
        retryAfter: 15
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    keyGenerator: (req) => {
        // Use combination of IP and email for more precise rate limiting
        return req.body.email ? `${req.ip}-${req.body.email}` : req.ip;
    }
});

// General API rate limiter (optional - for protecting all routes)
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Maximum 100 requests per window
    message: {
        success: false,
        message: 'Too many requests. Please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

module.exports = {
    resendVerificationLimiter,
    generalLimiter
};
