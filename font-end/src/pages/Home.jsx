import React, { useState, useEffect, useRef } from 'react';
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
    const [searchResults, setSearchResults] = useState([]); // Thêm lại state cho kết quả tìm kiếm
    const [showSearchResults, setShowSearchResults] = useState(false); // Thêm lại state để hiển thị kết quả tìm kiếm
    const [suggestions, setSuggestions] = useState([]); // Thêm lại state cho gợi ý tìm kiếm
    const [showSuggestions, setShowSuggestions] = useState(false); // Thêm lại state để hiển thị gợi ý
    const [activeTab, setActiveTab] = useState('locations');
    const [storyPosts, setStoryPosts] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [showAllEvents, setShowAllEvents] = useState(false);
    const [showAllFood, setShowAllFood] = useState(false);
    const [showAllPosts, setShowAllPosts] = useState(false);

    const suggestionsRef = useRef(null); // Thêm lại ref cho dropdown gợi ý
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

    // Thêm lại useEffect để xử lý click ngoài dropdown gợi ý
    useEffect(() => {
        function handleClickOutside(event) {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [suggestionsRef]);

    // Thêm lại logic tạo gợi ý tìm kiếm
    const getSuggestions = (value) => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
        if (inputLength === 0) return [];
        const postSuggestions = posts
            .filter(post => post.title.toLowerCase().includes(inputValue))
            .map(post => ({ text: post.title, type: 'post', id: post._id }));
        const locationSuggestions = featuredLocations
            .filter(location => location.name.toLowerCase().includes(inputValue))
            .map(location => ({ text: location.name, type: 'location', id: location._id }));
        return [...postSuggestions, ...locationSuggestions].slice(0, 8);
    };

    // Thêm lại logic xử lý thay đổi input tìm kiếm
    const handleSearchInputChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        if (value.trim()) {
            const newSuggestions = getSuggestions(value);
            setSuggestions(newSuggestions);
            setShowSuggestions(newSuggestions.length > 0);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    // Thêm lại logic xử lý khi chọn gợi ý
    const handleSelectSuggestion = (suggestion) => {
        setSearchQuery(suggestion.text);
        setShowSuggestions(false);
        if (suggestion.type === 'post') {
            navigate(`/posts/${suggestion.id}`);
        } else if (suggestion.type === 'location') {
            handleLocationSearch(suggestion.text);
        }
    };

    // Thêm lại logic tìm kiếm theo địa điểm
    const handleLocationSearch = async (locationName) => {
        try {
            setIsLoading(true);
            const locationResponse = await axios.get('http://localhost:5000/api/posts/search/location', {
                params: { locationName },
            });
            setSearchResults(locationResponse.data);
            setShowSearchResults(true);
            setActiveTab('search-results');
        } catch (error) {
            console.error('Lỗi khi tìm kiếm bài viết theo địa điểm:', error);
            setErrorMessage('Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại sau!');
        } finally {
            setIsLoading(false);
        }
    };

    // Cập nhật logic tìm kiếm chính
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        try {
            setIsLoading(true);
            const filteredPosts = posts.filter(post =>
                post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.content.toLowerCase().includes(searchQuery.toLowerCase())
            );
            const locationResponse = await axios.get('http://localhost:5000/api/posts/search/location', {
                params: { locationName: searchQuery },
            });
            const combinedResults = [...filteredPosts];
            locationResponse.data.forEach(post => {
                if (!combinedResults.some(p => p._id === post._id)) {
                    combinedResults.push(post);
                }
            });
            setSearchResults(combinedResults);
            setShowSearchResults(true);
            setActiveTab('search-results');
            setShowSuggestions(false);
        } catch (error) {
            console.error('Lỗi khi tìm kiếm bài viết:', error);
            setErrorMessage('Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại sau!');
        } finally {
            setIsLoading(false);
        }
    };

    const handleNavigate = (path) => {
        navigate(path);
    };

    const toggleShowAllEvents = () => setShowAllEvents(!showAllEvents);
    const toggleShowAllFood = () => setShowAllFood(!showAllFood);
    const toggleShowAllPosts = () => setShowAllPosts(!showAllPosts);

    // Thêm lại logic xóa kết quả tìm kiếm
    const clearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
        setShowSearchResults(false);
        setActiveTab('locations');
    };

    const displayEventPosts = showAllEvents ? eventPosts : eventPosts.slice(0, 5);
    const displayFoodPosts = showAllFood ? foodPosts : foodPosts.slice(0, 5);

    if (isLoading) return <div className="loading">Đang tải...</div>;

    return (
        <div className="homepage">
            <div className="hero-container">
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
                        <div className="search-container" ref={suggestionsRef}>
                            <input
                                type="text"
                                placeholder="Tìm kiếm điểm đến..."
                                value={searchQuery}
                                onChange={handleSearchInputChange}
                                onFocus={() => setShowSuggestions(suggestions.length > 0)}
                            />
                            <button type="submit"><SearchIcon size={20} /></button>
                            {showSuggestions && (
                                <div className="search-suggestions">
                                    {suggestions.map((suggestion, index) => (
                                        <div
                                            key={index}
                                            className="suggestion-item"
                                            onClick={() => handleSelectSuggestion(suggestion)}
                                        >
                                            <div className="suggestion-icon">
                                                {suggestion.type === 'post' ? '📝' : '📍'}
                                            </div>
                                            <div className="suggestion-text">
                                                {suggestion.text}
                                                <span className="suggestion-type">
                                                    {suggestion.type === 'post' ? 'Bài viết' : 'Địa điểm'}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            <div className="tabs">
                {['locations', 'posts', ...(showSearchResults ? ['search-results'] : [])].map(tab => (
                    <button key={tab} className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>
                        {tab === 'locations' ? 'Điểm đến nổi bật' :
                         tab === 'posts' ? 'Câu chuyện du lịch' :
                         tab === 'search-results' ? `Kết quả tìm kiếm (${searchResults.length})` : ''}
                    </button>
                ))}
            </div>

            {activeTab === 'search-results' && (
                <div className="search-results-container">
                    <div className="search-header">
                        <h2 className="text-2xl font-bold mb-6">Kết quả tìm kiếm cho: "{searchQuery}"</h2>
                        <button onClick={clearSearch} className="clear-search-btn">Xóa tìm kiếm</button>
                    </div>
                    {searchResults.length === 0 ? (
                        <div className="no-results">
                            <p>Không tìm thấy kết quả phù hợp với "{searchQuery}"</p>
                        </div>
                    ) : (
                        <div className="search-results-grid">
                            {searchResults.map(post => (
                                <div
                                    key={post._id}
                                    className="card search-result-card"
                                    onClick={() => handleNavigate(`/posts/${post._id}`)}
                                >
                                    <div className="post-image-container">
                                        <img
                                            src={post.images?.[0] || 'default-image.jpg'}
                                            alt={post.title}
                                            onError={(e) => { e.target.src = 'default-image.jpg'; }}
                                        />
                                    </div>
                                    <div className="post-content">
                                        <h3 className="post-title">{post.title}</h3>
                                        <div className="post-meta">
                                            <span className="post-date">
                                                <CalendarIcon size={16} /> {new Date(post.createdAt).toLocaleDateString()}
                                            </span>
                                            {post.category && (
                                                <span className="post-category">
                                                    {post.category === 'food' ? '🍜 Ẩm thực' :
                                                     post.category === 'event' ? '🎉 Sự kiện' :
                                                     post.category === 'story' ? '📖 Câu chuyện' : post.category}
                                                </span>
                                            )}
                                        </div>
                                        <p className="post-excerpt">{post.content.substring(0, 100)}...</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

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
                                        onError={(e) => { e.target.src = 'default-image.jpg'; }}
                                    />
                                    <div className="location-name-overlay">
                                        <h3>{location.name}</h3>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="event-food-container">
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

            <footer className="footer">
                <div className="footer-container">
                    <div className="footer-section">
                        <h3>Khám phá Quảng Nam</h3>
                        <ul>
                            <li><button onClick={() => handleNavigate('/locations')}>Điểm đến</button></li>
                            <li><button onClick={() => handleNavigate('/posts')}>Câu chuyện</button></li>
                            <li><button onClick={() => handleNavigate('/plan-trip')}>Lên kế hoạch</button></li>
                        </ul>
                    </div>
                    <div className="footer-section">
                        <h3>Liên hệ</h3>
                        <p>Email: info@explorequangnam.com</p>
                        <p>Điện thoại: (+84) 123 456 789</p>
                        <p>Địa chỉ: Hội An, Quảng Nam</p>
                    </div>
                    <div className="footer-section">
                        <h3>Theo dõi chúng tôi</h3>
                        <div className="social-links">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© {new Date().getFullYear()} Khám phá Quảng Nam. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Homepage;