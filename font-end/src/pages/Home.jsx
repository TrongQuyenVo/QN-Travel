import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SearchIcon, StarIcon, CalendarIcon, MessageCircle } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../styles/Home.css';

const Homepage = () => {
    const [locationImages, setLocationImages] = useState([]);
    const [featuredLocations, setFeaturedLocations] = useState([]);
    const [posts, setPosts] = useState([]);
    const [eventPosts, setEventPosts] = useState([]);
    const [foodPosts, setFoodPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('locations');
    const [storyPosts, setStoryPosts] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    // State cho việc hiển thị bài viết
    const [showAllEvents, setShowAllEvents] = useState(false);
    const [showAllFood, setShowAllFood] = useState(false);
    const [showAllPosts, setShowAllPosts] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/locations');
                const images = response.data.map(location => location.image);
                setLocationImages(images);
            } catch (error) {
                console.error('Lỗi khi lấy hình ảnh địa điểm:', error);
            }
        };

        fetchImages();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const featuredRes = await axios.get('http://localhost:5000/api/locations/featured');
                setFeaturedLocations(featuredRes.data);
                const postsRes = await axios.get('http://localhost:5000/api/posts');
                setPosts(postsRes.data);

                setEventPosts(postsRes.data.filter(post => post.category === 'event'));
                setFoodPosts(postsRes.data.filter(post => post.category === 'food'));
                setStoryPosts(postsRes.data.filter(post => post.category === 'story'));
            } catch (error) {
                console.error('Lỗi khi tải dữ liệu:', error);
                setErrorMessage('Không thể tải dữ liệu. Vui lòng thử lại sau!');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get('http://localhost:5000/api/posts/search', {
                params: { query: searchQuery },
            });
            setSearchResults(response.data);
        } catch (error) {
            console.error('Lỗi khi tìm kiếm bài viết:', error);
        }
    };

    const handleNavigate = (path) => {
        navigate(path);
    };

    // Hàm để hiển thị thêm bài viết khi nhấn nút
    const toggleShowAllEvents = () => {
        setShowAllEvents(!showAllEvents);
    };

    const toggleShowAllFood = () => {
        setShowAllFood(!showAllFood);
    };

    const toggleShowAllPosts = () => {
        setShowAllPosts(!showAllPosts);
    };

    // Giới hạn số bài viết hiển thị ban đầu
    const displayEventPosts = showAllEvents ? eventPosts : eventPosts.slice(0, 5);
    const displayFoodPosts = showAllFood ? foodPosts : foodPosts.slice(0, 5);

    if (isLoading) return <div className="loading">Đang tải...</div>;

    return (
        <div className="homepage">
            <div className="hero-container">
                {/* ... Hero section giữ nguyên ... */}
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={0}
                    slidesPerView={1}
                    navigation
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 2000, disableOnInteraction: false }}
                    loop={locationImages.length > 1}
                    className="hero-slider"
                >
                    {locationImages.slice(0, 3).map((img, index) => (
                        <SwiperSlide key={index}>
                            <div className="hero">
                                <img src={`http://localhost:5000${img}`} alt={`Slide ${index}`} />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                <div className="content">
                    <h1>Khám phá Quảng Nam</h1>
                    <p>Trải nghiệm văn hóa và thiên nhiên</p>
                    <form onSubmit={handleSearch} className="search">
                        <input className="search-input"
                            type="text"
                            placeholder="Tìm kiếm điểm đến..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit"><SearchIcon size={20} /></button>
                    </form>
                </div>
            </div>

            <div className="tabs">
                {['locations', 'posts'].map(tab => (
                    <button key={tab} className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>
                        {tab === 'locations' ? 'Điểm đến nổi bật' : tab === 'posts' ? 'Câu chuyện du lịch' : ''}
                    </button>
                ))}
            </div>

            {activeTab === 'locations' && (
                <>
                    <h2 className="text-2xl font-bold mb-6">Các điểm đến hàng đầu tại Quảng Nam</h2>
                    <div className="locations-container">
                        {featuredLocations.map(location => (
                            <div key={location._id || location.id} className="card location-card"
                                onClick={() => handleNavigate(`/locations/${location._id || location.id}`)}
                            >
                                <div className="location-image-container">
                                    <img src={`http://localhost:5000${location.image}`}
                                        alt={location.name}
                                        onError={(e) => { e.target.src = 'default-image.jpg'; }} // Nếu ảnh lỗi, thay bằng ảnh mặc định
                                    />
                                    <div className="location-name-overlay">
                                        <h3>{location.name}</h3>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="event-food-container">
                        {/* Phần Sự Kiện */}
                        <section className="event-posts">
                            <h2 className="section-title-event">🎉 Sự kiện và giải trí</h2>
                            <div className="event-content">
                                {displayEventPosts.map(post => (
                                    <div
                                        key={post._id}
                                        className="card event-card"
                                        onClick={() => handleNavigate(`/posts/${post._id}`)}
                                    >
                                        <div className="post-image-container-event">
                                            <img src={post.images?.[0] || 'default-image.jpg'} alt={post.title} />
                                        </div>
                                        <div className="post-content-event">
                                            <h3 className="post-title-event">{post.title}</h3>
                                            <div className="post-date"><CalendarIcon size={16} /> {new Date(post.createdAt).toLocaleDateString()}</div>
                                            <p className="post-excerpt-event">{post.content.substring(0, 100)}...</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {eventPosts.length > 5 && (
                                <div className="more-button">
                                    <button onClick={toggleShowAllEvents}>
                                        {showAllEvents ? "Thu gọn" : "Xem nhiều hơn"}
                                    </button>
                                </div>
                            )}
                        </section>

                        {/* Phần Ẩm Thực */}
                        <section className="food-posts">
                            <h2 className="section-title-food">🍜 Ẩm thực</h2>
                            <div className="food-content">
                                {displayFoodPosts.map(post => (
                                    <div
                                        key={post._id}
                                        className="card food-card"
                                        onClick={() => handleNavigate(`/posts/${post._id}`)}
                                    >
                                        <div className="post-image-container-food">
                                            <img src={post.images?.[0] || 'default-image.jpg'} alt={post.title} />
                                        </div>
                                        <div className="post-content-food">
                                            <h3 className="post-title-food">{post.title}</h3>
                                            <div className="post-date"><CalendarIcon size={16} /> {new Date(post.createdAt).toLocaleDateString()}</div>
                                            <p className="post-excerpt-food">{post.content.substring(0, 100)}...</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {foodPosts.length > 5 && (
                                <div className="more-button">
                                    <button onClick={toggleShowAllFood}>
                                        {showAllFood ? "Thu gọn" : "Xem nhiều hơn"}
                                    </button>
                                </div>
                            )}
                        </section>
                    </div>
                </>
            )}

            {activeTab === 'posts' && (
                <>
                    <h2 className="text-2xl font-bold mb-6">Câu chuyện du lịch</h2>
                    <div className="posts-container">
                        {storyPosts.length > 0 ? (
                            storyPosts.map((post) => (
                                <div key={post._id} className="card" onClick={() => handleNavigate(`/posts/${post._id}`)}>
                                    <div className="post-image-container">
                                        <img
                                            src={post.images?.length > 0 ? post.images[0] : 'default-image.jpg'}
                                            alt={post.title}
                                            className="post-image"
                                        />
                                    </div>
                                    <div className="post-content">
                                        <h3 className="post-title">{post.title}</h3>
                                        <p className="post-excerpt">
                                            {post.content
                                                ? post.content.substring(0, 100) + (post.content.length > 100 ? '...' : '')
                                                : 'Không có mô tả.'}
                                        </p>
                                        <div className="card-footer">
                                            <span><CalendarIcon size={16} /> {new Date(post.createdAt).toLocaleDateString()}</span>
                                            <span><MessageCircle size={16} /> {post.comments?.length || 0} bình luận</span>
                                            <span><StarIcon size={16} /> {post.rating ? parseFloat(post.rating).toFixed(1) : '0'}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>Không có bài viết nào.</p>
                        )}
                    </div>
                </>
            )}

            <div className="cta">
                <h2>Lên kế hoạch cho chuyến đi</h2>
                <p>Khám phá đền chùa cổ kính, bãi biển, và ẩm thực.</p>
                <button onClick={() => handleNavigate('/plan-trip')}>Bắt đầu ngay</button>
            </div>
        </div>
    );
};

export default Homepage;