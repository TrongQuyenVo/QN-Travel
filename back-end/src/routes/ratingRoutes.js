const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const { addRating, getRatingsByPost, updateRating, deleteRating } = require('../controllers/ratingController');

const router = express.Router();

router.post('/', authMiddleware, addRating);
router.get('/:postID', getRatingsByPost);
router.put('/:id', authMiddleware, updateRating);
router.delete('/:id', authMiddleware, deleteRating);

module.exports = router;
