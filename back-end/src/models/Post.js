const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    author: { type: String, required: true },
    content: { type: String, required: true },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
    date: { type: Date, default: Date.now },
});

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: ['general', 'food', 'event', 'story'],
        default: 'general',
        required: true,
    },
    images: [
        {
            type: String,
        },
    ],
    locationID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
        required: true,
    },
    comments: [commentSchema],
    rating: {
        type: Number,
        default: 0,
    },
    ratingCount: {
        type: Number,
        default: 0,
    },
    ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rating' }],
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);