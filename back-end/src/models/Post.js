const mongoose = require('mongoose');

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
            type: String, // Lưu danh sách các URL hoặc đường dẫn ảnh
        },
    ],
    locationID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
        required: true,
    },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

// Tạo virtual field để populate comments
postSchema.virtual('comments', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'postID', // Giả định Comment model có trường postID
});

// Tạo virtual field để populate ratings
postSchema.virtual('ratings', {
    ref: 'Rating',
    localField: '_id',
    foreignField: 'postID',
});

// Method để tính rating trung bình
postSchema.methods.calculateAverageRating = async function () {
    const ratings = await mongoose.model('Rating').find({ postID: this._id });
    if (ratings.length === 0) return 0;

    const sum = ratings.reduce((total, rating) => total + rating.score, 0);
    return sum / ratings.length;
};

// Static method để tìm post và rating của nó
postSchema.statics.findWithRating = async function (postId) {
    const post = await this.findById(postId);
    if (!post) return null;

    const averageRating = await post.calculateAverageRating();
    const ratingCount = await mongoose.model('Rating').countDocuments({ postID: post._id });

    return {
        ...post.toObject(),
        rating: averageRating,
        ratingCount: ratingCount
    };
};

module.exports = mongoose.model('Post', postSchema);