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
    uploadImage,
} = require('../controllers/postController');

const router = express.Router();

router.post('/', uploadImage, createPost);
router.get('/', getPosts);
router.get('/:id', getPostById);
router.put('/:id', uploadImage, updatePost);
router.delete('/:id', deletePost);
router.post('/:id/comments', addComment);
router.put('/:id/rating', updateRating);
router.put('/:postId/comments/:commentId/approve', approveComment);
router.get('/search', searchPostsByLocationName);

module.exports = router;