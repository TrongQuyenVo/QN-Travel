const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    date: { type: Date, default: Date.now },
    // approved: { type: Boolean, default: false }, // Trạng thái duyệt của bình luận
});

module.exports = mongoose.model('Comment', CommentSchema);