import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PostDetail from "./pages/PostDetail";
import ChatBox from "./components/ChatBox";
import AdminDashboard from "./pages/AdminDashboard";
import AdminHeader from "./components/AdminHeader";
function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios.get("http://localhost:5000/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      }).then(res => {
        setUser(res.data);
      }).catch(err => {
        console.error("Lỗi khi lấy thông tin người dùng:", err);
        localStorage.removeItem("token");
      });
    }
  }, []);

  return (
    <Router>
      <MainLayout user={user} setUser={setUser} />
    </Router>
  );
}

function MainLayout({ user, setUser }) {
  const location = useLocation();

  // Xác định các trang không cần Header & Footer
  const noHeaderFooter = ["/login", "/register"].includes(location.pathname);
  const isAdminPage = location.pathname.startsWith("/admin"); // Kiểm tra nếu là trang admin

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hiển thị Navbar nếu không phải trang admin hoặc login/register */}
      {!noHeaderFooter && !isAdminPage && (
        <header className="fixed top-0 left-0 right-0 z-50">
          <Navbar user={user} setUser={setUser} />
        </header>
      )}

      {/* Admin Header riêng */}
      {isAdminPage && <AdminHeader user={user} setUser={setUser} />}

      <main className={`flex-grow ${!noHeaderFooter && !isAdminPage ? 'mt-16' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/posts/:id" element={<PostDetail user={user} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register setUser={setUser} />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>

      {/* Hiển thị Footer và ChatBox nếu không phải trang admin hoặc login/register */}
      {!noHeaderFooter && !isAdminPage && <Footer />}
      {!noHeaderFooter && !isAdminPage && <ChatBox />}
    </div>
  );
}

export default App;