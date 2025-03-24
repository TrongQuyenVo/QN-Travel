const express = require('express');
const {
    createLocation,
    getLocations,
    getFeaturedLocations,
    updateLocation,
    deleteLocation,
    upload // Import middleware Multer
} = require('../controllers/locationController');

const router = express.Router();

router.post('/', upload.single('image'), createLocation); // Hỗ trợ upload ảnh
router.get('/', getLocations);
router.get('/featured', getFeaturedLocations);
router.put('/:id', upload.single('image'), updateLocation); // Hỗ trợ cập nhật ảnh
router.delete('/:id', deleteLocation);

module.exports = router;
