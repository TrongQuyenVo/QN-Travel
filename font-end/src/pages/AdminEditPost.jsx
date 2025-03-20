import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "../styles/AdminEditPost.css";

const AdminEditPost = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState(null);
    const [currentImage, setCurrentImage] = useState("");
    const [locationID, setLocationID] = useState("");
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();

    const postId = id || (location.state && location.state.postId);

    useEffect(() => {
        const fetchData = async () => {
            if (!postId) {
                console.error("Không có ID bài viết được cung cấp");
                alert("Không tìm thấy ID bài viết.");
                navigate("/admin/posts");
                return;
            }

            try {
                setLoading(true);
                const postRes = await axios.get(`http://localhost:5000/api/posts/${postId}`);
                const post = postRes.data;

                setTitle(post.title);
                setContent(post.content);
                setLocationID(post.locationID?.$oid || post.locationID);
                setCurrentImage(post.image ? post.image.replace(/^.*[\\\/]/, "") : "");

                const locationsRes = await axios.get("http://localhost:5000/api/locations");
                setLocations(locationsRes.data);

                setLoading(false);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu bài viết:", error);
                alert("Không thể tải dữ liệu bài viết.");
                navigate("/admin/posts");
            }
        };

        fetchData();
    }, [postId, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!postId) {
            alert("Không tìm thấy ID bài viết.");
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('locationID', locationID);
        if (image) {
            formData.append('image', image);
        }

        try {
            await axios.put(`http://localhost:5000/api/posts/${postId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert("Bài viết đã được cập nhật!");
            navigate("/admin/posts", { state: { updated: true } });
        } catch (error) {
            console.error("Lỗi khi cập nhật bài viết:", error.response?.data || error.message);
        }
    };

    if (loading) {
        return <div className="loading">Đang tải dữ liệu...</div>;
    }

    return (
        <div className="admin-edit-post">
            <h1>Chỉnh sửa bài viết</h1>
            <form onSubmit={handleSubmit}>
                <label>Tiêu đề:</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />

                <label>Nội dung:</label>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} required />

                <label>Hình ảnh hiện tại:</label>
                {currentImage && (
                    <div className="current-image">
                        <img
                            src={`http://localhost:5000/uploads/${currentImage}`}
                            alt="Hình ảnh hiện tại"
                            onError={(e) => {
                                console.error("Lỗi tải hình:", e);
                                console.log("Đường dẫn hình:", `http://localhost:5000/uploads/${currentImage}`);
                            }}
                            style={{ maxWidth: "200px", marginBottom: "10px" }}
                        />
                    </div>
                )}

                <label>Thay đổi hình ảnh (không bắt buộc):</label>
                <input type="file" onChange={(e) => setImage(e.target.files[0])} />

                <label>Địa điểm:</label>
                <select value={locationID} onChange={(e) => setLocationID(e.target.value)} required>
                    <option value="">Chọn địa điểm</option>
                    {locations.map(location => (
                        <option key={location._id} value={location._id}>{location.name}</option>
                    ))}
                </select>

                <div className="button-group">
                    <button type="submit">Cập nhật bài viết</button>
                    <button type="button" onClick={() => navigate("/admin/posts")} className="cancel-button">Hủy</button>
                </div>
            </form>
        </div>
    );
};

export default AdminEditPost;
