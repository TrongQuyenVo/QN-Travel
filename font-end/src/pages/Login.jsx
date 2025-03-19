import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Login.css";
const Login = ({ setUser }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
            localStorage.setItem("token", res.data.token);

            // Gọi API để lấy thông tin user mới nhất
            const userRes = await axios.get("http://localhost:5000/api/auth/me", {
                headers: { Authorization: `Bearer ${res.data.token}` }
            });

            setUser(userRes.data);

            // Nếu là admin, chuyển đến trang quản lý
            if (userRes.data.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/");
            }
        } catch (error) {
            console.error("Đăng nhập thất bại:", error.response?.data?.message || error.message);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">Đăng nhập</h2>

                <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                    <div className="form-group">
                        <label htmlFor="email" className="input-label">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Nhập địa chỉ email"
                            className="input-field"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="input-label">Mật khẩu</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Nhập mật khẩu"
                            className="input-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="login-button"
                    >
                        Đăng nhập
                    </button>
                </form>

                <div className="register-link-container">
                    <p className="register-text">
                        Chưa có tài khoản? <Link to="/register" className="register-link">Đăng ký</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;