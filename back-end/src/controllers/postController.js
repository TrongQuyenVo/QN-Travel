const Post = require('../models/Post');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Đảm bảo rằng thư mục uploads tồn tại
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

exports.uploadImage = upload.single('image');

exports.createPost = async (req, res) => {
    try {
        const { title, content, locationID } = req.body;
        const image = req.file ? req.file.path : '';

        const newPost = new Post({
            title,
            content,
            image,
            locationID,
        });

        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi tạo bài viết mới', details: error.message });
    }
};

exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('locationID');
        posts.forEach(post => {
            post.image = post.image ? `http://localhost:5000/uploads/${post.image}` : '';
        });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi lấy danh sách bài viết', details: error.message });
    }
};

exports.getPostById = async (req, res) => {
    try {
        console.log("Đang lấy bài viết với ID:", req.params.id);
        const post = await Post.findById(req.params.id).populate('locationID');
        if (!post) {
            return res.status(404).json({ error: 'Bài viết không tồn tại' });
        }
        post.image = post.image ? `http://localhost:5000/uploads/${post.image}` : '';
        res.status(200).json(post);
    } catch (error) {
        console.error('Lỗi khi lấy chi tiết bài viết:', error);
        res.status(500).json({ error: 'Lỗi khi lấy thông tin bài viết', details: error.message });
    }
};

exports.updatePost = async (req, res) => {
    try {
        const { title, content, locationID } = req.body;
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: 'Bài viết không tồn tại' });
        }

        // Xóa file ảnh cũ nếu có ảnh mới
        if (req.file && post.image) {
            fs.unlink(path.join(uploadDir, post.image), (err) => {
                if (err) {
                    console.error('Lỗi khi xóa file ảnh:', err);
                }
            });
        }

        const image = req.file ? req.file.filename : post.image;

        post.title = title;
        post.content = content;
        post.image = image;
        post.locationID = locationID;

        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi cập nhật bài viết', details: error.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        if (!post) {
            return res.status(404).json({ error: 'Bài viết không tồn tại' });
        }

        // Xóa file ảnh nếu tồn tại
        if (post.image) {
            fs.unlink(post.image, (err) => {
                if (err) {
                    console.error('Lỗi khi xóa file ảnh:', err);
                }
            });
        }

        res.status(200).json({ message: 'Bài viết đã được xóa' });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi xóa bài viết', details: error.message });
    }
};

exports.addComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: 'Bài viết không tồn tại' });
        }

        const newComment = {
            author: req.body.author,
            content: req.body.content,
            date: new Date()
        };

        post.comments.push(newComment);
        await post.save();

        res.status(201).json(newComment);
    } catch (error) {
        console.error('Lỗi khi thêm bình luận:', error);
        res.status(500).json({ error: 'Lỗi khi thêm bình luận' });
    }
};

exports.updateRating = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: 'Bài viết không tồn tại' });
        }

        const { rating } = req.body;
        post.ratingCount += 1;
        post.rating = ((post.rating * (post.ratingCount - 1)) + rating) / post.ratingCount;

        await post.save();

        res.status(200).json(post);
    } catch (error) {
        console.error('Lỗi khi cập nhật đánh giá:', error);
        res.status(500).json({ error: 'Lỗi khi cập nhật đánh giá' });
    }
};

exports.approveComment = async (req, res) => {
    try {
        const { postId, commentId } = req.params;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ error: 'Bài viết không tồn tại' });
        }

        const comment = post.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ error: 'Bình luận không tồn tại' });
        }

        comment.approved = true;
        await post.save();
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi duyệt bình luận', details: error.message });
    }
};

exports.searchPostsByLocationName = async (req, res) => {
    try {
        const { locationName } = req.query;
        if (!locationName) {
            return res.status(400).json({ message: 'locationName là bắt buộc' });
        }

        const locations = await Location.find({ name: new RegExp(locationName, 'i') });
        const locationIds = locations.map(location => location._id);

        const posts = await Post.find({ locationID: { $in: locationIds } }).populate('locationID');
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tìm kiếm bài viết', error });
    }
};