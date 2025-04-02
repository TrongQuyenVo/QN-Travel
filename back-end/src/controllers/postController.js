const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Post = require("../models/Post");
const Rating = require("../models/Rating");
const Location = require("../models/Location");

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });
exports.uploadImages = upload.array('images', 10);

exports.createPost = async (req, res) => {
    try {
        const { title, content, locationID, category, eventDate, eventEndDate, cuisine, priceRange } = req.body;
        const images = req.files ? req.files.map(file => file.filename) : [];

        if (!title || !content) {
            return res.status(400).json({ error: 'Tiêu đề và nội dung là bắt buộc' });
        }

        const postData = {
            title,
            content,
            images,
            locationID,
            category: category || 'general',
            rating: 0,
            ratingCount: 0,
        };

        if (category === 'event') {
            if (!eventDate) {
                return res.status(400).json({ error: 'Ngày sự kiện là bắt buộc cho bài đăng sự kiện' });
            }
            postData.eventDate = eventDate;
            if (eventEndDate) postData.eventEndDate = eventEndDate;
        }

        if (category === 'food') {
            if (cuisine) postData.cuisine = cuisine;
            if (priceRange) postData.priceRange = priceRange;
        }

        const newPost = new Post(postData);
        await newPost.save();

        res.status(201).json(newPost);
    } catch (error) {
        console.error('Lỗi khi tạo bài viết:', error);
        res.status(500).json({ error: 'Lỗi khi tạo bài viết', details: error.message });
    }
};

exports.updatePost = async (req, res) => {
    try {
        const { title, content, locationID, removeImages, category, eventDate, eventEndDate, cuisine, priceRange } = req.body;
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: 'Bài viết không tồn tại' });

        if (!title || !content) {
            return res.status(400).json({ error: 'Tiêu đề và nội dung là bắt buộc' });
        }

        if (removeImages && Array.isArray(removeImages)) {
            post.images = post.images.filter(img => !removeImages.includes(img));
            removeImages.forEach(img => {
                fs.unlink(path.join(uploadDir, img), err => {
                    if (err) console.error('Lỗi khi xóa ảnh:', err);
                });
            });
        }

        const newImages = req.files ? req.files.map(file => file.filename) : [];
        post.images.push(...newImages);
        post.title = title;
        post.content = content;
        post.locationID = locationID;

        if (category) post.category = category;

        if (category === 'event') {
            if (eventDate) post.eventDate = eventDate;
            if (eventEndDate) post.eventEndDate = eventEndDate;
        }

        if (category === 'food') {
            if (cuisine) post.cuisine = cuisine;
            if (priceRange) post.priceRange = priceRange;
        }

        await post.save();
        res.status(200).json(post);
    } catch (error) {
        console.error('Lỗi khi cập nhật bài viết:', error);
        res.status(500).json({ error: 'Lỗi khi cập nhật bài viết', details: error.message });
    }
};

exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('locationID');
        
        // Xử lý ảnh cho mỗi bài đăng
        posts.forEach(post => {
            post.images = post.images.map(img => `http://localhost:5000/uploads/${img}`);
        });
        
        res.status(200).json(posts);
    } catch (error) {
        console.error('Lỗi khi lấy bài viết:', error);
        res.status(500).json({ error: 'Lỗi khi lấy bài viết', details: error.message });
    }
};

exports.getPostsByCategory = async (req, res) => {
    try {
        const { category } = req.params;

        if (!['general', 'food', 'event', 'story'].includes(category)) {
            return res.status(400).json({ error: 'Danh mục không hợp lệ' });
        }

        const posts = await Post.find({ category }).populate('locationID');
        
        // Xử lý ảnh cho mỗi bài đăng
        posts.forEach(post => {
            post.images = post.images.map(img => `http://localhost:5000/uploads/${img}`);
        });

        res.status(200).json(posts);
    } catch (error) {
        console.error('Lỗi khi lấy bài viết theo danh mục:', error);
        res.status(500).json({ error: 'Lỗi khi lấy bài viết theo danh mục', details: error.message });
    }
};

