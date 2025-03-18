import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { SearchIcon, StarIcon, CalendarIcon } from 'lucide-react';
import { CiLocationOn } from "react-icons/ci";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../styles/Home.css';

import img1 from '../assets/image1.jpg';
import img2 from '../assets/image2.jpg';
import img4 from '../assets/image4.jpg';
import img5 from '../assets/image5.jpg';
import img6 from '../assets/image6.jpg';
import img3 from '../assets/image3.jpg';
import img7 from '../assets/image7.jpg';
import img8 from '../assets/image8.jpg';
import img9 from '../assets/image9.jpg';
import img10 from '../assets/image10.jpg';
import img11 from '../assets/image11.jpg';
import img12 from '../assets/image12.jpg';

const Homepage = () => {
    const [featuredLocations, setFeaturedLocations] = useState([]);
    const [popularPosts, setPopularPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('locations');
    const navigate = useNavigate();

    useEffect(() => {
        setFeaturedLocations([
            {
                id: 1,
                name: 'Phố cổ Hội An',
                description: 'Di sản thế giới UNESCO',
                image: img1,
                rating: 4.9,
                category: 'Di sản',
                date: '2025-03-01'
            },
            {
                id: 2,
                name: 'Thánh địa Mỹ Sơn',
                description: 'Quần thể đền tháp Hindu cổ',
                image: img3,
                rating: 4.7,
                category: 'Di sản',
                date: '2025-02-20'
            },
            {
                id: 3,
                name: 'Đảo Cù Lao Chàm',
                description: 'Hòn đảo tuyệt đẹp',
                image: img2,
                rating: 4.8,
                category: 'Thiên nhiên',
                date: '2025-03-10'
            },
            {
                id: 4,
                name: 'Bãi biển An Bàng',
                description: 'Bãi biển đẹp và yên tĩnh',
                image: img4,
                rating: 4.6,
                category: 'Biển',
                date: '2025-04-01'
            },
            {
                id: 5,
                name: 'Làng gốm Thanh Hà',
                description: 'Làng nghề truyền thống',
                image: img5,
                rating: 4.5,
                category: 'Văn hóa',
                date: '2025-04-15'
            },
            {
                id: 6,
                name: 'Cầu Cửa Đại',
                description: 'Cây cầu nổi tiếng',
                image: img6,
                rating: 4.4,
                category: 'Kiến trúc',
                date: '2025-05-01'
            },
            {
                id: 7,
                name: 'Làng rau Trà Quế',
                description: 'Làng nghề trồng rau',
                image: img7,
                rating: 4.3,
                category: 'Nông nghiệp',
                date: '2025-05-15'
            },
            {
                id: 8,
                name: 'Chùa Cầu',
                description: 'Ngôi chùa cổ kính',
                image: img8,
                rating: 4.2,
                category: 'Tôn giáo',
                date: '2025-06-01'
            },
            {
                id: 9,
                name: 'Bảo tàng Quảng Nam',
                description: 'Bảo tàng lịch sử',
                image: img9,
                rating: 4.1,
                category: 'Lịch sử',
                date: '2025-06-15'
            },
            {
                id: 10,
                name: 'Làng chài Tam Thanh',
                description: 'Làng chài ven biển',
                image: img10,
                rating: 4.0,
                category: 'Biển',
                date: '2025-07-01'
            }
        ]);
        setPopularPosts([
            {
                id: 1,
                title: 'Một ngày ở Hội An',
                excerpt: 'Khám phá Hội An chỉ trong một ngày...',
                image: img12,
                date: '2025-03-01',
                author: 'Chuyên gia du lịch',
                rating: 4.5
            },
            {
                id: 2,
                title: 'Top 5 bãi biển đẹp Quảng Nam',
                excerpt: 'Khám phá những bãi biển tuyệt đẹp...',
                image: img9,
                date: '2025-02-20',
                author: 'Người yêu biển',
                rating: 4.7
            },
            {
                id: 3,
                title: 'Hành trình ẩm thực',
                excerpt: 'Thưởng thức ẩm thực Quảng Nam...',
                image: img7,
                date: '2025-03-10',
                author: 'Tín đồ ẩm thực',
                rating: 4.8
            },
            {
                id: 4,
                title: 'Khám phá làng gốm Thanh Hà',
                excerpt: 'Trải nghiệm làm gốm tại làng nghề truyền thống...',
                image: img4,
                date: '2025-04-01',
                author: 'Người yêu văn hóa',
                rating: 4.6
            },
            {
                id: 5,
                title: 'Tham quan cầu Cửa Đại',
                excerpt: 'Cây cầu nổi tiếng với kiến trúc độc đáo...',
                image: img5,
                date: '2025-04-15',
                author: 'Kiến trúc sư',
                rating: 4.5
            },
            {
                id: 6,
                title: 'Làng rau Trà Quế',
                excerpt: 'Khám phá làng nghề trồng rau truyền thống...',
                image: img6,
                date: '2025-05-01',
                author: 'Nông dân',
                rating: 4.4
            },
            {
                id: 7,
                title: 'Chùa Cầu - Ngôi chùa cổ kính',
                excerpt: 'Tham quan ngôi chùa cổ kính tại Hội An...',
                image: img8,
                date: '2025-05-15',
                author: 'Tín đồ Phật giáo',
                rating: 4.3
            },
            {
                id: 8,
                title: 'Bảo tàng Quảng Nam',
                excerpt: 'Khám phá lịch sử và văn hóa tại bảo tàng...',
                image: img9,
                date: '2025-06-01',
                author: 'Nhà sử học',
                rating: 4.2
            },
            {
                id: 9,
                title: 'Làng chài Tam Thanh',
                excerpt: 'Trải nghiệm cuộc sống làng chài ven biển...',
                image: img10,
                date: '2025-06-15',
                author: 'Người yêu biển',
                rating: 4.1
            },
            {
                id: 10,
                title: 'Khám phá bãi biển An Bàng',
                excerpt: 'Thư giãn tại bãi biển đẹp và yên tĩnh...',
                image: img11,
                date: '2025-07-01',
                author: 'Người yêu biển',
                rating: 4.0
            }
        ]);

        setIsLoading(false);
    }, []);

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get('http://localhost:5000/api/posts/search', {
                params: { locationID: searchQuery },
            });
            setSearchResults(response.data);
        } catch (error) {
            console.error('Lỗi khi tìm kiếm bài viết:', error);
        }
    };

    const handleNavigate = (path) => {
        navigate(path);
    };

    if (isLoading) return <div className="loading">Đang tải...</div>;

    return (
        <div className="homepage">
            <div className="hero-container">
                {/* Swiper slide hình ảnh */}
                <Swiper
                    modules={[Navigation, Pagination, Autoplay]}
                    spaceBetween={0}
                    slidesPerView={1}
                    navigation
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 2000, disableOnInteraction: false }}
                    loop={true}
                    className="hero-slider"
                >
                    {[img10, img11, img8].map((image, index) => (
                        <SwiperSlide key={index}>
                            <div className="hero" style={{ backgroundImage: `url(${image})` }}>
                                <div className="overlay" />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Phần nội dung giữ nguyên, không chạy theo slide */}
                <div className="content">
                    <h1>Khám phá Quảng Nam</h1>
                    <p>Trải nghiệm văn hóa và thiên nhiên</p>
                    <form onSubmit={handleSearch} className="search">
                        <input
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
                {['locations', 'posts', 'events'].map(tab => (
                    <button key={tab} className={activeTab === tab ? 'active' : ''} onClick={() => setActiveTab(tab)}>
                        {tab === 'locations' ? 'Điểm đến nổi bật' : tab === 'posts' ? 'Câu chuyện du lịch' : 'Sự kiện sắp diễn ra'}
                    </button>
                ))}
            </div>

            {activeTab === 'locations' && (
                <>
                    <h2 className="text-2xl font-bold mb-6">Các điểm đến hàng đầu tại Quảng Nam</h2>
                    <div className="grid">
                        {featuredLocations.map(loc => (
                            <div key={loc.id} className="card" onClick={() => handleNavigate(`/posts/${loc.id}`)}>
                                <img src={loc.image} alt={loc.name} />
                                <h3>{loc.name}</h3>
                                <div className="flex">
                                    <span><CiLocationOn /></span>
                                    <p>{loc.description}</p>
                                </div>
                                <div className="card-footer">
                                    <span><CalendarIcon size={16} /> {new Date(loc.date).toLocaleDateString()}</span>
                                    <span><StarIcon size={16} /> {loc.rating}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {activeTab === 'posts' && (
                <>
                    <h2 className="text-2xl font-bold mb-6">Câu chuyện du lịch & Mẹo</h2>
                    <div className="grid">
                        {popularPosts.map(post => (
                            <div key={post.id} className="card" onClick={() => handleNavigate(`/posts/${post.id}`)}>
                                <img src={post.image} alt={post.title} />
                                <h3>{post.title}</h3>
                                <p>{post.excerpt}</p>
                                <div className="card-footer">
                                    <span><CalendarIcon size={16} /> {new Date(post.date).toLocaleDateString()}</span>
                                    <span><StarIcon size={16} /> {post.rating}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {activeTab === 'events' && (
                <>
                    <div className="events">
                        <h2>Sự kiện sắp diễn ra</h2>
                        <p>Hãy đón chờ các lễ hội văn hóa hấp dẫn!</p>
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