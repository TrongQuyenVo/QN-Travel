import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/AdminAddPost.css";

const AdminAddPost = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState(null);
    const [locationID, setLocationID] = useState("");
    const [locations, setLocations] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/locations");
                setLocations(res.data);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách địa điểm:", error);
            }
        };

        fetchLocations();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('content', content);
        formData.append('locationID', locationID);
        if (image) {
            formData.append('image', image);
        }

        try {
            await axios.post("http://localhost:5000/api/posts", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert("Bài viết đã được thêm!");
            navigate("/admin/posts");
        } catch (error) {
            console.error("Lỗi khi thêm bài viết:", error.response.data);
        }
    };

    return (
        <div className="admin-add-post">
            <h1>Thêm bài viết mới</h1>
            <form onSubmit={handleSubmit}>
                <label>Tiêu đề:</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />

                <label>Nội dung:</label>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} required />

                <label>Hình ảnh:</label>
                <input type="file" onChange={(e) => setImage(e.target.files[0])} />

                <label>Địa điểm:</label>
                <select value={locationID} onChange={(e) => setLocationID(e.target.value)} required>
                    <option value="">Chọn địa điểm</option>
                    {locations.map(location => (
                        <option key={location._id} value={location._id}>{location.name}</option>
                    ))}
                </select>

                <button type="submit">Thêm bài viết</button>
            </form>
        </div>
    );
};

export default AdminAddPost;