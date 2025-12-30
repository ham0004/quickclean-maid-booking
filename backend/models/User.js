const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        match: [/^[0-9]{10,15}$/, 'Please enter a valid phone number']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false
    },
    role: {
        type: String,
        enum: ['customer', 'maid', 'admin'],
        default: 'customer'
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String,
        default: null
    },
    verificationTokenExpires: {
        type: Date,
        default: null
    },
    // Maid-specific fields
    verificationStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    profileImage: {
        type: String,
        default: null
    },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String
    },
    // Maid ID documents for verification
    documents: {
        idType: {
            type: String,
            enum: ['NID', 'Passport', 'Driving License']
        },
        idNumber: String,
        idDocumentUrl: String,
        uploadedAt: Date
    },
    // Admin notes for approval/rejection
    adminNotes: {
        type: String,
        default: null
    },
    // Maid-specific profile
    maidProfile: {
        experience: Number,
        skills: [String],
        bio: {
            type: String,
            maxlength: 500
        },
        availableServices: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ServiceCategory'
        }],
        hourlyRate: {
            type: Number,
            min: 0
        },
        availability: {
            monday: { available: Boolean, startTime: String, endTime: String },
            tuesday: { available: Boolean, startTime: String, endTime: String },
            wednesday: { available: Boolean, startTime: String, endTime: String },
            thursday: { available: Boolean, startTime: String, endTime: String },
            friday: { available: Boolean, startTime: String, endTime: String },
            saturday: { available: Boolean, startTime: String, endTime: String },
            sunday: { available: Boolean, startTime: String, endTime: String }
        },
        rating: {
            type: Number,
            default: 0
        },
        totalReviews: {
            type: Number,
            default: 0
        }
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    delete user.verificationToken;
    delete user.verificationTokenExpires;
    return user;
};

module.exports = mongoose.model('User', userSchema);
