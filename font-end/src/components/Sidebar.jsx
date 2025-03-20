import { useNavigate, useLocation } from "react-router-dom";
import {
    Users, FileText, MessageSquare,
    Settings, Home, Map, Award,
    Image, ThumbsUp, LogOut
} from "lucide-react";
import "../styles/Sidebar.css";

const Sidebar = ({ activeTab, setActiveTab }) => {
    const navigate = useNavigate();

    // Cập nhật activeTab dựa trên đường dẫn hiện tại
    const updateActiveTab = (tab) => {
        setActiveTab(tab);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="admin-sidebar">
            <nav className="sidebar-nav">
                <button
                    className={`nav-item ${activeTab === "dashboard" ? "active" : ""}`}
                    onClick={() => {
                        updateActiveTab("dashboard");
                        navigate("/admin");
                    }}
                >
                    <Home size={20} />
                    <span>Tổng quan</span>
                </button>

                <button
                    className={`nav-item ${activeTab === "posts" ? "active" : ""}`}
                    onClick={() => {
                        updateActiveTab("posts");
                        navigate("/admin/posts");
                    }}
                >
                    <FileText size={20} />
                    <span>Quản lý bài viết</span>
                </button>

                <button
                    className={`nav-item ${activeTab === "users" ? "active" : ""}`}
                    onClick={() => {
                        updateActiveTab("users");
                        navigate("/admin/users");
                    }}
                >
                    <Users size={20} />
                    <span>Quản lý người dùng</span>
                </button>

                <button
                    className={`nav-item ${activeTab === "comments" ? "active" : ""}`}
                    onClick={() => {
                        updateActiveTab("comments");
                        navigate("/admin/comments");
                    }}
                >
                    <MessageSquare size={20} />
                    <span>Quản lý bình luận</span>
                </button>

                <button
                    className={`nav-item ${activeTab === "attractions" ? "active" : ""}`}
                    onClick={() => {
                        updateActiveTab("attractions");
                        navigate("/admin/attractions");
                    }}
                >
                    <Map size={20} />
                    <span>Địa điểm du lịch</span>
                </button>

                <button
                    className={`nav-item ${activeTab === "media" ? "active" : ""}`}
                    onClick={() => {
                        updateActiveTab("media");
                        navigate("/admin/media");
                    }}
                >
                    <Image size={20} />
                    <span>Quản lý media</span>
                </button>

                <button
                    className={`nav-item ${activeTab === "events" ? "active" : ""}`}
                    onClick={() => {
                        updateActiveTab("events");
                        navigate("/admin/events");
                    }}
                >
                    <Award size={20} />
                    <span>Sự kiện & lễ hội</span>
                </button>

                <button
                    className={`nav-item ${activeTab === "reviews" ? "active" : ""}`}
                    onClick={() => {
                        updateActiveTab("reviews");
                        navigate("/admin/reviews");
                    }}
                >
                    <ThumbsUp size={20} />
                    <span>Đánh giá & xếp hạng</span>
                </button>

                <button
                    className={`nav-item ${activeTab === "settings" ? "active" : ""}`}
                    onClick={() => {
                        updateActiveTab("settings");
                        navigate("/admin/settings");
                    }}
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
    );
};

export default Sidebar;