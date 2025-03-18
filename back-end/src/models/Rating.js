const mongoose = require('mongoose');

const RatingSchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    postID: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    score: { type: Number, required: true, min: 1, max: 5 },
    ratingDate: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Rating', RatingSchema);
