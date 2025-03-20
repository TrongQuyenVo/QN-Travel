import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaCalendarAlt, FaSyncAlt } from "react-icons/fa";
import "../styles/AdminPost.css";

const AdminPosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null); // State để hiển thị ảnh
    const navigate = useNavigate();

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
            }
        }
    };

    if (loading) {
        return <div className="loading-container">Đang tải dữ liệu...</div>;
    }

    return (
        <div className="admin-posts-container">
            <div className="admin-posts-header">
                <h1 className="page-title">Quản lý bài viết</h1>
                <button className="add-post-btn" onClick={() => navigate("/admin/posts/new")}>
                    + Thêm bài viết mới
                </button>
            </div>

            {posts.length === 0 ? (
                <div className="no-posts-message">Không có bài viết nào.</div>
            ) : (
                <div className="posts-list">
                    {posts.map(post => {
                        const updatedAt = new Date(post.updatedAt || post.createdAt).toLocaleString("vi-VN");
                        const isUpdated = post.updatedAt && post.updatedAt !== post.createdAt;

                        return (
                            <div className="post-card" key={post._id}>
                                <div className="post-card-image">
                                    {post.image ? (
                                        <img
                                            src={`http://localhost:5000/uploads/${post.image.replace(/^.*[\\\/]/, "")}`}
                                            alt="Hình ảnh bài viết"
                                            onError={(e) => { e.target.src = "/placeholder-image.jpg"; }}
                                            onClick={() => setSelectedImage(post.image)} // Nhấn vào để xem lớn
                                        />
                                    ) : (
                                        <span>Không có ảnh</span>
                                    )}
                                </div>
                                <div className="post-card-content">
                                    <h3>{post.title}</h3>
                                </div>
                                <div className="post-card-text">
                                    <p dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, "<br/>") }} />
                                </div>
                                <div className="post-card-date">
                                    <p className="post-date">
                                        <FaCalendarAlt /> {updatedAt}{" "}
                                        {isUpdated && <FaSyncAlt className="update-icon" title="Đã cập nhật" />}
                                    </p>
                                </div>
                                <div className="post-card-actions">
                                    <button className="edit-btn" onClick={() => navigate(`/admin/posts/edit/${post._id}`)}>Sửa</button>
                                    <button className="delete-btn" onClick={() => handleDelete(post._id)}>Xóa</button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Hiển thị ảnh lớn khi nhấn vào */}
            {selectedImage && (
                <div className="image-modal" onClick={() => setSelectedImage(null)}>
                    <div className="modal-content">
                        <img
                            src={`http://localhost:5000/uploads/${selectedImage.replace(/^.*[\\\/]/, "")}`}
                            alt="Hình ảnh phóng to"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPosts;
