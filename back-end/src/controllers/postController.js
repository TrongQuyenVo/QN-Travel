const Post = require('../models/Post');

exports.createPost = async (req, res) => {
    try {
        const { title, content, image, locationID, adminID, rating } = req.body;

        const newPost = new Post({
            title,
            content,
            image,
            locationID,
            adminID,
            rating,
        });

        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi tạo bài viết mới', details: error.message });
    }
};

exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('locationID').populate('adminID');
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi lấy danh sách bài viết', details: error.message });
    }
};

exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('locationID').populate('adminID');
        if (!post) {
            return res.status(404).json({ error: 'Bài viết không tồn tại' });
        }
        res.status(200).json(post);
    } catch (error) {
        console.error('Lỗi khi lấy chi tiết bài viết:', error);
        res.status(500).json({ error: 'Lỗi khi lấy thông tin bài viết', details: error.message });
    }
};

exports.updatePost = async (req, res) => {
    try {
        const { title, content, image, locationID, rating } = req.body;
        const post = await Post.findByIdAndUpdate(
            req.params.id,
            { title, content, image, locationID, rating },
            { new: true }
        );
        if (!post) {
            return res.status(404).json({ error: 'Bài viết không tồn tại' });
        }
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

        const posts = await Post.find({ locationID: { $in: locationIds } }).populate('locationID').populate('adminID');
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi tìm kiếm bài viết', error });
    }
};