import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
    Users, FileText, MessageSquare,
    Settings, Home, Map, Award,
    Image, ThumbsUp, LogOut
} from "lucide-react";
import logo from "../assets/Logo.png";
import "../styles/AdminDashboard.css";
const AdminDashboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("dashboard");
    const handleLogout = () => {
        localStorage.removeItem("token"); // Xóa token
        navigate("/login"); // Chuyển hướng về trang đăng nhập
    };

    const notifications = [
        { id: 1, text: "Có 5 bình luận mới cần phê duyệt", time: "10 phút trước" },
        { id: 2, text: "Người dùng mới đăng ký: Nguyen Van A", time: "30 phút trước" },
        { id: 3, text: "Báo cáo thống kê tháng đã sẵn sàng", time: "2 giờ trước" }
    ];

    return (
        <div className="admin-dashboard">
            <div className="admin-container">
                {/* Sidebar */}
                <div className="admin-sidebar">
                    <div className="sidebar-header">
                        <img src={logo} alt="Logo" className="logo" />
                    </div>

                    <nav className="sidebar-nav">
                        <button
                            className={`nav-item ${activeTab === "dashboard" ? "active" : ""}`}
                            onClick={() => setActiveTab("dashboard")}
                        >
                            <Home size={20} />
                            <span>Tổng quan</span>
                        </button>

                        <button
                            className={`nav-item ${activeTab === "posts" ? "active" : ""}`}
                            onClick={() => navigate("/admin/posts")}
                        >
                            <FileText size={20} />
                            <span>Quản lý bài viết</span>
                        </button>

                        <button
                            className={`nav-item ${activeTab === "users" ? "active" : ""}`}
                            onClick={() => navigate("/admin/users")}
                        >
                            <Users size={20} />
                            <span>Quản lý người dùng</span>
                        </button>

                        <button
                            className={`nav-item ${activeTab === "comments" ? "active" : ""}`}
                            onClick={() => navigate("/admin/comments")}
                        >
                            <MessageSquare size={20} />
                            <span>Quản lý bình luận</span>
                        </button>

                        <button
                            className={`nav-item ${activeTab === "attractions" ? "active" : ""}`}
                            onClick={() => navigate("/admin/attractions")}
                        >
                            <Map size={20} />
                            <span>Địa điểm du lịch</span>
                        </button>

                        <button
                            className={`nav-item ${activeTab === "media" ? "active" : ""}`}
                            onClick={() => navigate("/admin/media")}
                        >
                            <Image size={20} />
                            <span>Quản lý media</span>
                        </button>

                        <button
                            className={`nav-item ${activeTab === "events" ? "active" : ""}`}
                            onClick={() => navigate("/admin/events")}
                        >
                            <Award size={20} />
                            <span>Sự kiện & lễ hội</span>
                        </button>

                        <button
                            className={`nav-item ${activeTab === "reviews" ? "active" : ""}`}
                            onClick={() => navigate("/admin/reviews")}
                        >
                            <ThumbsUp size={20} />
                            <span>Đánh giá & xếp hạng</span>
                        </button>

                        <button
                            className={`nav-item ${activeTab === "settings" ? "active" : ""}`}
                            onClick={() => navigate("/admin/settings")}
                        >
                            <Settings size={20} />
                            <span>Cài đặt hệ thống</span>
                        </button>
                    </nav>

                    <div className="sidebar-footer">
                        <button className="logout-button" onClick={handleLogout}>
                            <LogOut size={20} />
                            <span>Đăng xuất</span>
                        </button>
                    </div>
                </div>

                {/* Main Content */}
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
                                <h3>128</h3>
                                <p>Địa điểm du lịch</p>
                                <span className="trend positive">+12% so với tháng trước</span>
                            </div>
                        </div>

                        <div className="stat-box">
                            <div className="stat-icon articles">
                                <FileText size={24} />
                            </div>
                            <div className="stat-info">
                                <h3>753</h3>
                                <p>Bài viết</p>
                                <span className="trend positive">+5% so với tháng trước</span>
                            </div>
                        </div>

                        <div className="stat-box">
                            <div className="stat-icon comments-admin">
                                <MessageSquare size={24} />
                            </div>
                            <div className="stat-info">
                                <h3>2,458</h3>
                                <p>Bình luận & đánh giá</p>
                                <span className="trend positive">+18% so với tháng trước</span>
                            </div>
                        </div>

                        <div className="stat-box">
                            <div className="stat-icon users">
                                <Users size={24} />
                            </div>
                            <div className="stat-info">
                                <h3>3,872</h3>
                                <p>Người dùng</p>
                                <span className="trend positive">+8% so với tháng trước</span>
                            </div>
                        </div>
                    </div>

                    {/* Charts and Additional Data */}
                    <div className="dashboard-sections">
                        <div className="data-section">
                            <div className="top-destinations">
                                <h2>Địa điểm được yêu thích</h2>
                                <ul className="ranking-list">
                                    <li>
                                        <span className="rank">1</span>
                                        <span className="name">Phố cổ Hội An</span>
                                        <span className="value">4.9 ⭐</span>
                                    </li>
                                    <li>
                                        <span className="rank">2</span>
                                        <span className="name">Thánh địa Mỹ Sơn</span>
                                        <span className="value">4.8 ⭐</span>
                                    </li>
                                    <li>
                                        <span className="rank">3</span>
                                        <span className="name">Cù Lao Chàm</span>
                                        <span className="value">4.7 ⭐</span>
                                    </li>
                                    <li>
                                        <span className="rank">4</span>
                                        <span className="name">Rừng dừa Bảy Mẫu</span>
                                        <span className="value">4.6 ⭐</span>
                                    </li>
                                    <li>
                                        <span className="rank">5</span>
                                        <span className="name">Làng gốm Thanh Hà</span>
                                        <span className="value">4.5 ⭐</span>
                                    </li>
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
        </div>
    );
};

export default AdminDashboard;