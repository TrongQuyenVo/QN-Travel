const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true }, // Thêm hình ảnh
    featured: { type: Boolean, default: false }, // Thêm cờ đánh dấu địa điểm nổi bật
});

module.exports = mongoose.model('Location', LocationSchema);
