const mongoose = require('mongoose');
const { Schema } = mongoose;
const CommentSchema = require('./Comment').schema;

const PostSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String }, // Lưu URL ảnh
    locationID: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
    adminID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Chỉ Admin mới có thể tạo bài viết
    postDate: { type: Date, default: Date.now },
    rating: { type: Number, default: 0 },
    comments: [CommentSchema],
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);