import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import "../styles/navbar.css";


const Navbar = ({ user, setUser }) => {
    const handleLogout = () => {
        localStorage.removeItem("token");
        setUser(null);
        // Thêm logic đăng xuất tại đây nếu cần
    };

    return (
        <nav className="navbar">
            <div className="container mx-auto max-w-screen-xl flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold hover:text-gray-200">QuangNamTravel</Link>
                <div className="flex-1 flex justify-center">
                    <div className="space-x-12">
                        <Link to="/" className="text-xl hover:text-gray-200">Trang chủ</Link>
                        <Link to="/explore" className="text-xl hover:text-gray-200">Khám phá</Link>
                        <Link to="/news" className="text-xl hover:text-gray-200">Tin tức</Link>
                        <Link to="/contact" className="text-xl hover:text-gray-200">Liên hệ</Link>
                    </div>
                </div>
                {user ? (
                    <div className="user-info">
                        <FaUserCircle className="user-icon" />
                        <span>{user.userName}</span>
                        <button onClick={handleLogout} className="logout-button">Đăng xuất</button>
                    </div>
                ) : (
                    <Link to="/login" className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">Đăng nhập</Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;