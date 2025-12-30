const User = require('../models/User');

// @desc    Get all pending maids for approval
// @route   GET /api/admin/maids/pending
// @access  Private/Admin
const getPendingMaids = async (req, res) => {
    try {
        const maids = await User.find({
            role: 'maid',
            verificationStatus: 'pending'
        })
            .select('-password')
            .sort({ createdAt: 1 }) // Oldest first
            .populate('maidProfile.availableServices', 'name');

        res.status(200).json({
            success: true,
            count: maids.length,
            maids
        });

    } catch (error) {
        console.error('Get pending maids error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch pending maids',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Get all maids with filters
// @route   GET /api/admin/maids
// @access  Private/Admin
const getAllMaids = async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;

        const filter = { role: 'maid' };
        if (status) {
            filter.verificationStatus = status;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const maids = await User.find(filter)
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate('maidProfile.availableServices', 'name');

        const total = await User.countDocuments(filter);

        res.status(200).json({
            success: true,
            maids,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalMaids: total
            }
        });

    } catch (error) {
        console.error('Get all maids error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch maids',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Approve maid registration
// @route   PUT /api/admin/maids/:id/approve
// @access  Private/Admin
const approveMaid = async (req, res) => {
    try {
        const maid = await User.findById(req.params.id);

        if (!maid) {
            return res.status(404).json({
                success: false,
                message: 'Maid not found'
            });
        }

        if (maid.role !== 'maid') {
            return res.status(400).json({
                success: false,
                message: 'User is not a maid'
            });
        }

        if (maid.verificationStatus === 'approved') {
            return res.status(400).json({
                success: false,
                message: 'Maid is already approved'
            });
        }

        // Update maid status
        maid.verificationStatus = 'approved';
        maid.isVerified = true;
        maid.adminNotes = req.body.notes || 'Approved by admin';
        await maid.save();

        res.status(200).json({
            success: true,
            message: 'Maid approved successfully',
            maid: {
                id: maid._id,
                name: maid.name,
                email: maid.email,
                verificationStatus: maid.verificationStatus
            }
        });

    } catch (error) {
        console.error('Approve maid error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to approve maid',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Reject maid registration
// @route   PUT /api/admin/maids/:id/reject
// @access  Private/Admin
const rejectMaid = async (req, res) => {
    try {
        const { reason } = req.body;

        if (!reason) {
            return res.status(400).json({
                success: false,
                message: 'Rejection reason is required'
            });
        }

        const maid = await User.findById(req.params.id);

        if (!maid) {
            return res.status(404).json({
                success: false,
                message: 'Maid not found'
            });
        }

        if (maid.role !== 'maid') {
            return res.status(400).json({
                success: false,
                message: 'User is not a maid'
            });
        }

        // Update maid status
        maid.verificationStatus = 'rejected';
        maid.adminNotes = reason;
        await maid.save();

        res.status(200).json({
            success: true,
            message: 'Maid registration rejected',
            maid: {
                id: maid._id,
                name: maid.name,
                email: maid.email,
                verificationStatus: maid.verificationStatus
            }
        });

    } catch (error) {
        console.error('Reject maid error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to reject maid',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
    try {
        const [totalMaids, pendingMaids, approvedMaids, rejectedMaids, totalCustomers] = await Promise.all([
            User.countDocuments({ role: 'maid' }),
            User.countDocuments({ role: 'maid', verificationStatus: 'pending' }),
            User.countDocuments({ role: 'maid', verificationStatus: 'approved' }),
            User.countDocuments({ role: 'maid', verificationStatus: 'rejected' }),
            User.countDocuments({ role: 'customer' })
        ]);

        res.status(200).json({
            success: true,
            stats: {
                totalMaids,
                pendingMaids,
                approvedMaids,
                rejectedMaids,
                totalCustomers
            }
        });

    } catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard statistics',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = {
    getPendingMaids,
    getAllMaids,
    approveMaid,
    rejectMaid,
    getDashboardStats
};
