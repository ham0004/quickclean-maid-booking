const User = require('../models/User');
const { generateToken, generateVerificationToken } = require('../services/jwtService');
const { sendVerificationEmail } = require('../services/emailService');
const { validationResult } = require('express-validator');

// @desc    Register new maid with profile and document upload
// @route   POST /api/auth/register-maid
// @access  Public
const registerMaid = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const {
            name,
            email,
            phone,
            password,
            experience,
            skills,
            bio,
            hourlyRate,
            idType,
            idNumber
        } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Check if file was uploaded
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'ID document is required for maid registration'
            });
        }

        // Generate verification token
        const verificationToken = generateVerificationToken();
        const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

        // Parse skills if it's a string
        let parsedSkills = skills;
        if (typeof skills === 'string') {
            try {
                parsedSkills = JSON.parse(skills);
            } catch {
                parsedSkills = skills.split(',').map(s => s.trim());
            }
        }

        // Create maid user
        const user = await User.create({
            name,
            email,
            phone,
            password,
            role: 'maid',
            verificationToken,
            verificationTokenExpires,
            verificationStatus: 'pending',
            maidProfile: {
                experience: parseInt(experience) || 0,
                skills: parsedSkills || [],
                bio: bio || '',
                hourlyRate: parseFloat(hourlyRate) || 0
            },
            documents: {
                idType: idType,
                idNumber: idNumber,
                idDocumentUrl: `/uploads/documents/${req.file.filename}`,
                uploadedAt: new Date()
            }
        });

        // Send verification email
        try {
            await sendVerificationEmail(email, name, verificationToken);
        } catch (emailError) {
            console.error('Failed to send verification email:', emailError);
        }

        res.status(201).json({
            success: true,
            message: 'Maid registration successful! Please check your email to verify your account. Your profile will be reviewed by an admin.',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                verificationStatus: user.verificationStatus,
                isVerified: user.isVerified
            }
        });

    } catch (error) {
        console.error('Maid registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Registration failed. Please try again.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Update maid profile
// @route   PUT /api/maid/profile
// @access  Private (Maid only)
const updateMaidProfile = async (req, res) => {
    try {
        const { experience, skills, bio, hourlyRate } = req.body;

        const user = await User.findById(req.user._id);

        if (!user || user.role !== 'maid') {
            return res.status(403).json({
                success: false,
                message: 'Only maids can update their profile'
            });
        }

        // Update maid profile fields
        if (experience !== undefined) user.maidProfile.experience = experience;
        if (skills !== undefined) user.maidProfile.skills = skills;
        if (bio !== undefined) user.maidProfile.bio = bio;
        if (hourlyRate !== undefined) user.maidProfile.hourlyRate = hourlyRate;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user
        });

    } catch (error) {
        console.error('Update maid profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update profile',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = {
    registerMaid,
    updateMaidProfile
};
