const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // Import uuid

const userSchema = new mongoose.Schema({
    userID: {
        type: String,
        unique: true,
        default: uuidv4, // Tạo userID tự động
    },
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
    },
    role: {
        type: String,
        default: 'user',
    },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