exports.getPostById = async (req, res) => {
    try {
        // Kiểm tra xem req.params.id có phải ObjectId hợp lệ không
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ error: 'ID bài viết không hợp lệ' });
        }

        let post = await Post.findById(req.params.id);

        if (!post) return res.status(404).json({ error: 'Bài viết không tồn tại' });

        // Populate locationID
        if (post.locationID && mongoose.Types.ObjectId.isValid(post.locationID)) {
            post = await Post.findById(req.params.id)
                .populate('locationID')
                .populate({
                    path: 'ratings',
                    populate: { path: 'userID', select: 'name' },
                });
        }

        // Xử lý ảnh
        post.images = Array.isArray(post.images)
            ? post.images.map(img => `http://localhost:5000/uploads/${img}`)
            : [];

        const postObj = post.toObject();

        // Chuyển đổi dữ liệu bình luận
        postObj.comments = Array.isArray(postObj.comments)
            ? postObj.comments.map(comment => ({
                  ...comment,
                  rating: comment.rating !== undefined ? comment.rating : 0,
              }))
            : [];

        res.status(200).json(postObj);
    } catch (error) {
        console.error('Lỗi khi lấy bài viết:', error);
        res.status(500).json({ error: 'Lỗi khi lấy bài viết', details: error.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        if (!post) return res.status(404).json({ error: 'Bài viết không tồn tại' });

        post.images.forEach(img => {
            fs.unlink(path.join(uploadDir, img), err => {
                if (err) console.error('Lỗi khi xóa ảnh:', err);
            });
        });

        res.status(200).json({ message: 'Bài viết đã được xóa' });
    } catch (error) {
        console.error('Lỗi khi xóa bài viết:', error);
        res.status(500).json({ error: 'Lỗi khi xóa bài viết', details: error.message });
    }
};

exports.addComment = async (req, res) => {
    try {
        console.log('Processing comment request for post ID:', req.params.id);

        // Validate input
        const { author, content, rating, userId } = req.body;
        if (!author || !content) {
            return res.status(400).json({ success: false, error: 'Tác giả và nội dung là bắt buộc' });
        }
        if (content.length > 500) {
            return res.status(400).json({ success: false, error: 'Nội dung không được dài quá 500 ký tự' });
        }
        
        // Validate rating
        const parsedRating = Number(rating);
        if (isNaN(parsedRating) || parsedRating < 0 || parsedRating > 5) {
            return res.status(400).json({ success: false, error: 'Đánh giá phải là số từ 0 đến 5' });
        }

        // Find post
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ success: false, error: 'Bài viết không tồn tại' });
        }

        // Create new comment
        const newComment = {
            author,
            content,
            rating: parsedRating,
            userId: userId ? new mongoose.Types.ObjectId(userId) : undefined,
            date: new Date(),
        };

        post.comments.push(newComment);
        await post.save();

        // Get the newly added comment
        const addedComment = post.comments[post.comments.length - 1];
        if (!addedComment._id) {
            return res.status(500).json({ success: false, error: 'Không thể tạo bình luận: Thiếu trường _id' });
        }

        // Handle rating if provided
        if (parsedRating > 0 && userId && mongoose.Types.ObjectId.isValid(userId)) {
            try {
                const userObjectId = new mongoose.Types.ObjectId(userId);
                let existingRating = await Rating.findOne({ userID: userObjectId, postID: req.params.id });
                
                if (existingRating) {
                    existingRating.score = parsedRating;
                    await existingRating.save();
                } else {
                    const newRating = new Rating({
                        userID: userObjectId,
                        postID: req.params.id,
                        score: parsedRating,
                    });
                    const savedRating = await newRating.save();
                    post.ratings.push(savedRating._id);
                }

                const ratings = await Rating.find({ postID: req.params.id });
                post.ratingCount = ratings.length;
                post.rating = ratings.length > 0 ? ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length : 0;
                
                await post.save();
            } catch (ratingError) {
                console.error('Error processing rating:', ratingError);
                return res.status(500).json({ success: false, error: 'Lỗi khi xử lý đánh giá', details: ratingError.message });
            }
        }

        // Return populated post data
        try {
            const populatedPost = await Post.findById(post._id)
                .populate('locationID')
                .populate({ path: 'ratings', populate: { path: 'userID', select: 'name' } });
            
            return res.status(201).json({ success: true, comment: addedComment, post: populatedPost });
        } catch (populateError) {
            console.error('Error populating post data:', populateError);
            return res.status(201).json({ success: true, comment: addedComment, message: 'Bình luận đã được thêm nhưng không thể lấy dữ liệu đầy đủ' });
        }
    } catch (error) {
        console.error('Unexpected error in addComment:', error);
        return res.status(500).json({
            success: false,
            error: 'Lỗi hệ thống khi thêm bình luận',
            message: error.message
        });
    }
};


