const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
} = require('../controllers/categoryController');

// Validation rules
const categoryValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Category name is required')
        .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
    body('basePrice')
        .notEmpty().withMessage('Base price is required')
        .isFloat({ min: 0 }).withMessage('Base price must be a positive number'),
    body('priceUnit')
        .optional()
        .isIn(['per hour', 'per visit', 'per square foot'])
        .withMessage('Invalid price unit')
];

const updateValidation = [
    body('name')
        .optional()
        .trim()
        .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
    body('basePrice')
        .optional()
        .isFloat({ min: 0 }).withMessage('Base price must be a positive number'),
    body('priceUnit')
        .optional()
        .isIn(['per hour', 'per visit', 'per square foot'])
        .withMessage('Invalid price unit'),
    body('isActive')
        .optional()
        .isBoolean().withMessage('isActive must be a boolean')
];

// All routes require admin authentication
router.use(protect);
router.use(authorize('admin'));

// Routes
// GET /api/admin/categories - Get all categories with pagination
router.get('/', getAllCategories);

// GET /api/admin/categories/:id - Get single category
router.get('/:id', getCategoryById);

// POST /api/admin/categories - Create new category
router.post('/', categoryValidation, createCategory);

// PUT /api/admin/categories/:id - Update category
router.put('/:id', updateValidation, updateCategory);

// DELETE /api/admin/categories/:id - Soft delete category
router.delete('/:id', deleteCategory);

module.exports = router;
