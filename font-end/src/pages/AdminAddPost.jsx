import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import "../styles/AdminAddPost.css";

const AdminAddPost = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [images, setImages] = useState([]);
    const [locationID, setLocationID] = useState("");
    const [locations, setLocations] = useState([]);
    const [category, setCategory] = useState("general");
    const [isDragging, setIsDragging] = useState(false);

    const inputFileRef = useRef(null);
    const dropZoneRef = useRef(null);
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

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        addNewImages(files);
    };

    // Xử lý paste hình ảnh
    const handlePaste = (e) => {
        const items = e.clipboardData?.items;
        const imageFiles = [];
        
        if (items) {
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    const file = items[i].getAsFile();
                    imageFiles.push(file);
                }
            }
            if (imageFiles.length > 0) {
                addNewImages(imageFiles);
                e.preventDefault();
            }
        }
    };

    // Xử lý kéo thả hình ảnh
    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        
        const files = Array.from(e.dataTransfer.files).filter(file => 
            file.type.startsWith('image/')
        );
        
        if (files.length > 0) {
            addNewImages(files);
        }
    };

    // Hàm chung để thêm hình ảnh mới
    const addNewImages = (newFiles) => {
        const validImageFiles = newFiles.filter(file => file.type.startsWith('image/'));
        setImages(prevImages => [...prevImages, ...validImageFiles]);
    };

    const handleDeleteImage = (index) => {
        const updatedImages = images.filter((_, i) => i !== index);
        setImages(updatedImages);

        const updatedFileList = new DataTransfer();
        updatedImages.forEach((image) => updatedFileList.items.add(image));
        inputFileRef.current.files = updatedFileList.files;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", title);
        formData.append("content", content);
        formData.append("locationID", locationID);
        formData.append("category", category);

        // Gửi tất cả ảnh trong danh sách
        images.forEach((image) => {
            formData.append("images", image);
        });

        try {
            await axios.post("http://localhost:5000/api/posts", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            alert("Bài viết đã được thêm!");
            navigate("/admin/posts");
        } catch (error) {
            console.error("Lỗi khi thêm bài viết:", error.response?.data || error.message);
        }
    };

    const previewImages = () => {
        return images.map((image, index) => {
            const imageUrl = URL.createObjectURL(image);
            return (
                <div key={index} className="image-preview-add">
                    <img src={imageUrl} alt={`Preview ${index}`} className="image-preview-img-add" />
                    <button type="button" onClick={() => handleDeleteImage(index)} className="delete-image-add">
                        <FaTrash />
                    </button>
                </div>
            );
        });
    };

    return (
        <div className="admin-add-post-add">
            <h1 className="header-title-add">Thêm bài viết mới</h1>
            <form onSubmit={handleSubmit} className="form-add">
                <label className="label-title-add">Tiêu đề:</label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="title-input-add"
                />

                <label className="label-category-add">Danh mục:</label>
                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="category-select-add"
                >
                    <option value="general">Bài viết chung</option>
                    <option value="food">Ẩm thực</option>
                    <option value="event">Sự kiện</option>
                    <option value="story">Câu chuyện</option>
                </select>

                <label className="label-content-add">Nội dung:</label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    required
                    className="content-textarea-add"
                />

                <label className="label-images-add">Hình ảnh:</label>
                <div 
                    className={`drop-zone ${isDragging ? 'dragging' : ''}`}
                    ref={dropZoneRef}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onPaste={handlePaste}
                    tabIndex="0"
                >
                    <p>Kéo thả hoặc dán (Ctrl+V) hình ảnh vào đây</p>
                    <p>hoặc</p>
                    <input
                        ref={inputFileRef}
                        type="file"
                        onChange={handleImageChange}
                        multiple
                        accept="image/*"
                        className="image-input-add"
                    />
                </div>

                <div className="image-preview-container-add">
                    {previewImages()}
                </div>

                <label className="label-location-add">Địa điểm:</label>
                <select
                    value={locationID}
                    onChange={(e) => setLocationID(e.target.value)}
                    required
                    className="location-select-add"
                >
                    <option value="">Chọn địa điểm</option>
                    {locations.map((location) => (
                        <option key={location._id} value={location._id}>
                            {location.name}
                        </option>
                    ))}
                </select>

                <div className="button-container-add">
                    <button type="submit" className="submit-button-add">Thêm bài viết</button>
                    <button type="button" onClick={() => navigate("/admin/posts")} className="cancel-button-add">
                        Hủy
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminAddPost;
