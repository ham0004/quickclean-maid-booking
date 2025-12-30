const ServiceCategory = require('../models/ServiceCategory');
const { validationResult } = require('express-validator');

// @desc    Create new service category
// @route   POST /api/admin/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { name, description, basePrice, priceUnit } = req.body;

        // Check if category already exists
        const existingCategory = await ServiceCategory.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
        if (existingCategory) {
            return res.status(400).json({
                success: false,
                message: 'A category with this name already exists'
            });
        }

        const category = await ServiceCategory.create({
            name,
            description,
            basePrice,
            priceUnit: priceUnit || 'per hour',
            createdBy: req.user._id
        });

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            category
        });

    } catch (error) {
        console.error('Create category error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create category',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Get all service categories
// @route   GET /api/admin/categories
// @access  Private/Admin (or Public for listing)
const getAllCategories = async (req, res) => {
    try {
        const { page = 1, limit = 20, active, search } = req.query;

        // Build filter
        const filter = {};
        if (active !== undefined) {
            filter.isActive = active === 'true';
        }
        if (search) {
            filter.name = { $regex: search, $options: 'i' };
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const categories = await ServiceCategory.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate('createdBy', 'name email');

        const total = await ServiceCategory.countDocuments(filter);

        res.status(200).json({
            success: true,
            categories,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalCategories: total,
                hasNextPage: skip + categories.length < total
            }
        });

    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch categories',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Get single category
// @route   GET /api/admin/categories/:id
// @access  Private/Admin
const getCategoryById = async (req, res) => {
    try {
        const category = await ServiceCategory.findById(req.params.id)
            .populate('createdBy', 'name email');

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        res.status(200).json({
            success: true,
            category
        });

    } catch (error) {
        console.error('Get category error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch category',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Update service category
// @route   PUT /api/admin/categories/:id
// @access  Private/Admin
const updateCategory = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: errors.array()
            });
        }

        const { name, description, basePrice, priceUnit, isActive } = req.body;

        let category = await ServiceCategory.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        // Check for duplicate name (excluding current category)
        if (name && name !== category.name) {
            const existingCategory = await ServiceCategory.findOne({
                name: { $regex: new RegExp(`^${name}$`, 'i') },
                _id: { $ne: req.params.id }
            });
            if (existingCategory) {
                return res.status(400).json({
                    success: false,
                    message: 'A category with this name already exists'
                });
            }
        }

        // Update fields
        if (name) category.name = name;
        if (description) category.description = description;
        if (basePrice !== undefined) category.basePrice = basePrice;
        if (priceUnit) category.priceUnit = priceUnit;
        if (isActive !== undefined) category.isActive = isActive;

        await category.save();

        res.status(200).json({
            success: true,
            message: 'Category updated successfully',
            category
        });

    } catch (error) {
        console.error('Update category error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update category',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Delete service category (soft delete)
// @route   DELETE /api/admin/categories/:id
// @access  Private/Admin
const deleteCategory = async (req, res) => {
    try {
        const category = await ServiceCategory.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        // Soft delete - set isActive to false
        category.isActive = false;
        await category.save();

        res.status(200).json({
            success: true,
            message: 'Category deleted successfully'
        });

    } catch (error) {
        console.error('Delete category error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete category',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
};
