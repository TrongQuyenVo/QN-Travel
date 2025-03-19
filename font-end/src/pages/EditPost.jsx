import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/EditPost.css';

const EditPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [image, setImage] = useState('');
    const [locationID, setLocationID] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/posts/${id}`);
                const post = response.data;
                setTitle(post.title);
                setContent(post.content);
                setImage(post.image);
                setLocationID(post.locationID);
            } catch (error) {
                console.error('Lỗi khi lấy chi tiết bài viết:', error);
                setError('Không thể lấy chi tiết bài viết');
            }
        };

        fetchPost();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.put(`http://localhost:5000/api/posts/${id}`, {
                title,
                content,
                image,
                locationID
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            navigate('/admin');
        } catch (error) {
            console.error('Lỗi khi cập nhật bài viết:', error);
            setError('Không thể cập nhật bài viết');
        }
    };

    return (
        <div className="edit-post">
            <h1>Sửa bài viết</h1>
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
                <button type="submit">Cập nhật</button>
            </form>
        </div>
    );
};

export default EditPost;