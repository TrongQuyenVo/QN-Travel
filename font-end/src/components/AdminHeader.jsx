import "../styles/AdminHeader.css"; // Import file CSS
import { Bell } from "lucide-react";
import { FaUserCircle } from "react-icons/fa";

const AdminHeader = ({ user }) => {

    return (
        <header className="admin-header">
            <div className="logo-container">
                <h1>QN Admin</h1>
            </div>
            <div className="header-actions">
                <div className="search-bar">
                    <input type="text" placeholder="Tìm kiếm..." />
                </div>
                <div className="notifications">
                    <Bell size={20} />
                    <span className="notification-badge">3</span>
                </div>
                {user ? (
                    <div className="user-info-admin">
                        <FaUserCircle className="user-icon-admin" />
                        <span>{user.userName}</span>
                    </div>
                ) : null}
            </div>
        </header>
    );
};

export default AdminHeader;
