const Location = require('../models/Location');

exports.createLocation = async (req, res) => {
    try {
        const { name } = req.body;

        const newLocation = new Location({ name });

        await newLocation.save();
        res.status(201).json(newLocation);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi tạo địa điểm mới', details: error.message });
    }
};

exports.getLocations = async (req, res) => {
    try {
        const locations = await Location.find();
        res.status(200).json(locations);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi lấy danh sách địa điểm', details: error.message });
    }
};

exports.updateLocation = async (req, res) => {
    try {
        const { name } = req.body;
        const location = await Location.findByIdAndUpdate(
            req.params.id,
            { name },
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