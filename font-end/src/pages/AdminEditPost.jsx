import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import "../styles/AdminEditPost.css";

const AdminEditPost = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [newImages, setNewImages] = useState([]);
    const [currentImages, setCurrentImages] = useState([]);
    const [imagesToDelete, setImagesToDelete] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [locationID, setLocationID] = useState("");
    const [locationName, setLocationName] = useState(""); // Thêm state cho tên địa điểm
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState("general");
    const [uploadProgress, setUploadProgress] = useState(0);
    const [selectedImage, setSelectedImage] = useState(null); // Thêm state cho hình ảnh được chọn
    const [currentImageIndex, setCurrentImageIndex] = useState(0); // Thêm state cho index hình ảnh

    // Thêm useRef cho input file
    const inputFileRef = useRef(null);

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

                // Tải danh sách địa điểm trước
                const locationsRes = await axios.get("http://localhost:5000/api/locations");
                setLocations(locationsRes.data);

                // Sau đó tải thông tin bài viết
                const postRes = await axios.get(`http://localhost:5000/api/posts/${postId}`);
                const post = postRes.data;

                setTitle(post.title);
                setContent(post.content);

                // Xử lý location ID
                let locID = post.locationID;

                if (post.locationID) {
                    let locID;

                    // Trường hợp locationID đã được populate thành object đầy đủ
                    if (typeof post.locationID === 'object' && post.locationID !== null) {
                        if (post.locationID._id) {
                            // Nếu có _id
                            locID = post.locationID._id.$oid || post.locationID._id;
                        } else if (post.locationID.$oid) {
                            // Nếu có $oid
                            locID = post.locationID.$oid;
                        }

                        // Nếu có thông tin name, thiết lập luôn
                        if (post.locationID.name) {
                            setLocationName(post.locationID.name);
                        }
                    } else {
                        // Trường hợp locationID chỉ là string
                        locID = post.locationID;
                    }

                    console.log("LocationID từ API:", post.locationID);
                    console.log("LocationID đã xử lý:", locID);

                    if (locID) {
                        setLocationID(locID);

                        // Nếu chưa có locationName, tìm trong danh sách locations
                        if (!locationName && locationsRes.data && locationsRes.data.length > 0) {
                            const locationObj = locationsRes.data.find(loc => {
                                const locObjId = loc._id.$oid || loc._id;
                                return String(locObjId) === String(locID);
                            });

                            if (locationObj) {
                                console.log("Đã tìm thấy địa điểm:", locationObj.name);
                                setLocationName(locationObj.name);
                            }
                        }
                    }
                }

                // Thiết lập danh mục
                if (post.category) {
                    setCategory(post.category);
                }

                // Xử lý danh sách ảnh hiện tại
                if (post.images && post.images.length > 0) {
                    setCurrentImages(post.images);
                } else if (post.image) {
                    // Trường hợp sử dụng thuộc tính image cũ
                    setCurrentImages([post.image]);
                }

                setLoading(false);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu bài viết:", error);
                alert("Không thể tải dữ liệu bài viết.");
                navigate("/admin/posts");
            }
        };

        fetchData();
    }, [postId, navigate]);

    // Cải thiện xử lý thêm ảnh mới
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        // Kiểm tra kích thước và định dạng ảnh
        const validFiles = files.filter(file => {
            const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            const maxSize = 5 * 1024 * 1024; // 5MB

            if (!validTypes.includes(file.type)) {
                alert(`File "${file.name}" không phải định dạng ảnh được hỗ trợ.`);
                return false;
            }

            if (file.size > maxSize) {
                alert(`File "${file.name}" vượt quá 5MB.`);
                return false;
            }

            return true;
        });

        if (validFiles.length === 0) return;

        setNewImages([...newImages, ...validFiles]);

        const newPreviewImages = validFiles.map(file => ({
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
        const updatedNewImages = [...newImages];
        updatedNewImages.splice(index, 1);
        setNewImages(updatedNewImages);

        const updatedPreviews = [...previewImages];
        URL.revokeObjectURL(updatedPreviews[index].url);
        updatedPreviews.splice(index, 1);
        setPreviewImages(updatedPreviews);
    };

    // Cập nhật địa điểm khi người dùng thay đổi lựa chọn
    const handleLocationChange = (e) => {
        const selectedLocID = e.target.value;
        setLocationID(selectedLocID);

        if (selectedLocID) {
            const selectedLocation = locations.find(loc => loc._id === selectedLocID);
            if (selectedLocation) {
                setLocationName(selectedLocation.name);
            } else {
                setLocationName("");
            }
        } else {
            setLocationName("");
        }
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

        // Thêm các ảnh mới vào formData
        newImages.forEach(file => {
            formData.append('images', file);
        });

        // Thêm danh sách ảnh cần xóa
        if (imagesToDelete.length > 0) {
            formData.append('removeImages', JSON.stringify(imagesToDelete));
        }

        // Thêm danh sách ảnh hiện tại cần giữ lại
        formData.append('currentImages', JSON.stringify(currentImages));

        try {
            // Thêm cấu hình upload progress
            await axios.put(`http://localhost:5000/api/posts/${postId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                }
            });

            setUploadProgress(100);
            alert("Bài viết đã được cập nhật!");
            navigate("/admin/posts", { state: { updated: true } });
        } catch (error) {
            setUploadProgress(0);
            console.error("Lỗi khi cập nhật bài viết:", error.response?.data || error.message);
            alert("Có lỗi xảy ra khi cập nhật bài viết. Vui lòng thử lại.");
        }
    };

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
                    <div className="image-upload-container">
                        <input
                            ref={inputFileRef}
                            type="file"
                            onChange={handleImageChange}
                            multiple
                            className="image-input-update"
                        />
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
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label>Địa điểm:</label>
                    <select
                        value={locationID}
                        onChange={handleLocationChange}
                        required
                    >
                        <option value="">Chọn địa điểm</option>
                        {locations.map(location => (
                            <option
                                key={location._id}
                                value={location._id.$oid || location._id}
                            >
                                {location.name}
                            </option>
                        ))}
                    </select>
                </div>

                {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="upload-progress">
                        <div className="progress-bar">
                            <div className="progress" style={{ width: `${uploadProgress}%` }}></div>
                        </div>
                        <div className="progress-text">{uploadProgress}% đã tải lên</div>
                    </div>
                )}

                <div className="button-group">
                    <button type="submit" className="submit-button">Cập nhật bài viết</button>
                    <button type="button" onClick={() => navigate("/admin/posts")} className="cancel-button">Hủy</button>
                </div>
            </form>
        </div>
    );
};

export default AdminEditPost;