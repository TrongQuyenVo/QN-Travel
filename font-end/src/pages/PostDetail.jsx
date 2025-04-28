import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { StarIcon, CalendarIcon, MessageSquareIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { debounce } from 'lodash';
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
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`http://localhost:5000/api/posts/${id}`);
                const fetchedPost = response.data || {};
                setPost(fetchedPost);
                setComments(fetchedPost.comments || []);
                setUserRating(0);

                if (fetchedPost.rating !== undefined && fetchedPost.ratingCount !== undefined) {
                    setRatingCount(fetchedPost.ratingCount);
                    setTotalRatings(fetchedPost.rating * fetchedPost.ratingCount);
                } else {
                    setRatingCount(0);
                    setTotalRatings(0);
                    setPost({
                        ...fetchedPost,
                        rating: 0,
                        ratingCount: 0,
                    });
                }

                setError(null);
            } catch (error) {
                console.error('Lỗi khi lấy chi tiết bài viết:', error);
                setError('Không thể tải bài viết. Vui lòng thử lại sau.');
            } finally {
                setIsLoading(false);
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

        if (!newComment.trim() || newComment.length > 500) {
            setError('Bình luận không được để trống và không được dài quá 500 ký tự.');
            return;
        }

        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            const currentRating = userRating > 0 ? userRating : 0;
            const response = await axios.post(
                `http://localhost:5000/api/posts/${id}/comments`,
                {
                    author: user.userName,
                    content: newComment.trim(),
                    rating: currentRating,
                    userId: user.id,
                },
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                    },
                }
            );

            const newCommentFromServer = response.data.comment;

            if (!response.data.success) {
                throw new Error(response.data.error || 'Không thể thêm bình luận');
            }

            if (!newCommentFromServer || !newCommentFromServer._id) {
                throw new Error('Dữ liệu trả về từ server không hợp lệ: Thiếu trường _id');
            }

            newCommentFromServer.rating = currentRating;

            setComments((prevComments) => [...prevComments, newCommentFromServer]);

            // Cập nhật post từ response, nhưng giữ lại trường images từ post hiện tại
            const updatedPost = response.data.post;
            setPost({
                ...post,              // Giữ lại tất cả thuộc tính hiện tại
                ...updatedPost,       // Cập nhật các thuộc tính mới
                images: post.images   // Luôn giữ lại images từ state hiện tại
            });

            setRatingCount(updatedPost.ratingCount);
            setTotalRatings(updatedPost.rating * updatedPost.ratingCount);

            setNewComment('');
            setUserRating(0);
            setError(null);
        } catch (error) {
            console.error('Lỗi khi thêm bình luận:', error.message);
            setError(error.message || 'Không thể thêm bình luận. Vui lòng thử lại.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const debouncedAddComment = debounce(handleAddComment, 300);

    const handleRating = async (newRating) => {
        if (!user) {
            setActionType('rating');
            setShowModal(true);
            return;
        }
        setUserRating(newRating);
    };

    const submitRatingOnly = async () => {
        if (!user || userRating === 0) return;

        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            const response = await axios.post(`http://localhost:5000/api/posts/${id}/rating`, {
                rating: userRating,
                userId: user.id,
            });

            if (response.data && response.data.success) {
                const updatedPost = response.data.post;
                setPost({
                    ...post,              // Giữ lại tất cả thuộc tính hiện tại
                    ...updatedPost,       // Cập nhật các thuộc tính mới
                    images: post.images   // Luôn giữ lại images từ state hiện tại
                });
                setRatingCount(updatedPost.ratingCount);
                setTotalRatings(updatedPost.rating * updatedPost.ratingCount);
                setUserRating(0);
            } else {
                throw new Error('Không thể gửi đánh giá: Phản hồi từ server không hợp lệ');
            }
        } catch (error) {
            console.error('Lỗi khi gửi đánh giá:', error.message);
            setError(error.message || 'Không thể gửi đánh giá. Vui lòng thử lại.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderRatingSubmitButton = () => {
        if (user && userRating > 0) {
            return (
                <button onClick={submitRatingOnly} className="rating-submit-button" disabled={isSubmitting}>
                    {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                </button>
            );
        }
        return null;
    };

    const formatContent = (text) => {
        if (!text) return null;
        return text.split('\n').map((line, index) => (
            <React.Fragment key={index}>
                {line}
                <br />
            </React.Fragment>
        ));
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            debouncedAddComment();
        }
    };

    const handleModalClose = () => setShowModal(false);
    const handleModalContinue = () => {
        setShowModal(false);
        navigate('/login');
    };

    const handlePrevImage = () => {
        if (post?.images?.length > 0) {
            setCurrentImageIndex((prevIndex) =>
                prevIndex === 0 ? post.images.length - 1 : prevIndex - 1
            );
        }
    };

    const handleNextImage = () => {
        if (post?.images?.length > 0) {
            setCurrentImageIndex((prevIndex) =>
                prevIndex === post.images.length - 1 ? 0 : prevIndex + 1
            );
        }
    };

    const handleThumbnailClick = (index) => {
        setCurrentImageIndex(index);
    };
    if (!post) return <div>Đang tải...</div>;

    const displayAverageRating = () => {
        const averageRating = ratingCount > 0 ? (totalRatings / ratingCount).toFixed(1) : 0;
        return (
            <span>
                <StarIcon size={16} /> {averageRating} ({ratingCount} đánh giá)
            </span>
        );
    };

    const renderComments = (commentList) => {
        if (!commentList || !Array.isArray(commentList)) {
            return null;
        }

        if (commentList.length === 0) {
            return <p className="no-comments">Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>;
        }

        return commentList.map((comment) => {
            if (!comment) return null;

            const ratingScore = comment.rating || 0;

            return (
                <div key={comment._id} className="comment">
                    <strong>{comment.author}</strong>

                    {ratingScore > 0 && (
                        <div className="comment-rating" style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ marginRight: '8px' }}>Đánh giá:</span>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <StarIcon
                                    key={star}
                                    size={16}
                                    className={star <= ratingScore ? 'filled' : ''}
                                    style={{
                                        fill: star <= ratingScore ? 'gold' : 'none',
                                        stroke: '#000',
                                        marginRight: '2px',
                                    }}
                                />
                            ))}
                        </div>
                    )}
                    <p>{comment.content}</p>
                    <div className="comment-date">
                        <span>{comment.date ? new Date(comment.date).toLocaleString() : ''}</span>
                    </div>
                </div>
            );
        });
    };

    if (isLoading) return <div className="loading">Đang tải...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (!post) return <div className="not-found">Không tìm thấy bài viết.</div>;

    return (
        <div className="post-detail-container">
            <div className="back-button" onClick={handleGoBack} aria-label="Quay lại">
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
                    <span>
                        <CalendarIcon size={16} /> {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                    <span>
                        <MessageSquareIcon size={16} /> {comments.length} bình luận
                    </span>
                    {displayAverageRating()}
                </div>

                <div className="post-content">{formatContent(post.content)}</div>

                <div className="post-details">
                    {post.category === 'food' && (
                        <div className="food-details">
                            {post.cuisine && <p><strong>Ẩm thực:</strong> {post.cuisine}</p>}
                            {post.priceRange && <p><strong>Giá:</strong> {post.priceRange}</p>}
                        </div>
                    )}

                    {post.category === 'event' && (
                        <div className="event-details">
                            {post.eventDate && (
                                <p>
                                    <strong>Thời gian sự kiện:</strong> {new Date(post.eventDate).toLocaleDateString()}
                                    {post.eventEndDate && ` đến ${new Date(post.eventEndDate).toLocaleDateString()}`}
                                </p>
                            )}
                        </div>
                    )}

                    {post.locationID && (
                        <div className="location-details">
                            <p><strong>Địa điểm:</strong> {post.locationID.name}</p>
                        </div>
                    )}
                </div>

                <h2>Đánh giá</h2>
                {user ? (
                    <div className="rating-container">
                        <div className="rating">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <StarIcon
                                    key={star}
                                    size={24}
                                    className={star <= userRating ? 'filled' : ''}
                                    onClick={() => handleRating(star)}
                                    aria-label={`Đánh giá ${star} sao`}
                                    style={{
                                        fill: star <= userRating ? 'gold' : 'none',
                                        stroke: '#000',
                                        marginRight: '4px',
                                        cursor: 'pointer',
                                    }}
                                />
                            ))}
                        </div>
                        {renderRatingSubmitButton()}
                    </div>
                ) : (
                    <p>Vui lòng đăng nhập để đánh giá.</p>
                )}

                <h2>Bình luận</h2>
                <div className="comments-section">
                    <div className="add-comment">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Thêm bình luận (tối đa 500 ký tự)..."
                            onKeyDown={handleKeyDown}
                            maxLength={500}
                            disabled={!user || isSubmitting}
                        />
                        <button
                            onClick={debouncedAddComment}
                            disabled={!user || !newComment.trim() || newComment.length > 500 || isSubmitting}
                        >
                            {isSubmitting ? 'Đang gửi...' : 'Gửi'}
                        </button>
                    </div>

                    <div className="comments-list">{renderComments(comments)}</div>
                </div>
            </div>
        </div>
    );
};

export default PostDetail;