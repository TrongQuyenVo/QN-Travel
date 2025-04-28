import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SearchIcon, StarIcon, CalendarIcon, MessageCircle, FilterIcon } from 'lucide-react';
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
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [activeTab, setActiveTab] = useState('locations');
    const [storyPosts, setStoryPosts] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [showAllEvents, setShowAllEvents] = useState(false);
    const [showAllFood, setShowAllFood] = useState(false);
    const [showAllPosts, setShowAllPosts] = useState(false);

    // State cho bộ lọc
    const [filters, setFilters] = useState({
        category: 'all',
        rating: 0,
        sortBy: 'newest'
    });

    // State cho bộ lọc tạm thời (chỉ áp dụng khi nhấn nút "Lọc")
    const [tempFilters, setTempFilters] = useState({
        category: 'all',
        rating: 0,
        sortBy: 'newest'
    });

    const suggestionsRef = useRef(null);
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

    const getSuggestions = (value) => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
        if (inputLength === 0) return [];

        const postSuggestions = posts
            .filter(post => post.title.toLowerCase().includes(inputValue))
            .map(post => ({
                text: post.title,
                type: 'post',
                id: post._id,
                image: post.images && post.images.length > 0 ? post.images[0] : 'default-image.jpg',
                category: post.category,
                rating: post.rating || 0
            }));

        const locationSuggestions = featuredLocations
            .filter(location => location.name.toLowerCase().includes(inputValue))
            .map(location => ({
                text: location.name,
                type: 'location',
                id: location._id,
                image: location.image || 'default-image.jpg',
                category: 'location',
                rating: location.rating || 0
            }));

        return [...postSuggestions, ...locationSuggestions].slice(0, 5);
    };

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

    const handleSelectSuggestion = (suggestion) => {
        setSearchQuery(suggestion.text);
        setShowSuggestions(false);
        if (suggestion.type === 'post') {
            navigate(`/posts/${suggestion.id}`);
        } else if (suggestion.type === 'location') {
            handleLocationSearch(suggestion.text);
        }
    };

    const handleLocationSearch = async (locationName) => {
        try {
            setIsLoading(true);
            const locationResponse = await axios.get('http://localhost:5000/api/posts/search/location', {
                params: { locationName },
            });

            // Khởi tạo bộ lọc tạm thời cho kết quả tìm kiếm mới
            setTempFilters({
                category: 'all',
                rating: 0,
                sortBy: 'newest'
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

    // Hàm xử lý thay đổi trong bộ lọc tạm thời
    const handleFilterChange = (filterName, value) => {
        setTempFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
    };

    // Hàm áp dụng bộ lọc khi nhấn nút "Lọc"
    const applyFilters = async () => {
        setFilters({ ...tempFilters });

        try {
            setIsLoading(true);

            // Nếu đang hiển thị kết quả tìm kiếm, thực hiện lọc từ dữ liệu tìm kiếm gốc
            if (showSearchResults && searchQuery.trim()) {
                // Gọi API tìm kiếm lại với các bộ lọc mới
                const locationResponse = await axios.get('http://localhost:5000/api/posts/search/location', {
                    params: {
                        locationName: searchQuery,
                        category: tempFilters.category !== 'all' ? tempFilters.category : undefined,
                        rating: tempFilters.rating > 0 ? tempFilters.rating : 0
                    },
                });

                let filteredResults = locationResponse.data;

                // Sắp xếp kết quả
                filteredResults.sort((a, b) => {
                    switch (tempFilters.sortBy) {
                        case 'newest':
                            return new Date(b.createdAt) - new Date(a.createdAt);
                        case 'oldest':
                            return new Date(a.createdAt) - new Date(b.createdAt);
                        case 'rating':
                            return (b.rating || 0) - (a.rating || 0);
                        default:
                            return 0;
                    }
                });

                setSearchResults(filteredResults);
            }
        } catch (error) {
            console.error('Lỗi khi áp dụng bộ lọc:', error);
            setErrorMessage('Có lỗi xảy ra khi lọc kết quả. Vui lòng thử lại!');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        try {
            setIsLoading(true);
            const locationResponse = await axios.get('http://localhost:5000/api/posts/search/location', {
                params: { locationName: searchQuery },
            });

            // Đặt lại bộ lọc tạm thời về mặc định khi tìm kiếm mới
            setTempFilters({
                category: 'all',
                rating: 0,
                sortBy: 'newest'
            });

            // Đặt lại bộ lọc chính về mặc định
            setFilters({
                category: 'all',
                rating: 0,
                sortBy: 'newest'
            });

            setSearchResults(locationResponse.data);
            setShowSearchResults(true);
            setActiveTab('search-results');
        } catch (error) {
            console.error('Lỗi khi tìm kiếm:', error);
            setErrorMessage('Có lỗi xảy ra khi tìm kiếm. Vui lòng thử lại!');
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

    const clearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
        setShowSearchResults(false);
        setActiveTab('locations');

        // Reset cả bộ lọc tạm thời và bộ lọc chính khi xóa tìm kiếm
        setTempFilters({
            category: 'all',
            rating: 0,
            sortBy: 'newest'
        });
        setFilters({
            category: 'all',
            rating: 0,
            sortBy: 'newest'
        });
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
                                placeholder="Tìm kiếm địa điểm, ẩm thực, sự kiện..."
                                value={searchQuery}
                                onChange={handleSearchInputChange}
                                className="search-input"
                            />
                            <button type="submit"><SearchIcon size={20} /></button>
                            {showSuggestions && suggestions.length > 0 && (
                                <div className="search-suggestions">
                                    {suggestions.map((suggestion, index) => (
                                        <div
                                            key={`${suggestion.type}-${suggestion.id}`}
                                            className="suggestion-item"
                                            onClick={() => handleSelectSuggestion(suggestion)}
                                        >
                                            <div className="suggestion-image">
                                                <img src={suggestion.image} alt={suggestion.text} />
                                            </div>
                                            <div className="suggestion-content">
                                                <div className="suggestion-title">{suggestion.text}</div>
                                                <div className="suggestion-details">
                                                    <span className="suggestion-type">
                                                        {suggestion.type === 'location' ? 'Địa điểm' :
                                                            suggestion.category === 'food' ? 'Ẩm thực' :
                                                                suggestion.category === 'event' ? 'Sự kiện' : 'Bài viết'}
                                                    </span>
                                                    {suggestion.rating > 0 && (
                                                        <span className="suggestion-rating">
                                                            <StarIcon size={14} />
                                                            {suggestion.rating.toFixed(1)}
                                                        </span>
                                                    )}
                                                </div>
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

                    {/* Bộ lọc tìm kiếm với nút áp dụng */}
                    <div className="search-filters">
                        <div className="filter-group">
                            <label>Loại:</label>
                            <select
                                value={tempFilters.category}
                                onChange={(e) => handleFilterChange('category', e.target.value)}
                            >
                                <option value="all">Tất cả</option>
                                <option value="location">Địa điểm</option>
                                <option value="food">Ẩm thực</option>
                                <option value="event">Sự kiện</option>
                                <option value="story">Câu chuyện</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Đánh giá tối thiểu:</label>
                            <select
                                value={tempFilters.rating}
                                onChange={(e) => handleFilterChange('rating', Number(e.target.value))}
                            >
                                <option value="0">Tất cả</option>
                                <option value="3">3+ sao</option>
                                <option value="4">4+ sao</option>
                                <option value="5">5 sao</option>
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Sắp xếp theo:</label>
                            <select
                                value={tempFilters.sortBy}
                                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                            >
                                <option value="newest">Mới nhất</option>
                                <option value="oldest">Cũ nhất</option>
                                <option value="rating">Đánh giá cao nhất</option>
                            </select>
                        </div>

                        <button
                            className="filter-apply-btn"
                            onClick={applyFilters}
                        >
                            <FilterIcon size={16} /> Lọc kết quả
                        </button>
                    </div>

                    {/* Hiển thị các bộ lọc đang áp dụng */}
                    {(filters.category !== 'all' || filters.rating > 0 || filters.sortBy !== 'newest') && (
                        <div className="active-filters">
                            <p>Đang lọc theo:
                                {filters.category !== 'all' &&
                                    <span className="filter-tag">
                                        {filters.category === 'food' ? 'Ẩm thực' :
                                            filters.category === 'event' ? 'Sự kiện' :
                                                filters.category === 'story' ? 'Câu chuyện' : 'Địa điểm'}
                                    </span>
                                }
                                {filters.rating > 0 &&
                                    <span className="filter-tag">
                                        {filters.rating}+ sao
                                    </span>
                                }
                                {filters.sortBy !== 'newest' &&
                                    <span className="filter-tag">
                                        {filters.sortBy === 'oldest' ? 'Cũ nhất' : 'Đánh giá cao nhất'}
                                    </span>
                                }
                            </p>
                        </div>
                    )}

                    {searchResults.length === 0 ? (
                        <div className="no-results">
                            <p>Không tìm thấy kết quả phù hợp với "{searchQuery}"</p>
                            {(filters.category !== 'all' || filters.rating > 0) &&
                                <p>Hãy thử với bộ lọc khác hoặc xóa bộ lọc để xem tất cả kết quả.</p>
                            }
                        </div>
                    ) : (
                        <div className="search-results-grid">
                            {searchResults.map(post => (
                                <div
                                    key={post._id}
                                    className="search-result-card"
                                    onClick={() => handleNavigate(`/posts/${post._id}`)}
                                >
                                    <div className="post-image-container">
                                        <img
                                            src={post.images?.[0] || 'default-image.jpg'}
                                            alt={post.title}
                                            onError={(e) => { e.target.src = 'default-image.jpg'; }}
                                        />
                                        {post.rating > 0 && (
                                            <div className="post-rating">
                                                <StarIcon size={16} /> {post.rating.toFixed(1)}
                                            </div>
                                        )}
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
                            <div key={location._id || location.id} className="location-card"
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
                                        className="event-card"
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
                                        className="food-card"
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

            {errorMessage && (
                <div className="error-message">
                    <p>{errorMessage}</p>
                    <button onClick={() => setErrorMessage('')}>Đóng</button>
                </div>
            )}
        </div>
    );
};

export default Homepage;