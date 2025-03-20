import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import {
    Users, FileText, MessageSquare,
    Settings, Map, Award
} from "lucide-react";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
    const [locations, setLocations] = useState([]);
    const [comments, setComments] = useState([]);
    const [ratings, setRatings] = useState([]);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [locationsRes, commentsRes, ratingsRes, postsRes] = await Promise.all([
                    axios.get("http://localhost:5000/api/locations"),
                    axios.get("http://localhost:5000/api/comments"),
                    axios.get("http://localhost:5000/api/ratings"),
                    axios.get("http://localhost:5000/api/posts")
                ]);

                setLocations(locationsRes.data);
                setComments(commentsRes.data);
                setRatings(ratingsRes.data);
                setPosts(postsRes.data);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const notifications = [
        { id: 1, text: "Có 5 bình luận mới cần phê duyệt", time: "10 phút trước" },
        { id: 2, text: "Người dùng mới đăng ký: Nguyen Van A", time: "30 phút trước" },
        { id: 3, text: "Báo cáo thống kê tháng đã sẵn sàng", time: "2 giờ trước" }
    ];

    if (loading) {
        return <div>Đang tải...</div>;
    }

    return (
        <div className="admin-dashboard-wrapper">
            <div className="admin-content">
                <div className="content-header">
                    <h1>Bảng điều khiển quản trị</h1>
                    <div className="time-filter">
                        <select defaultValue="7days">
                            <option value="today">Hôm nay</option>
                            <option value="7days">7 ngày qua</option>
                            <option value="month">Tháng này</option>
                            <option value="year">Năm nay</option>
                        </select>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="stats-container">
                    <div className="stat-box">
                        <div className="stat-icon tourist">
                            <Map size={24} />
                        </div>
                        <div className="stat-info">
                            <h3>{locations.length}</h3>
                            <p>Địa điểm du lịch</p>
                            <span className="trend positive">+12% so với tháng trước</span>
                        </div>
                    </div>

                    <div className="stat-box">
                        <div className="stat-icon articles">
                            <FileText size={24} />
                        </div>
                        <div className="stat-info">
                            <h3>{posts.length}</h3>
                            <p>Bài viết</p>
                            <span className="trend positive">+5% so với tháng trước</span>
                        </div>
                    </div>

                    <div className="stat-box">
                        <div className="stat-icon comments-admin">
                            <MessageSquare size={24} />
                        </div>
                        <div className="stat-info">
                            <h3>{comments.length}</h3>
                            <p>Bình luận & đánh giá</p>
                            <span className="trend positive">+18% so với tháng trước</span>
                        </div>
                    </div>

                    <div className="stat-box">
                        <div className="stat-icon users">
                            <Users size={24} />
                        </div>
                        <div className="stat-info">
                            <h3>{ratings.length}</h3>
                            <p>Người dùng</p>
                            <span className="trend positive">+8% so với tháng trước</span>
                        </div>
                    </div>
                </div>

                {/* Charts and Additional Data */}
                <div className="dashboard-sections">
                    <div className="data-section">
                        <div className="top-posts">
                            <h2>Bài viết được yêu thích nhất</h2>
                            <ul className="ranking-list">
                                {posts.slice(0, 5).map((post, index) => (
                                    <li key={post._id}>
                                        <span className="rank">{index + 1}</span>
                                        <span className="name">{post.title}</span>
                                        <span className="value">{post.rating} ⭐</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className="notification-section">
                        <h2>Thông báo mới nhất</h2>
                        <ul className="notification-list">
                            {notifications.map(notification => (
                                <li key={notification.id}>
                                    <div className="notification-content">
                                        <p>{notification.text}</p>
                                        <span className="notification-time">{notification.time}</span>
                                    </div>
                                    <button className="view-button">Xem</button>
                                </li>
                            ))}
                        </ul>
                        <button className="see-all-button">Xem tất cả thông báo</button>
                    </div>

                    <div className="quick-actions">
                        <h2>Thao tác nhanh</h2>
                        <div className="action-buttons">
                            <button className="action-button">
                                <FileText size={20} />
                                <span>Thêm bài viết</span>
                            </button>
                            <button className="action-button">
                                <Map size={20} />
                                <span>Thêm địa điểm</span>
                            </button>
                            <button className="action-button">
                                <Award size={20} />
                                <span>Tạo sự kiện</span>
                            </button>
                            <button className="action-button">
                                <Settings size={20} />
                                <span>Cài đặt</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
