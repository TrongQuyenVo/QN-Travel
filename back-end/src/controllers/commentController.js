const Comment = require('../models/Comment');

// Thêm bình luận
exports.addComment = async (req, res) => {
    try {
        const { postID, content } = req.body;
        const newComment = new Comment({ userID: req.user.userId, postID, content });
        await newComment.save();

        res.status(201).json({ message: 'Bình luận đã được thêm', comment: newComment });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error });
    }
};

// Lấy bình luận theo bài viết
exports.getCommentsByPost = async (req, res) => {
    try {
        const comments = await Comment.find({ postID: req.params.postID }).populate('userID', 'userName');
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error });
    }
};

// Sửa bình luận (chỉ chủ sở hữu)
exports.updateComment = async (req, res) => {
    try {
        const { content } = req.body;
        const comment = await Comment.findById(req.params.id);

        if (!comment) return res.status(404).json({ message: 'Bình luận không tồn tại' });
        if (comment.userID.toString() !== req.user.userId) return res.status(403).json({ message: 'Bạn không thể chỉnh sửa bình luận này' });

        comment.content = content;
        await comment.save();

        res.json({ message: 'Bình luận đã được cập nhật', comment });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error });
    }
};

// Xóa bình luận (chỉ chủ sở hữu hoặc admin)
exports.deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) return res.status(404).json({ message: 'Bình luận không tồn tại' });
        if (comment.userID.toString() !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Bạn không thể xóa bình luận này' });
        }

        await Comment.findByIdAndDelete(req.params.id);
        res.json({ message: 'Bình luận đã bị xóa' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error });
    }
};
