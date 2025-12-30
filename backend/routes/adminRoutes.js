const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    getPendingMaids,
    getAllMaids,
    approveMaid,
    rejectMaid,
    getDashboardStats
} = require('../controllers/adminController');

// All routes require admin authentication
router.use(protect);
router.use(authorize('admin'));

// GET /api/admin/stats - Get dashboard statistics
router.get('/stats', getDashboardStats);

// GET /api/admin/maids - Get all maids with filters
router.get('/maids', getAllMaids);

// GET /api/admin/maids/pending - Get pending maids
router.get('/maids/pending', getPendingMaids);

// PUT /api/admin/maids/:id/approve - Approve maid
router.put('/maids/:id/approve', approveMaid);

// PUT /api/admin/maids/:id/reject - Reject maid
router.put('/maids/:id/reject', rejectMaid);

module.exports = router;
