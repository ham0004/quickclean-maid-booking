const User = require('../models/User');

// @desc    Get all approved maids with pagination
// @route   GET /api/maids
// @access  Public
const getAllMaids = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        // Query for approved, verified maids
        const query = {
            role: 'maid',
            verificationStatus: 'approved',
            isVerified: true
        };

        // Get total count for pagination
        const totalMaids = await User.countDocuments(query);

        // Fetch maids with populated services
        const maids = await User.find(query)
            .select('name email phone profileImage maidProfile')
            .populate({
                path: 'maidProfile.availableServices',
                select: 'name description basePrice priceUnit'
            })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        // Format response data
        const formattedMaids = maids.map(maid => ({
            _id: maid._id,
            name: maid.name,
            profileImage: maid.profileImage || '/images/default-profile.png',
            experience: maid.maidProfile?.experience || 0,
            bio: maid.maidProfile?.bio || '',
            skills: maid.maidProfile?.skills || [],
            availableServices: maid.maidProfile?.availableServices || [],
            hourlyRate: maid.maidProfile?.hourlyRate || 0,
            rating: maid.maidProfile?.rating || 0,
            totalReviews: maid.maidProfile?.totalReviews || 0
        }));

        const totalPages = Math.ceil(totalMaids / limit);

        res.status(200).json({
            success: true,
            maids: formattedMaids,
            pagination: {
                totalMaids,
                currentPage: page,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
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

// @desc    Get single maid profile
// @route   GET /api/maids/:id
// @access  Public
const getMaidById = async (req, res) => {
    try {
        const maid = await User.findOne({
            _id: req.params.id,
            role: 'maid',
            verificationStatus: 'approved',
            isVerified: true
        })
            .select('name email phone profileImage maidProfile createdAt')
            .populate({
                path: 'maidProfile.availableServices',
                select: 'name description basePrice priceUnit'
            });

        if (!maid) {
            return res.status(404).json({
                success: false,
                message: 'Maid not found or not approved'
            });
        }

        res.status(200).json({
            success: true,
            maid: {
                _id: maid._id,
                name: maid.name,
                email: maid.email,
                phone: maid.phone,
                profileImage: maid.profileImage || '/images/default-profile.png',
                experience: maid.maidProfile?.experience || 0,
                bio: maid.maidProfile?.bio || '',
                skills: maid.maidProfile?.skills || [],
                availableServices: maid.maidProfile?.availableServices || [],
                hourlyRate: maid.maidProfile?.hourlyRate || 0,
                rating: maid.maidProfile?.rating || 0,
                totalReviews: maid.maidProfile?.totalReviews || 0,
                availability: maid.maidProfile?.availability || {},
                memberSince: maid.createdAt
            }
        });

    } catch (error) {
        console.error('Get maid by ID error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch maid profile',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = {
    getAllMaids,
    getMaidById
};
