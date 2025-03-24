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
    uploadImages,
    getPostsByCategory,
} = require('../controllers/postController');

const router = express.Router();

// Các route hiện có
router.post('/', uploadImages, createPost);
router.get('/', getPosts);
router.get('/:id', getPostById);
router.put('/:id', uploadImages, updatePost);
router.delete('/:id', deletePost);
router.post('/:id/comments', addComment);
router.put('/:id/rating', updateRating);
router.put('/:postId/comments/:commentId/approve', approveComment);
router.get('/search/location', searchPostsByLocationName);

// Các route mới cho danh mục, ẩm thực và sự kiện
router.get('/category/:category', getPostsByCategory);

module.exports = router;