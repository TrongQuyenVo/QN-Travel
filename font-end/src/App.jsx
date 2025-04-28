import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Home from "./pages/Home";
import ContactPages from "./pages/Contact";
import Explore from "./pages/Explore";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PostDetail from "./pages/PostDetail";
import ChatBox from "./components/ChatBox";
import AdminDashboard from "./pages/AdminDashboard";
import AdminHeader from "./components/AdminHeader";
import Sidebar from "./components/Sidebar";
import AdminPosts from "./pages/AdminPosts";
import AdminAddPost from "./pages/AdminAddPost";
import AdminEditPost from "./pages/AdminEditPost";
import AdminLocations from "./pages/AdminLocations";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
        setUser(null);
      }).finally(() => {
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <Router>
      <MainLayout user={user} setUser={setUser} loading={loading} />
    </Router>
  );
}

function MainLayout({ user, setUser, loading }) {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("posts"); // Mặc định là "posts" thay vì "dashboard"

  const noHeaderFooter = ["/login", "/register"].includes(location.pathname);
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header: Hiển thị AdminHeader nếu là trang admin, Navbar nếu không */}
      {!noHeaderFooter && (
        <header className="fixed top-0 left-0 right-0 z-50">
          {isAdminPage ? <AdminHeader user={user} setUser={setUser} /> : <Navbar user={user} setUser={setUser} />}
        </header>
      )}

      <div className="flex flex-grow">
        {/* Sidebar chỉ hiển thị ở trang admin */}
        {isAdminPage && <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />}

        <main className={`flex-grow ${isAdminPage || noHeaderFooter ? '' : 'mt-16 pb-8'}`}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/contact" element={<ContactPages />} />

            <Route path="/posts/:id" element={<PostDetail user={user} />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register setUser={setUser} />} />
            <Route
              path="/admin"
              element={
                loading ? (
                  <div>Loading...</div>
                ) : user?.role === "admin" ? (
                  <AdminDashboard />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/admin/attractions"
              element={
                loading ? (
                  <div>Loading...</div>
                ) : user?.role === "admin" ? (
                  <AdminLocations />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/admin/posts"
              element={
                loading ? (
                  <div>Loading...</div>
                ) : user?.role === "admin" ? (
                  <AdminPosts />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/admin/posts/new"
              element={
                loading ? (
                  <div>Loading...</div>
                ) : user?.role === "admin" ? (
                  <AdminAddPost />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/admin/posts/edit/:id"
              element={
                loading ? (
                  <div>Loading...</div>
                ) : user?.role === "admin" ? (
                  <AdminEditPost />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
          </Routes>
        </main>
      </div>

      {/* Footer & ChatBox chỉ hiển thị khi không ở trang admin hoặc login/register */}
      {!noHeaderFooter && !isAdminPage && (
        <footer className="mt-auto">
          <Footer />
        </footer>
      )}
      {!noHeaderFooter && !isAdminPage && <ChatBox />}
    </div>
  );
}


export default App;