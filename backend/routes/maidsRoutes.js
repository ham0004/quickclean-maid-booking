const express = require('express');
const router = express.Router();
const { getAllMaids, getMaidById } = require('../controllers/maidsController');

// GET /api/maids - Get all approved maids with pagination
router.get('/', getAllMaids);

// GET /api/maids/:id - Get single maid profile
router.get('/:id', getMaidById);

module.exports = router;
