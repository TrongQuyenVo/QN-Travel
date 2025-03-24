import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { FaTrash, FaPlus } from "react-icons/fa";
import "../styles/AdminEditPost.css";

const AdminEditPost = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [newImages, setNewImages] = useState([]);
    const [currentImages, setCurrentImages] = useState([]);
    const [imagesToDelete, setImagesToDelete] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [locationID, setLocationID] = useState("");
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Thêm state cho các danh mục
    const [category, setCategory] = useState("general");
    // Các trường cho danh mục ẩm thực
    const [cuisine, setCuisine] = useState("");
    const [priceRange, setPriceRange] = useState("");
    // Các trường cho danh mục sự kiện
    const [eventDate, setEventDate] = useState("");
    const [eventEndDate, setEventEndDate] = useState("");

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

                // Thiết lập danh mục
                if (post.category) {
                    setCategory(post.category);

                    // Thiết lập các giá trị của danh mục tương ứng
                    if (post.category === "food") {
                        setCuisine(post.cuisine || "");
                        setPriceRange(post.priceRange || "");
                    } else if (post.category === "event") {
                        setEventDate(post.eventDate || "");
                        setEventEndDate(post.eventEndDate || "");
                    }
                }

                // Xử lý danh sách ảnh hiện tại
                if (post.images && post.images.length > 0) {
                    setCurrentImages(post.images);
                } else if (post.image) {
                    // Trường hợp sử dụng thuộc tính image cũ
                    setCurrentImages([post.image]);
                }

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

    // Xử lý thêm ảnh mới
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        // Thêm vào state newImages để lưu trữ file ảnh mới
        setNewImages([...newImages, ...files]);

        // Tạo URL preview cho các ảnh mới
        const newPreviewImages = files.map(file => ({
            url: URL.createObjectURL(file),
            name: file.name
        }));

        setPreviewImages([...previewImages, ...newPreviewImages]);
    };

    // Xóa ảnh hiện tại
    const handleDeleteCurrentImage = (index) => {
        const imageToDelete = currentImages[index];
        setImagesToDelete([...imagesToDelete, imageToDelete]);

        const updatedCurrentImages = [...currentImages];
        updatedCurrentImages.splice(index, 1);
        setCurrentImages(updatedCurrentImages);
    };

    // Xóa ảnh mới thêm vào
    const handleDeleteNewImage = (index) => {
        // Xóa khỏi danh sách ảnh mới
        const updatedNewImages = [...newImages];
        updatedNewImages.splice(index, 1);
        setNewImages(updatedNewImages);

        // Xóa khỏi danh sách preview
        const updatedPreviews = [...previewImages];
        URL.revokeObjectURL(updatedPreviews[index].url); // Giải phóng memory
        updatedPreviews.splice(index, 1);
        setPreviewImages(updatedPreviews);
    };
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
        formData.append('category', category);

        // Thêm trường dựa trên danh mục
        if (category === "food") {
            formData.append("cuisine", cuisine);
            formData.append("priceRange", priceRange);
        } else if (category === "event") {
            formData.append("eventDate", eventDate);
            if (eventEndDate) {
                formData.append("eventEndDate", eventEndDate);
            }
        }

        // Thêm các ảnh mới vào formData
        newImages.forEach(file => {
            formData.append('images', file);
        });

        // Thêm danh sách ảnh cần xóa
        if (imagesToDelete.length > 0) {
            formData.append('imagesToDelete', JSON.stringify(imagesToDelete));
        }

        // Thêm danh sách ảnh hiện tại cần giữ lại
        formData.append('currentImages', JSON.stringify(currentImages));

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

    // Xem ảnh phóng to
    const handleViewImage = (images, index) => {
        setSelectedImage(images);
        setCurrentImageIndex(index);
    };

    if (loading) {
        return <div className="loading">Đang tải dữ liệu...</div>;
    }

    return (
        <div className="admin-edit-post">
            <h1 className="edit-header">Chỉnh sửa bài viết</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Tiêu đề:</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>

                <div className="form-group">
                    <label>Danh mục:</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="category-select"
                    >
                        <option value="general">Bài viết chung</option>
                        <option value="food">Ẩm thực</option>
                        <option value="event">Sự kiện</option>
                        <option value="story">Câu chuyện</option>
                    </select>
                </div>



                <div className="form-group">
                    <label>Nội dung:</label>
                    <textarea value={content} onChange={(e) => setContent(e.target.value)} required />
                </div>

                <div className="form-group">
                    <label>Hình ảnh hiện tại:</label>
                    <div className="images-container">
                        {currentImages.length > 0 ? (
                            <div className="image-grid">
                                {currentImages.map((img, idx) => (
                                    <div className="image-item" key={`current-${idx}`}>
                                        <div className="image-preview">
                                            <img
                                                src={`http://localhost:5000/uploads/${img.replace(/^.*[\\\/]/, "")}`}
                                                alt={`Hình ảnh ${idx + 1}`}
                                                onClick={() => handleViewImage(currentImages, idx)}
                                                onError={(e) => { e.target.src = "/placeholder-image.jpg"; }}
                                            />
                                            <button
                                                type="button"
                                                className="delete-image"
                                                onClick={() => handleDeleteCurrentImage(idx)}
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>Không có ảnh nào.</p>
                        )}
                    </div>
                </div>

                <div className="form-group">
                    <label>Thêm hình ảnh mới:</label>
                    <div className="file-input-container">
                        <input
                            type="file"
                            id="image-upload"
                            className="file-input"
                            onChange={handleImageChange}
                            multiple
                        />
                        <label htmlFor="image-upload" className="file-input-label">
                            <FaPlus /> Chọn ảnh
                        </label>
                    </div>

                    {previewImages.length > 0 && (
                        <div className="image-grid">
                            {previewImages.map((img, idx) => (
                                <div className="image-item" key={`new-${idx}`}>
                                    <div className="image-preview">
                                        <img
                                            src={img.url}
                                            alt={`Ảnh mới ${idx + 1}`}
                                            onClick={() => handleViewImage(previewImages.map(p => p.url), idx)}
                                        />
                                        <button
                                            type="button"
                                            className="delete-image"
                                            onClick={() => handleDeleteNewImage(idx)}
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                    <span className="image-name">{img.name}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label>Địa điểm:</label>
                    <select value={locationID} onChange={(e) => setLocationID(e.target.value)} required>
                        <option value="">Chọn địa điểm</option>
                        {locations.map(location => (
                            <option key={location._id} value={location._id}>{location.name}</option>
                        ))}
                    </select>
                </div>

                <div className="button-group">
                    <button type="submit" className="submit-button">Cập nhật bài viết</button>
                    <button type="button" onClick={() => navigate("/admin/posts")} className="cancel-button">Hủy</button>
                </div>
            </form>

            {/* Modal xem ảnh */}
            {selectedImage && (
                <div className="image-modal" onClick={(e) => {
                    if (e.target === e.currentTarget) {
                        setSelectedImage(null);
                        setCurrentImageIndex(0);
                    }
                }}>
                    <div className="modal-content">
                        <img
                            src={Array.isArray(selectedImage)
                                ? (typeof selectedImage[currentImageIndex] === 'string' && selectedImage[currentImageIndex].startsWith('http')
                                    ? selectedImage[currentImageIndex]
                                    : `http://localhost:5000/uploads/${selectedImage[currentImageIndex].replace(/^.*[\\\/]/, "")}`)
                                : (typeof selectedImage === 'string' && selectedImage.startsWith('http')
                                    ? selectedImage
                                    : `http://localhost:5000/uploads/${selectedImage.replace(/^.*[\\\/]/, "")}`)
                            }
                            alt="Hình ảnh phóng to"
                        />
                    </div>

                    {Array.isArray(selectedImage) && selectedImage.length > 1 && (
                        <div className="modal-gallery">
                            {selectedImage.map((img, index) => (
                                <img
                                    key={index}
                                    src={typeof img === 'string' && img.startsWith('http')
                                        ? img
                                        : `http://localhost:5000/uploads/${img.replace(/^.*[\\\/]/, "")}`
                                    }
                                    alt={`Thumbnail ${index}`}
                                    className={`modal-thumbnail ${index === currentImageIndex ? 'active' : ''}`}
                                    onClick={() => setCurrentImageIndex(index)}
                                />
                            ))}
                        </div>
                    )}

                    <button className="modal-close" onClick={() => {
                        setSelectedImage(null);
                        setCurrentImageIndex(0);
                    }}>×</button>
                </div>
            )}
        </div>
    );
};

export default AdminEditPost;