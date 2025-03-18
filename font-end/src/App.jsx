import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
// import News from "./pages/News";
// import Contact from "./pages/Contact";
// import PostDetail from "./pages/PostDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PostDetail from "./pages/PostDetail";
import ChatBox from "./components/ChatBox"; // Import ChatBox

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Giả sử bạn có một API để lấy thông tin người dùng từ token
      axios.get("http://localhost:5000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(res => {
        setUser(res.data);
      }).catch(err => {
        console.error("Lỗi khi lấy thông tin người dùng:", err);
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
  const noHeaderFooter = location.pathname === "/login" || location.pathname === "/register";

  return (
    <div className="flex flex-col min-h-screen">
      {!noHeaderFooter && (
        <header className="fixed top-0 left-0 right-0 z-50">
          <Navbar user={user} setUser={setUser} />
        </header>
      )}
      <main className={`flex-grow ${!noHeaderFooter ? 'mt-16' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          {/* <Route path="/news" element={<News />} />
          <Route path="/contact" element={<Contact />} /> */}
          <Route path="/posts/:id" element={<PostDetail user={user} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register setUser={setUser} />} />
        </Routes>
      </main>
      {!noHeaderFooter && (
        <footer className="mt-auto">
          <Footer />
        </footer>
      )}
      {!noHeaderFooter && <ChatBox />} {/* Thêm ChatBox */}
    </div>
  );
}

export default App;