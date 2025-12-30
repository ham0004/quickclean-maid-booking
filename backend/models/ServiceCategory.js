const mongoose = require('mongoose');

const serviceCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        unique: true,
        trim: true,
        maxlength: [100, 'Category name cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Category description is required'],
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    basePrice: {
        type: Number,
        required: [true, 'Base price is required'],
        min: [0, 'Base price cannot be negative']
    },
    priceUnit: {
        type: String,
        enum: ['per hour', 'per visit', 'per square foot'],
        default: 'per hour'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// Index for faster queries
serviceCategorySchema.index({ name: 1 });
serviceCategorySchema.index({ isActive: 1 });

module.exports = mongoose.model('ServiceCategory', serviceCategorySchema);
