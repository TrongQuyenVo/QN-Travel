const express = require('express');
const {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost,
    addComment,
    updateRating,
    approveComment,
    searchPostsByLocationName,
} = require('../controllers/postController');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, adminMiddleware, createPost);
router.get('/', getPosts);
router.get('/:id', getPostById);
router.put('/:id', authMiddleware, adminMiddleware, updatePost);
router.delete('/:id', authMiddleware, adminMiddleware, deletePost);
router.post('/:id/comments', authMiddleware, addComment);
router.put('/:id/rating', authMiddleware, updateRating);
router.put('/:postId/comments/:commentId/approve', authMiddleware, adminMiddleware, approveComment);
router.get('/search', searchPostsByLocationName);

module.exports = router;