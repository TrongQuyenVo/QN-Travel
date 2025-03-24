const Location = require('../models/Location');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Tạo thư mục lưu ảnh nếu chưa tồn tại
const uploadDir = path.join(__dirname, '../Locations');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'Locations/'); // Lưu file vào thư mục /Locations
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Đổi tên file để tránh trùng
    }
});

const upload = multer({ storage: storage });

exports.upload = upload;

// Tạo địa điểm mới (có hỗ trợ upload ảnh)
exports.createLocation = async (req, res) => {
    try {
        const { name, featured } = req.body;
        const image = req.file ? `/Locations/${req.file.filename}` : null; // Lưu đường dẫn file

        const newLocation = new Location({ name, image, featured: featured === 'true' });
        await newLocation.save();
        res.status(201).json(newLocation);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi tạo địa điểm mới', details: error.message });
    }
};

// Lấy danh sách địa điểm
exports.getLocations = async (req, res) => {
    try {
        const locations = await Location.find();
        res.status(200).json(locations);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi lấy danh sách địa điểm', details: error.message });
    }
};

// Lấy danh sách địa điểm nổi bật
exports.getFeaturedLocations = async (req, res) => {
    try {
        const featuredLocations = await Location.find({ featured: true });
        res.status(200).json(featuredLocations);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi lấy địa điểm nổi bật', details: error.message });
    }
};

// Cập nhật địa điểm (có hỗ trợ cập nhật ảnh)
exports.updateLocation = async (req, res) => {
    try {
        const { name, featured } = req.body;
        const image = req.file ? `/Locations/${req.file.filename}` : req.body.image; // Giữ ảnh cũ nếu không có ảnh mới

        const location = await Location.findByIdAndUpdate(
            req.params.id,
            { name, image, featured },
            { new: true }
        );

        if (!location) {
            return res.status(404).json({ error: 'Địa điểm không tồn tại' });
        }
        res.status(200).json(location);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi cập nhật địa điểm', details: error.message });
    }
};

// Xóa địa điểm
exports.deleteLocation = async (req, res) => {
    try {
        const location = await Location.findByIdAndDelete(req.params.id);
        if (!location) {
            return res.status(404).json({ error: 'Địa điểm không tồn tại' });
        }
        res.status(200).json({ message: 'Địa điểm đã được xóa' });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi xóa địa điểm', details: error.message });
    }
};

// Xuất middleware upload để sử dụng trong routes
exports.upload = upload;
