const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const { authenticate } = require('../middleware/auth');

// Basic search route - accessible without authentication
router.get('/', searchController.search);

// Advanced search with filters - requires authentication
router.post('/advanced', authenticate, searchController.advancedSearch);

module.exports = router;