exports.approveComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) return res.status(404).json({ error: 'Bài viết không tồn tại' });

        const comment = post.comments.id(req.params.commentId);
        if (!comment) return res.status(404).json({ error: 'Bình luận không tồn tại' });

        comment.approved = true;
        await post.save();
        res.status(200).json({ message: 'Bình luận đã được duyệt', comment });
    } catch (error) {
        console.error('Lỗi khi duyệt bình luận:', error);
        res.status(500).json({ error: 'Lỗi khi duyệt bình luận', details: error.message });
    }
};

exports.updateRating = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: 'Bài viết không tồn tại' });

        const { rating, userId } = req.body;
        if (!rating || typeof rating !== 'number' || rating < 0 || rating > 5) {
            return res.status(400).json({ error: 'Đánh giá phải là số từ 0 đến 5' });
        }
        if (!userId) {
            return res.status(400).json({ error: 'userId là bắt buộc' });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'userId không hợp lệ' });
        }

        let existingRating = await Rating.findOne({ 
            userID: new mongoose.Types.ObjectId(userId), 
            postID: req.params.id 
        });
        if (existingRating) {
            existingRating.score = rating;
            await existingRating.save();
        } else {
            const newRating = new Rating({ 
                userID: new mongoose.Types.ObjectId(userId),
                postID: req.params.id, 
                score: rating 
            });
            await newRating.save();
            // Thêm rating vào mảng ratings của post
            if (!post.ratings) post.ratings = [];
            post.ratings.push(newRating._id);
        }

        const ratings = await Rating.find({ postID: req.params.id });
        post.ratingCount = ratings.length;
        post.rating = ratings.length > 0 ? ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length : 0;

        await post.save();
        
        // Trả về post đã được populate với ratings
        const updatedPost = await Post.findById(req.params.id)
            .populate('locationID')
            .populate({
                path: 'ratings',
                populate: { path: 'userID', select: 'name' },
            });

        res.status(200).json({ success: true, post: updatedPost });
    } catch (error) {
        console.error('Lỗi khi cập nhật đánh giá:', error);
        res.status(500).json({ error: 'Lỗi khi cập nhật đánh giá', details: error.message });
    }
};

exports.searchPostsByLocationName = async (req, res) => {
    try {
        const { locationName } = req.query;
        if (!locationName) return res.status(400).json({ message: 'locationName là bắt buộc' });

        const locations = await Location.find({ name: new RegExp(locationName, 'i') });
        const locationIds = locations.map(location => location._id);

        const posts = await Post.find({ locationID: { $in: locationIds } }).populate('locationID');
        
        posts.forEach(post => {
            post.images = post.images.map(img => `http://localhost:5000/uploads/${img}`);
        });
        
        res.status(200).json(posts);
    } catch (error) {
        console.error('Lỗi khi tìm kiếm bài viết:', error);
        res.status(500).json({ error: 'Lỗi khi tìm kiếm bài viết', details: error.message });
    }
};