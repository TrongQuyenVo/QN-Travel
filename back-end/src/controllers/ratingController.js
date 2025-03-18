const Rating = require('../models/Rating');

// Thêm đánh giá
exports.addRating = async (req, res) => {
    try {
        const { postID, score } = req.body;

        const newRating = new Rating({ userID: req.user.userId, postID, score });
        await newRating.save();

        res.status(201).json({ message: 'Đánh giá đã được thêm', rating: newRating });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error });
    }
};

// Lấy đánh giá theo bài viết
exports.getRatingsByPost = async (req, res) => {
    try {
        const ratings = await Rating.find({ postID: req.params.postID }).populate('userID', 'userName');
        res.json(ratings);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error });
    }
};

// Cập nhật đánh giá (chỉ chủ sở hữu)
exports.updateRating = async (req, res) => {
    try {
        const { score } = req.body;
        const rating = await Rating.findById(req.params.id);

        if (!rating) return res.status(404).json({ message: 'Đánh giá không tồn tại' });
        if (rating.userID.toString() !== req.user.userId) return res.status(403).json({ message: 'Bạn không thể chỉnh sửa đánh giá này' });

        rating.score = score;
        await rating.save();

        res.json({ message: 'Đánh giá đã được cập nhật', rating });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error });
    }
};

// Xóa đánh giá (chỉ chủ sở hữu hoặc admin)
exports.deleteRating = async (req, res) => {
    try {
        const rating = await Rating.findById(req.params.id);

        if (!rating) return res.status(404).json({ message: 'Đánh giá không tồn tại' });
        if (rating.userID.toString() !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Bạn không thể xóa đánh giá này' });
        }

        await Rating.findByIdAndDelete(req.params.id);
        res.json({ message: 'Đánh giá đã bị xóa' });
    } catch (error) {
        res.status(500).json({ message: 'Lỗi server', error });
    }
};
