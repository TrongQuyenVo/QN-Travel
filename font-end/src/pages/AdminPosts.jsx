import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaSyncAlt, FaUtensils, FaCalendarDay, FaNewspaper, FaEdit } from "react-icons/fa";
import { BiBookOpen } from "react-icons/bi";
import "../styles/AdminPost.css";

const AdminPosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [activeCategory, setActiveCategory] = useState("all");
    const navigate = useNavigate();

    const getImageUrl = (imagePath) => {
        if (!imagePath) return "/placeholder-image.jpg";
        if (imagePath.startsWith("http")) return imagePath;
        const fileName = imagePath.replace(/^.*[\\\/]/, "");
        return `http://localhost:5000/uploads/${fileName}`;
    };

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                const res = await axios.get("http://localhost:5000/api/posts");
                setPosts(res.data);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách bài viết:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
            try {
                await axios.delete(`http://localhost:5000/api/posts/${id}`);
                setPosts(posts.filter(post => post._id !== id));
                alert("Bài viết đã được xóa!");
            } catch (error) {
                console.error("Lỗi khi xóa bài viết:", error);
                alert("Có lỗi xảy ra khi xóa bài viết!");
            }
        }
    };

    const refreshPosts = async () => {
        try {
            setLoading(true);
            const res = await axios.get("http://localhost:5000/api/posts");
            setPosts(res.data);
        } catch (error) {
            console.error("Lỗi khi làm mới danh sách bài viết:", error);
        } finally {
            setLoading(false);
        }
    };

    const getFilteredPosts = () => {
        if (activeCategory === "all") return posts;
        return posts.filter(post => (post.category || "general") === activeCategory);
    };

    const getSortedAndFilteredPosts = () => {
        return [...getFilteredPosts()].sort((a, b) =>
            new Date(b.createdAt || b.updatedAt) - new Date(a.createdAt || a.updatedAt)
        );
    };

    // Helper function to check if a post has been updated
    const isPostUpdated = (post) => {
        return post.updatedAt && post.createdAt && new Date(post.updatedAt).getTime() > new Date(post.createdAt).getTime();
    };

    if (loading) {
        return <div className="loading-container">Đang tải dữ liệu...</div>;
    }

    const displayPosts = getSortedAndFilteredPosts();

    return (
        <div className="admin-posts-container">
            <div className="admin-posts-header">
                <h1 className="page-title">Quản lý bài viết ({displayPosts.length})</h1>
                <div className="header-buttons">
                    <button className="refresh-btn" onClick={refreshPosts}>
                        <FaSyncAlt /> Làm mới
                    </button>
                    <button className="add-post-btn" onClick={() => navigate("/admin/posts/new")}>
                        + Thêm bài viết mới
                    </button>
                </div>
            </div>

            <div className="posts-list">
                {displayPosts.length === 0 ? (
                    <div className="no-posts-message">Không có bài viết nào trong danh mục này.</div>
                ) : (
                    displayPosts.map(post => {
                        const displayDate = new Date(post.updatedAt || post.createdAt).toLocaleString("vi-VN");
                        const hasBeenUpdated = isPostUpdated(post);

                        let categoryInfo = "";
                        let categoryIcon = null;

                        if (post.category === "food") {
                            categoryInfo = "Ẩm thực";
                            categoryIcon = <FaUtensils className="category-icon food-icon" />;
                        } else if (post.category === "event") {
                            categoryInfo = "Sự kiện";
                            categoryIcon = <FaCalendarDay className="category-icon event-icon" />;
                        } else if (post.category === "story") {
                            categoryInfo = "Câu chuyện";
                            categoryIcon = <BiBookOpen className="category-icon story-icon" />;
                        }
                        else {
                            categoryInfo = "Bài viết chung";
                            categoryIcon = <FaNewspaper className="category-icon general-icon" />;
                        }

                        return (
                            <div className={`post-card ${post.category || 'general'}-post`} key={post._id}>
                                <div className="post-card-header">
                                    <h3 className="post-title">{post.title}</h3>
                                    <div className="post-category">
                                        {categoryIcon}
                                        <span>{categoryInfo}</span>
                                    </div>
                                </div>

                                <div className="post-card-images">
                                    {post.images && post.images.length > 0 ? (
                                        <div className="post-image">
                                            <img
                                                src={getImageUrl(post.images[0])}
                                                alt="Hình ảnh bài viết"
                                                onClick={() => setSelectedImage(post.images)}
                                            />
                                        </div>
                                    ) : (
                                        <div className="no-image">Không có ảnh</div>
                                    )}
                                </div>

                                <div className="post-card-date">
                                    <p className="post-date">
                                        <FaCalendarAlt className="date-icon" /> {displayDate}
                                        {hasBeenUpdated && (
                                            <span className="updated-indicator flex">
                                                <FaEdit className="update-icon" title="Đã cập nhật" /> Đã cập nhật
                                            </span>
                                        )}
                                    </p>
                                </div>

                                <div className="post-card-actions">
                                    <button className="edit-btn" onClick={() => navigate(`/admin/posts/edit/${post._id}`)}>Sửa</button>
                                    <button className="delete-btn" onClick={() => handleDelete(post._id)}>Xóa</button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default AdminPosts;