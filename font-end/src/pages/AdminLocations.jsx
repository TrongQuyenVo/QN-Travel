import { useState, useEffect } from 'react';
import axios from 'axios';
import "../styles/AdminLocations.css";

const AdminLocations = () => {
    const [locations, setLocations] = useState([]);
    const [newLocation, setNewLocation] = useState({ name: '', image: null, featured: false });
    const [editLocation, setEditLocation] = useState({ id: '', name: '', image: null, featured: false });

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
            document.querySelector(".location-add-form input[type='file']").value = "";
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

    return (
        <div className="locations-admin">
            <h1 className="locations-header">Quản lý Địa điểm</h1>

            {/* Form thêm địa điểm */}
            <div className="location-add-form">
                <input type="text" value={newLocation.name} onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })} placeholder="Tên địa điểm" />
                <input type="file" onChange={(e) => handleFileChange(e, 'new')} />
                <label>
                    <input type="checkbox" checked={newLocation.featured} onChange={(e) => setNewLocation({ ...newLocation, featured: e.target.checked })} /> Nổi bật
                </label>
                <button onClick={addLocation}>Thêm địa điểm</button>
            </div>

            {/* Form chỉnh sửa địa điểm */}
            {editLocation.id && (
                <div className="location-edit-form">
                    <input type="text" value={editLocation.name} onChange={(e) => setEditLocation({ ...editLocation, name: e.target.value })} placeholder="Tên địa điểm" />
                    <input type="file" onChange={(e) => handleFileChange(e, 'edit')} />
                    {editLocation.image && (
                        <div>
                            <p>Ảnh hiện tại:</p>
                            <img src={editLocation.image instanceof File ? URL.createObjectURL(editLocation.image) : `http://localhost:5000${editLocation.image}`} alt="Ảnh địa điểm" className="location-image-preview" />
                        </div>
                    )}
                    <label>
                        <input type="checkbox" checked={editLocation.featured} onChange={(e) => setEditLocation({ ...editLocation, featured: e.target.checked })} /> Nổi bật
                    </label>
                    <div className="edit-actions">
                        <button className="update-locations" onClick={updateLocation}>Cập nhật địa điểm</button>
                        <button className="cancel-btn" onClick={() => setEditLocation({ id: '', name: '', image: null, featured: false })}>Hủy</button>
                    </div>
                </div>
            )}

            {/* Danh sách địa điểm */}
            <h2 className="locations-list-title">Danh sách địa điểm</h2>
            <ul className="locations-list">
                {locations.map(location => (
                    <li key={location._id} className="location-item">
                        {location.image && <img src={`http://localhost:5000${location.image}`} alt={location.name} className="location-image" />}
                        <span>{location.name} {location.featured && <strong>(Nổi bật)</strong>}</span>
                        <div className="location-actions">
                            <button className="location-edit-btn" onClick={() => setEditLocation({ id: location._id, name: location.name, image: location.image, featured: location.featured })}>Sửa</button>
                            <button className="location-delete-btn" onClick={() => deleteLocation(location._id)}>Xóa</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminLocations;
