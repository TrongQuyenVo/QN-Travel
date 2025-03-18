import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

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
            console.error("Đăng ký thất bại:", error?.response?.data?.message || "Lỗi không xác định!");
        }
    };


    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center">Đăng ký</h2>

                {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

                <form onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
                    <div className="mb-4">
                        <label htmlFor="userName" className="block text-gray-700">Tên người dùng</label>
                        <input
                            type="text"
                            id="userName"
                            placeholder="Tên người dùng"
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Email"
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-gray-700">Mật khẩu</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Mật khẩu"
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="phoneNumber" className="block text-gray-700">Số điện thoại</label>
                        <input
                            type="text"
                            id="phoneNumber"
                            placeholder="Số điện thoại"
                            className="w-full p-2 border border-gray-300 rounded mt-1"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
                    >
                        Đăng ký
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <p className="text-gray-700">
                        Đã có tài khoản? <Link to="/login" className="text-blue-500 hover:underline">Đăng nhập</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
