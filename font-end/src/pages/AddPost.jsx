import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/AddPost.css';

const AddPost = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState('');
    const [locationID, setLocationID] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post('http://localhost:5000/api/posts', {
                title,
                content,
                image,
                locationID,
                adminID: localStorage.getItem('userId')
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            navigate('/admin');
        } catch (error) {
            console.error('Lỗi khi thêm bài viết:', error);
            setError('Không thể thêm bài viết');
        }
    };

    return (
        <div className="add-post">
            <h1>Thêm bài viết</h1>
            {error && <div className="error">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Tiêu đề</label>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div>
                    <label>Nội dung</label>
                    <textarea value={content} onChange={(e) => setContent(e.target.value)} required />
                </div>
                <div>
                    <label>URL Hình ảnh</label>
                    <input type="text" value={image} onChange={(e) => setImage(e.target.value)} />
                </div>
                <div>
                    <label>ID Địa điểm</label>
                    <input type="text" value={locationID} onChange={(e) => setLocationID(e.target.value)} required />
                </div>
                <button type="submit">Thêm</button>
            </form>
        </div>
    );
};

export default AddPost;