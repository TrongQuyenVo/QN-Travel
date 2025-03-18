const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const { addComment, getCommentsByPost, updateComment, deleteComment } = require('../controllers/commentController');

const router = express.Router();

router.post('/', authMiddleware, addComment);
router.get('/:postID', getCommentsByPost);
router.put('/:id', authMiddleware, updateComment);
router.delete('/:id', authMiddleware, deleteComment);

module.exports = router;
