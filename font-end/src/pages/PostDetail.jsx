import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { StarIcon, CalendarIcon, MessageSquareIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
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
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/posts/${id}`);
                const fetchedPost = response.data;
                setPost(fetchedPost);
                setComments(fetchedPost.comments || []);
                setUserRating(0);
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

        if (!newComment.trim() || isSubmitting) return;

        setIsSubmitting(true);

        try {
            const response = await axios.post(`http://localhost:5000/api/posts/${id}/comments`, {
                author: user.userName,
                content: newComment.trim()
            });

            console.log('Response from server:', response.data); // Thêm dòng này để debug

            const newCommentFromServer = response.data;

            setComments(prevComments => {
                console.log('Previous comments:', prevComments); // Thêm dòng này để debug
                return [...prevComments, newCommentFromServer];
            });
            setNewComment('');
        } catch (error) {
            console.error('Lỗi khi thêm bình luận:', error.response ? error.response.data : error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatContent = (text) => {
        return text.split('\n').map((line, index) => (
            <React.Fragment key={index}>{line}<br /></React.Fragment>
        ));
    };

    const handleGoBack = () => {
        navigate(-1); // Quay lại trang trước đó
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
            // Người dùng đánh giá lần đầu -> Cộng vào tổng điểm và tăng số lượt đánh giá
            newTotalRatings += newRating;
            newRatingCount += 1;
        } else {
            // Người dùng chỉ sửa đánh giá -> Chỉ cập nhật tổng điểm, không tăng ratingCount
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

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleAddComment();
        }
    };

    const handleModalClose = () => setShowModal(false);
    const handleModalContinue = () => {
        setShowModal(false);
        navigate('/login');
    };

    // Xử lý điều hướng gallery
    const handlePrevImage = () => {
        if (post?.images?.length) {
            setCurrentImageIndex((prevIndex) =>
                prevIndex === 0 ? post.images.length - 1 : prevIndex - 1
            );
        }
    };

    const handleNextImage = () => {
        if (post?.images?.length) {
            setCurrentImageIndex((prevIndex) =>
                prevIndex === post.images.length - 1 ? 0 : prevIndex + 1
            );
        }
    };

    const handleThumbnailClick = (index) => {
        setCurrentImageIndex(index);
    };

    if (!post) return <div>Đang tải...</div>;

    // Generate a unique key for each comment
    const getCommentKey = (comment, index) => {
        // Try to use any available ID from the comment
        if (comment.id) return `comment-${comment.id}`;
        if (comment._id) return `comment-${comment._id}`;
        // If no ID is available, use the index and some content for uniqueness
        return `comment-${index}-${comment.author && comment.author.substring(0, 8)}-${Date.now()}`;
    };

    return (
        <div>
            <div className="back-button" onClick={handleGoBack}>
                <ChevronLeftIcon size={24} />
            </div>
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

                {post.images && post.images.length > 0 && (
                    <div className="post-images">
                        <div className="main-image">
                            {post.images.map((image, index) => (
                                <img
                                    key={`main-img-${index}`}
                                    src={image}
                                    alt={`Hình ảnh ${index + 1}`}
                                    className={index === currentImageIndex ? 'active' : ''}
                                />
                            ))}
                            <div className="arrow-nav arrow-prev" onClick={handlePrevImage}>
                                <ChevronLeftIcon />
                            </div>
                            <div className="arrow-nav arrow-next" onClick={handleNextImage}>
                                <ChevronRightIcon />
                            </div>
                        </div>

                        <div className="thumbnails">
                            {post.images.map((image, index) => (
                                <div
                                    key={`thumb-${index}`}
                                    className={`thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                                    onClick={() => handleThumbnailClick(index)}
                                >
                                    <img src={image} alt={`Thumbnail ${index + 1}`} />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <h1>{post.title}</h1>
                <div className="post-meta">
                    <span><CalendarIcon size={16} /> {new Date(post.createdAt).toLocaleDateString()}</span>
                    <span><MessageSquareIcon size={16} /> {comments.length} bình luận</span>
                    <span><StarIcon size={16} /> {post.rating.toFixed(1)} ({ratingCount} đánh giá)</span>
                </div>
                <p>{formatContent(post.content)}</p>

                <h2>Đánh giá</h2>
                <div className="rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon
                            key={`star-${star}`}
                            size={24}
                            className={star <= userRating ? 'filled' : ''}
                            onClick={() => handleRating(star)}
                        />
                    ))}
                </div>

                <h2>Bình luận</h2>
                <div className="comments">
                    {comments.length > 0 ? comments.map((comment, index) => (
                        <div key={getCommentKey(comment, index)} className="comment">
                            <strong>{comment.author}</strong>
                            <p>{comment.content}</p>
                        </div>
                    )) : <p>Chưa có bình luận nào.</p>}
                </div>

                <div className="add-comment">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Thêm bình luận..."
                        onKeyDown={handleKeyDown}
                        disabled={isSubmitting}
                    />
                    <button
                        onClick={handleAddComment}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Đang gửi...' : 'Gửi'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PostDetail;