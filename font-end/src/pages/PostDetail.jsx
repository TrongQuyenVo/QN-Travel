import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StarIcon, CalendarIcon, MessageSquareIcon } from 'lucide-react';
import '../styles/PostDetail.css';

const PostDetail = ({ user }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [userRating, setUserRating] = useState(0);
    const [totalRatings, setTotalRatings] = useState(0);
    const [ratingCount, setRatingCount] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [actionType, setActionType] = useState('');

    useEffect(() => {
        // Giả lập dữ liệu bài đăng và bình luận
        const fetchedPost = {
            id: 1,
            title: 'Một ngày ở Hội An',
            content: 'Khám phá Hội An chỉ trong một ngày...',
            images: ['path/to/image1.jpg', 'path/to/image2.jpg'],
            date: '2025-03-01',
            author: 'Chuyên gia du lịch',
            rating: 4.5,
            ratingCount: 10
        };
        const fetchedComments = [
            { id: 1, author: 'Người dùng 1', content: 'Bài viết rất hay!' },
            { id: 2, author: 'Người dùng 2', content: 'Cảm ơn vì thông tin hữu ích.' }
        ];

        setPost(fetchedPost);
        setComments(fetchedComments);
        setUserRating(0); // Giả lập người dùng chưa đánh giá
        setRatingCount(fetchedPost.ratingCount);
        setTotalRatings(fetchedPost.rating * fetchedPost.ratingCount);
    }, [id]);

    const handleAddComment = () => {
        if (!user) {
            setActionType('comment');
            setShowModal(true);
            return;
        }

        const newCommentObj = {
            id: comments.length + 1,
            author: user.userName,
            content: newComment
        };
        setComments([...comments, newCommentObj]);
        setNewComment('');
    };

    const handleRating = (newRating) => {
        if (!user) {
            setActionType('rating');
            setShowModal(true);
            return;
        }

        let newTotalRatings = totalRatings;
        let newRatingCount = ratingCount;

        if (userRating === 0) {
            // Người dùng chưa đánh giá
            newTotalRatings += newRating;
            newRatingCount += 1;
        } else {
            // Người dùng đã đánh giá, cập nhật đánh giá
            newTotalRatings = newTotalRatings - userRating + newRating;
        }

        const newAverageRating = newTotalRatings / newRatingCount;

        setTotalRatings(newTotalRatings);
        setRatingCount(newRatingCount);
        setUserRating(newRating);
        setPost((prevPost) => ({
            ...prevPost,
            rating: newAverageRating
        }));
    };

    const handleModalClose = () => {
        setShowModal(false);
    };

    const handleModalContinue = () => {
        setShowModal(false);
        navigate('/login');
    };

    if (!post) return <div>Đang tải...</div>;

    return (
        <div className="post-detail">
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Thông báo</h2>
                        <p>Bạn cần đăng nhập để {actionType === 'comment' ? 'bình luận' : 'đánh giá'}.</p>
                        <div className="modal-actions">
                            <button onClick={handleModalClose}>Không</button>
                            <button onClick={handleModalContinue}>Tiếp tục</button>
                        </div>
                    </div>
                </div>
            )}
            <div className="post-images">
                {post.images.map((image, index) => (
                    <img key={index} src={image} alt={`Hình ảnh ${index + 1}`} />
                ))}
            </div>
            <h1>{post.title}</h1>
            <div className="post-meta">
                <span><CalendarIcon size={16} /> {new Date(post.date).toLocaleDateString()}</span>
                <span><MessageSquareIcon size={16} /> {comments.length} bình luận</span>
                <span><StarIcon size={16} /> {post.rating.toFixed(1)} ({ratingCount} đánh giá)</span>
            </div>
            <p>{post.content}</p>
            <h2>Đánh giá</h2>
            <div className="rating">
                {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                        key={star}
                        size={24}
                        className={star <= userRating ? 'filled' : ''}
                        onClick={() => handleRating(star)}
                    />
                ))}
            </div>
            <h2>Bình luận</h2>
            <div className="comments">
                {comments.map(comment => (
                    <div key={comment.id} className="comment">
                        <strong>{comment.author}</strong>
                        <p>{comment.content}</p>
                    </div>
                ))}
            </div>
            <div className="add-comment">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Thêm bình luận..."
                />
                <button onClick={handleAddComment}>Gửi</button>
            </div>
        </div>
    );
};

export default PostDetail;