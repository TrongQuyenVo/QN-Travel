const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    featured: { type: Boolean, default: false },
});

module.exports = mongoose.model('Location', LocationSchema);
