import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Register.css";
const Register = ({ setUser }) => {
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            const res = await axios.post("http://localhost:5000/api/auth/register", {
                userName,
                email,
                password,
                phoneNumber
            }, {
                headers: { "Content-Type": "application/json" }
            });

            // Lưu token vào localStorage (nếu server trả về)
            if (res.data.token) {
                localStorage.setItem("token", res.data.token);
            }

            // Điều hướng đến trang đăng nhập
            navigate("/login");
        } catch (error) {
            setError(error?.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại!");
            console.error("Đăng ký thất bại:", error?.response?.data?.message || "Lỗi không xác định!");
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h2 className="register-title">Đăng ký</h2>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
                    <div className="form-group">
                        <label htmlFor="userName" className="input-label">Tên người dùng</label>
                        <input
                            type="text"
                            id="userName"
                            placeholder="Nhập tên của bạn"
                            className="input-field"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            required
                        />
                    </div>

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
                            placeholder="Tạo mật khẩu"
                            className="input-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phoneNumber" className="input-label">Số điện thoại</label>
                        <input
                            type="text"
                            id="phoneNumber"
                            placeholder="Nhập số điện thoại"
                            className="input-field"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="register-button"
                    >
                        Đăng ký
                    </button>
                </form>

                <div className="login-link-container">
                    <p className="login-text">
                        Đã có tài khoản? <Link to="/login" className="login-link">Đăng nhập</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;