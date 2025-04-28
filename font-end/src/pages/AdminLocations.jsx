import { useState, useEffect } from 'react';
import axios from 'axios';
import "../styles/AdminLocations.css";

const AdminLocations = () => {
    const [locations, setLocations] = useState([]);
    const [newLocation, setNewLocation] = useState({ name: '', image: null, featured: false });
    const [editLocation, setEditLocation] = useState({ id: '', name: '', image: null, featured: false });
    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/locations');
                setLocations(res.data);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách địa điểm:", error);
            }
        };
        fetchLocations();
    }, []);

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (file) {
            if (type === 'new') {
                setNewLocation({ ...newLocation, image: file });
                // Tạo URL xem trước cho ảnh mới
                setPreviewImage(URL.createObjectURL(file));
            } else {
                setEditLocation({ ...editLocation, image: file });
            }
        }
    };

    const addLocation = async () => {
        const formData = new FormData();
        formData.append('name', newLocation.name);
        formData.append('featured', newLocation.featured ? 'true' : 'false');
        if (newLocation.image) {
            formData.append('image', newLocation.image);
        }

        try {
            const res = await axios.post('http://localhost:5000/api/locations', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setLocations([...locations, res.data]);
            setNewLocation({ name: '', image: null, featured: false });
            // Reset file input và xóa ảnh xem trước
            document.querySelector(".location-add-form input[type='file']").value = "";
            setPreviewImage(null);
        } catch (error) {
            console.error("Lỗi khi thêm địa điểm:", error);
        }
    };

    const updateLocation = async () => {
        const formData = new FormData();
        formData.append('name', editLocation.name);
        formData.append('featured', editLocation.featured ? 'true' : 'false');
        if (editLocation.image instanceof File) {
            formData.append('image', editLocation.image);
        } else {
            formData.append('image', editLocation.image || '');
        }

        try {
            const res = await axios.put(`http://localhost:5000/api/locations/${editLocation.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setLocations(locations.map(loc => (loc._id === editLocation.id ? res.data : loc)));
            setEditLocation({ id: '', name: '', image: null, featured: false });
        } catch (error) {
            console.error("Lỗi khi cập nhật địa điểm:", error);
        }
    };

    const deleteLocation = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa địa điểm này không?")) {
            try {
                await axios.delete(`http://localhost:5000/api/locations/${id}`);
                setLocations(locations.filter(loc => loc._id !== id));
            } catch (error) {
                console.error("Lỗi khi xóa địa điểm:", error);
            }
        }
    };

    // Hàm xử lý hủy việc thêm mới và reset form
    const cancelAdd = () => {
        setNewLocation({ name: '', image: null, featured: false });
        document.querySelector(".location-add-form input[type='file']").value = "";
        setPreviewImage(null);
    };

    return (
        <div className="locations-admin">
            <h1 className="locations-header">Quản lý Địa điểm</h1>

            {/* Form thêm địa điểm */}
            <div className="location-add-form">
                <h2>Thêm địa điểm mới</h2>
                <div className="form-group">
                    <label>Tên địa điểm:</label>
                    <input
                        type="text"
                        value={newLocation.name}
                        onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                        placeholder="Nhập tên địa điểm"
                    />
                </div>

                <div className="form-group">
                    <label>Hình ảnh:</label>
                    <input
                        type="file"
                        onChange={(e) => handleFileChange(e, 'new')}
                        accept="image/*"
                    />
                </div>

                {/* Hiển thị ảnh xem trước khi thêm mới */}
                {previewImage && (
                    <div className="image-preview">
                        <img
                            src={previewImage}
                            alt="Xem trước"
                            className="location-image-preview"
                        />
                    </div>
                )}

                <div className="form-group checkbox-group">
                    <label>
                        <input
                            type="checkbox"
                            checked={newLocation.featured}
                            onChange={(e) => setNewLocation({ ...newLocation, featured: e.target.checked })}
                        />
                        Đánh dấu là địa điểm nổi bật
                    </label>
                </div>

                <div className="form-actions">
                    <button
                        className="add-button"
                        onClick={addLocation}
                        disabled={!newLocation.name}
                    >
                        Thêm địa điểm
                    </button>
                    <button
                        className="cancel-button"
                        onClick={cancelAdd}
                    >
                        Hủy
                    </button>
                </div>
            </div>

            {/* Form chỉnh sửa địa điểm */}
            {editLocation.id && (
                <div className="location-edit-form">
                    <h2>Chỉnh sửa địa điểm</h2>
                    <div className="form-group">
                        <label>Tên địa điểm:</label>
                        <input
                            type="text"
                            value={editLocation.name}
                            onChange={(e) => setEditLocation({ ...editLocation, name: e.target.value })}
                            placeholder="Nhập tên địa điểm"
                        />
                    </div>

                    <div className="form-group">
                        <label>Hình ảnh:</label>
                        <input
                            type="file"
                            onChange={(e) => handleFileChange(e, 'edit')}
                            accept="image/*"
                        />
                    </div>

                    {editLocation.image && (
                        <div className="image-preview">
                            <img
                                src={editLocation.image instanceof File ? URL.createObjectURL(editLocation.image) : `http://localhost:5000${editLocation.image}`}
                                alt="Ảnh địa điểm"
                                className="location-image-preview"
                            />
                        </div>
                    )}

                    <div className="form-group checkbox-group">
                        <label>
                            <input
                                type="checkbox"
                                checked={editLocation.featured}
                                onChange={(e) => setEditLocation({ ...editLocation, featured: e.target.checked })}
                            />
                            Đánh dấu là địa điểm nổi bật
                        </label>
                    </div>

                    <div className="edit-actions">
                        <button
                            className="update-locations"
                            onClick={updateLocation}
                            disabled={!editLocation.name}
                        >
                            Cập nhật địa điểm
                        </button>
                        <button
                            className="cancel-btn"
                            onClick={() => setEditLocation({ id: '', name: '', image: null, featured: false })}
                        >
                            Hủy
                        </button>
                    </div>
                </div>
            )}

            {/* Danh sách địa điểm */}
            <h2 className="locations-list-title">Danh sách địa điểm</h2>
            <ul className="locations-list">
                {locations.length > 0 ? (
                    locations.map(location => (
                        <li key={location._id} className="location-item">
                            {location.image && <img src={`http://localhost:5000${location.image}`} alt={location.name} className="location-image" />}
                            <div className="location-info">
                                <span className="location-name">{location.name} {location.featured && <strong className="featured-badge">(Nổi bật)</strong>}</span>
                            </div>
                            <div className="location-actions">
                                <button
                                    className="location-edit-btn"
                                    onClick={() => setEditLocation({
                                        id: location._id,
                                        name: location.name,
                                        image: location.image,
                                        featured: location.featured
                                    })}
                                >
                                    Sửa
                                </button>
                                <button
                                    className="location-delete-btn"
                                    onClick={() => deleteLocation(location._id)}
                                >
                                    Xóa
                                </button>
                            </div>
                        </li>
                    ))
                ) : (
                    <li className="no-locations">Chưa có địa điểm nào</li>
                )}
            </ul>
        </div>
    );
};

export default AdminLocations;