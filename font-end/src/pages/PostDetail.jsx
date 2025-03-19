import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
        const fetchPost = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/posts/${id}`);
                const fetchedPost = response.data;
                setPost(fetchedPost);
                setComments(fetchedPost.comments);
                setUserRating(0); // Giả lập người dùng chưa đánh giá
                setRatingCount(fetchedPost.ratingCount);
                setTotalRatings(fetchedPost.rating * fetchedPost.ratingCount);
            } catch (error) {
                console.error('Lỗi khi lấy chi tiết bài viết:', error);
            }
        };

        fetchPost();
    }, [id]);

    const handleAddComment = async () => {
        if (!user) {
            setActionType('comment');
            setShowModal(true);
            return;
        }

        try {
            const response = await axios.post(`http://localhost:5000/api/posts/${id}/comments`, {
                author: user.userName,
                content: newComment
            });
            setComments([...comments, response.data]);
            setNewComment('');
        } catch (error) {
            console.error('Lỗi khi thêm bình luận:', error);
        }
    };

    const handleRating = async (newRating) => {
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

        try {
            await axios.put(`http://localhost:5000/api/posts/${id}/rating`, {
                rating: newRating
            });

            setTotalRatings(newTotalRatings);
            setRatingCount(newRatingCount);
            setUserRating(newRating);
            setPost((prevPost) => ({
                ...prevPost,
                rating: newAverageRating
            }));
        } catch (error) {
            console.error('Lỗi khi đánh giá:', error);
        }
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