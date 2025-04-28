import React from "react";  // Add this line
import { useNavigate } from "react-router-dom";
import {
    Users, FileText, MessageSquare,
    Settings, Home, Map, Award,
    Image, ThumbsUp, LogOut
} from "lucide-react";
import "../styles/Sidebar.css";

const Sidebar = ({ activeTab, setActiveTab }) => {
    const navigate = useNavigate();

    const updateActiveTab = (tab) => {
        setActiveTab(tab);
        localStorage.setItem("activeTab", tab);
    };

    // Hàm đăng xuất
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("activeTab");
        navigate("/login");
    };

    React.useEffect(() => {
        const storedTab = localStorage.getItem("activeTab");
        if (storedTab) {
            setActiveTab(storedTab);
        } else {
            setActiveTab("dashboard");
        }
    }, [setActiveTab]);

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

                {/* <button
                    className={`nav-item ${activeTab === "users" ? "active" : ""}`}
                    onClick={() => {
                        updateActiveTab("users");
                        navigate("/admin/users");
                    }}
                >
                    <Users size={20} />
                    <span>Quản lý người dùng</span>
                </button> */}

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
