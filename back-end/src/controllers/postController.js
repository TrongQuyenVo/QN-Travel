const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Post = require("../models/Post");

// Tạo thư mục lưu ảnh nếu chưa tồn tại
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình multer để lưu ảnh
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });
exports.uploadImages = upload.array('images', 10); // Cho phép upload tối đa 5 ảnh

exports.createPost = async (req, res) => {
    try {
        const { title, content, locationID, category, eventDate, eventEndDate, cuisine, priceRange } = req.body;
        const images = req.files ? req.files.map(file => file.filename) : [];

        const postData = {
            title,
            content,
            images,
            locationID,
            category: category || 'general'
        };

        // Thêm các trường dành riêng cho sự kiện nếu đó là bài đăng sự kiện
        if (category === 'event' && eventDate) {
            postData.eventDate = eventDate;
            if (eventEndDate) postData.eventEndDate = eventEndDate;
        }

        // Thêm các trường dành riêng cho ẩm thực nếu đó là bài đăng ẩm thực
        if (category === 'food') {
            if (cuisine) postData.cuisine = cuisine;
            if (priceRange) postData.priceRange = priceRange;
        }

        const newPost = new Post(postData);
        await newPost.save();

        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi tạo bài viết', details: error.message });
    }
};

exports.updatePost = async (req, res) => {
    try {
        const { title, content, locationID, removeImages, category, eventDate, eventEndDate, cuisine, priceRange } = req.body;
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: 'Bài viết không tồn tại' });

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

        // Cập nhật các trường dành riêng cho sự kiện
        if (category === 'event') {
            if (eventDate) post.eventDate = eventDate;
            if (eventEndDate) post.eventEndDate = eventEndDate;
        }

        // Cập nhật các trường dành riêng cho ẩm thực
        if (category === 'food') {
            if (cuisine) post.cuisine = cuisine;
            if (priceRange) post.priceRange = priceRange;
        }

        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi cập nhật bài viết', details: error.message });
    }
};

exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('locationID');
        posts.forEach(post => {
            post.images = post.images.map(img => `http://localhost:5000/uploads/${img}`);
        });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi lấy danh sách bài viết', details: error.message });
    }
};

exports.getPostsByCategory = async (req, res) => {
    try {
        const { category } = req.params;

        if (!['general', 'food', 'event', 'story'].includes(category)) {
            return res.status(400).json({ error: 'Danh mục không hợp lệ' });
        }

        const posts = await Post.find({ category }).populate('locationID');

        posts.forEach(post => {
            post.images = post.images.map(img => `http://localhost:5000/uploads/${img}`);
        });

        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi lấy danh sách bài viết theo danh mục', details: error.message });
    }
};




exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('locationID');
        if (!post) return res.status(404).json({ error: 'Bài viết không tồn tại' });

        post.images = post.images.map(img => `http://localhost:5000/uploads/${img}`);
        res.status(200).json(post);
    } catch (error) {
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
        res.status(500).json({ error: 'Lỗi khi xóa bài viết', details: error.message });
    }
};

exports.addComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: 'Bài viết không tồn tại' });

        post.comments.push({ author: req.body.author, content: req.body.content });
        await post.save();

        res.status(201).json({ message: 'Bình luận đã được thêm', comments: post.comments });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi thêm bình luận' });
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
        res.status(500).json({ error: 'Lỗi khi duyệt bình luận', details: error.message });
    }
};

exports.updateRating = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: 'Bài viết không tồn tại' });

        const { rating } = req.body;
        post.ratingCount += 1;
        post.rating = ((post.rating * (post.ratingCount - 1)) + rating) / post.ratingCount;

        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi cập nhật đánh giá' });
    }
};

exports.searchPostsByLocationName = async (req, res) => {
    try {
        const { locationName } = req.query;
        if (!locationName) return res.status(400).json({ message: 'locationName là bắt buộc' });

        const locations = await Location.find({ name: new RegExp(locationName, 'i') });
        const locationIds = locations.map(location => location._id);

        const posts = await Post.find({ locationID: { $in: locationIds } }).populate('locationID');
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi tìm kiếm bài viết', details: error.message });
    }
};
