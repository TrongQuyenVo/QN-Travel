import React, { useState } from 'react';
import "../styles/Contact.css";
import contactBanner from "../assets/contact.jpg";
// Import icons from react-icons library
import {
    FaBuilding, FaPhone, FaEnvelope, FaGlobe, FaClock,
    FaMapMarkerAlt, FaPhoneVolume, FaAmbulance, FaShieldAlt,
    FaFireExtinguisher, FaCheckCircle, FaFacebookF, FaInstagram,
    FaYoutube, FaTiktok, FaApple, FaGooglePlay
} from 'react-icons/fa';

const ContactPage = () => {
    // State for form
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    });

    // State for notifications
    const [formStatus, setFormStatus] = useState({
        isSubmitted: false,
        isError: false,
        message: '',
    });

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate sending data to server
        setTimeout(() => {
            setFormStatus({
                isSubmitted: true,
                isError: false,
                message: 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.'
            });

            // Reset form after successful submission
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: '',
            });
        }, 1000);
    };

    // Handle newsletter subscription
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email) {
            setSubscribed(true);
            setEmail('');
        }
    };

    return (
        <div className="contact-page">
            {/* Header banner */}
            <div className="banner">
                <img src={contactBanner} alt="Du lịch Quảng Nam" className="banner-img" />
                <div className="banner-overlay">
                    <h1>Liên Hệ - Du Lịch Quảng Nam</h1>
                </div>
            </div>

            <div className="container">
                {/* Introduction */}
                <section className="intro-section">
                    <h2>Kết Nối Với Chúng Tôi</h2>
                    <p className="intro-text">
                        Chào mừng bạn đến với Trung tâm Thông tin và Xúc tiến Du lịch Quảng Nam - nơi kết nối những
                        trải nghiệm đáng nhớ và hành trình khám phá miền đất di sản.
                    </p>
                    <p className="intro-text">
                        Dù bạn đang tìm kiếm thông tin về các điểm tham quan, lên kế hoạch cho chuyến đi sắp tới,
                        hay muốn hợp tác phát triển du lịch, đội ngũ chuyên nghiệp của chúng tôi luôn sẵn sàng hỗ trợ bạn.
                    </p>
                </section>

                <div className="two-column-layout">
                    {/* Contact information */}
                    <section className="contact-info">
                        <div className="info-card">
                            <h3>Thông Tin Liên Hệ</h3>
                            <div className="info-item">
                                <div className="icon-wrapper">
                                    <FaBuilding size={20} />
                                </div>
                                <div>
                                    <strong>Trung Tâm Thông Tin và Xúc Tiến Du Lịch Quảng Nam</strong>
                                    <p>10 Trần Hưng Đạo, TP. Tam Kỳ, Quảng Nam</p>
                                </div>
                            </div>
                            <div className="info-item">
                                <div className="icon-wrapper">
                                    <FaPhone size={20} />
                                </div>
                                <div>
                                    <strong>Điện thoại</strong>
                                    <p>(0235) 3812 406</p>
                                </div>
                            </div>
                            <div className="info-item">
                                <div className="icon-wrapper">
                                    <FaEnvelope size={20} />
                                </div>
                                <div>
                                    <strong>Email</strong>
                                    <p>info@quangnamtourism.com.vn</p>
                                </div>
                            </div>
                            <div className="info-item">
                                <div className="icon-wrapper">
                                    <FaGlobe size={20} />
                                </div>
                                <div>
                                    <strong>Website</strong>
                                    <p>www.quangnamtourism.com.vn</p>
                                </div>
                            </div>
                            <div className="info-item">
                                <div className="icon-wrapper">
                                    <FaClock size={20} />
                                </div>
                                <div>
                                    <strong>Giờ làm việc</strong>
                                    <p>Thứ Hai - Thứ Sáu: 8:00 - 17:00</p>
                                    <p>Thứ Bảy: 8:00 - 12:00</p>
                                    <p>Chủ Nhật: Đóng cửa</p>
                                </div>
                            </div>
                        </div>

                        <div className="office-locations">
                            <h3>Văn Phòng Đại Diện</h3>

                            <div className="office-card">
                                <h4><FaMapMarkerAlt size={16} className="marker-icon" /> Văn phòng Hội An</h4>
                                <p>10 Trần Hưng Đạo, Phường Minh An, TP. Hội An</p>
                                <p>Điện thoại: (0235) 3861 327</p>
                                <p>Email: info.hoian@quangnamtourism.com.vn</p>
                            </div>

                            <div className="office-card">
                                <h4><FaMapMarkerAlt size={16} className="marker-icon" /> Văn phòng Khu Di sản Mỹ Sơn</h4>
                                <p>Khu Di tích Mỹ Sơn, Duy Xuyên, Quảng Nam</p>
                                <p>Điện thoại: (0235) 3731 466</p>
                                <p>Email: info.myson@quangnamtourism.com.vn</p>
                            </div>
                        </div>

                        <div className="emergency-info">
                            <h3>Thông Tin Hỗ Trợ Khẩn Cấp</h3>
                            <div className="emergency-grid">
                                <div className="emergency-item">
                                    <FaPhoneVolume size={20} className="emergency-icon" />
                                    <p>Đường dây nóng hỗ trợ du khách: <strong>1800 6877</strong></p>
                                </div>
                                <div className="emergency-item">
                                    <FaAmbulance size={20} className="emergency-icon" />
                                    <p>Cứu thương: <strong>115</strong></p>
                                </div>
                                <div className="emergency-item">
                                    <FaShieldAlt size={20} className="emergency-icon" />
                                    <p>Cảnh sát: <strong>113</strong></p>
                                </div>
                                <div className="emergency-item">
                                    <FaFireExtinguisher size={20} className="emergency-icon" />
                                    <p>Cứu hỏa: <strong>114</strong></p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Contact form */}
                    <section className="contact-form-section">
                        <h3>Gửi Thắc Mắc Của Bạn</h3>
                        <p>Hãy điền thông tin vào biểu mẫu dưới đây, chúng tôi sẽ phản hồi trong vòng 24 giờ làm việc.</p>

                        {formStatus.isSubmitted && (
                            <div className={`form-message ${formStatus.isError ? 'error' : 'success'}`}>
                                {formStatus.message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="contact-form">
                            <div className="form-group">
                                <label htmlFor="name">Họ và tên <span className="required">*</span></label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email <span className="required">*</span></label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="phone">Số điện thoại</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="subject">Chủ đề <span className="required">*</span></label>
                                <select
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">-- Chọn chủ đề --</option>
                                    <option value="info">Thông tin tham quan</option>
                                    <option value="booking">Đặt dịch vụ du lịch</option>
                                    <option value="partner">Hợp tác kinh doanh</option>
                                    <option value="feedback">Phản hồi dịch vụ</option>
                                    <option value="other">Khác</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="message">Nội dung tin nhắn <span className="required">*</span></label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows="5"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </div>

                            <div className="form-group">
                                <button type="submit" className="btn-submit">
                                    Gửi Tin Nhắn
                                </button>
                            </div>
                        </form>
                    </section>
                </div>

                {/* Social media */}
                <section className="social-section">
                    <h3>Kết Nối Mạng Xã Hội</h3>
                    <p>Theo dõi chúng tôi trên các nền tảng mạng xã hội để cập nhật những thông tin mới nhất về du lịch Quảng Nam:</p>

                    <div className="social-links">
                        <a href="https://facebook.com/dulichquangnam" target="_blank" rel="noopener noreferrer" className="social-icon facebook">
                            <FaFacebookF size={18} />
                            <span>Facebook</span>
                        </a>
                        <a href="https://instagram.com/quangnamtourism" target="_blank" rel="noopener noreferrer" className="social-icon instagram">
                            <FaInstagram size={18} />
                            <span>Instagram</span>
                        </a>
                        <a href="https://youtube.com/quangnamtourism" target="_blank" rel="noopener noreferrer" className="social-icon youtube">
                            <FaYoutube size={18} />
                            <span>YouTube</span>
                        </a>
                        <a href="https://tiktok.com/@quangnamtourism" target="_blank" rel="noopener noreferrer" className="social-icon tiktok">
                            <FaTiktok size={18} />
                            <span>TikTok</span>
                        </a>
                    </div>
                </section>

                {/* Map */}
                <section className="map-section">
                    <h3>Bản Đồ</h3>
                    <div className="map-container">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d245368.6488421618!2d108.09134673442384!3d15.618356022412845!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314273c33af1b5fb%3A0x7e7796964dcddab5!2zUXXhuqNuZyBOYW0sIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1619698766123!5m2!1svi!2s"
                            width="100%"
                            height="450"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            title="Bản đồ Quảng Nam"
                        ></iframe>
                    </div>
                </section>

                {/* Newsletter subscription */}
                <section className="newsletter-section">
                    <div className="newsletter-content">
                        <h3>Đăng Ký Nhận Bản Tin</h3>
                        <p>Đăng ký nhận bản tin định kỳ từ Du lịch Quảng Nam để không bỏ lỡ những sự kiện, lễ hội và ưu đãi du lịch hấp dẫn.</p>

                        {subscribed ? (
                            <div className="subscribe-success">
                                <FaCheckCircle size={24} className="success-icon" />
                                <p>Cảm ơn bạn đã đăng ký! Bạn sẽ nhận được các thông tin mới nhất từ Du lịch Quảng Nam.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubscribe} className="newsletter-form">
                                <input
                                    type="email"
                                    placeholder="Nhập địa chỉ email của bạn"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <button type="submit">Đăng Ký</button>
                            </form>
                        )}
                    </div>
                </section>

                {/* App download */}
                <section className="app-download-section">
                    <h3>Tải Ứng Dụng Du Lịch Quảng Nam</h3>
                    <p>Khám phá Quảng Nam trong lòng bàn tay với ứng dụng du lịch thông minh của chúng tôi. Tải xuống miễn phí ngay hôm nay!</p>

                    <div className="app-download">
                        <a href="#" className="app-button">
                            <FaApple size={24} className="app-icon" />
                            <span>
                                <small>Tải về trên</small>
                                <strong>App Store</strong>
                            </span>
                        </a>
                        <a href="#" className="app-button">
                            <FaGooglePlay size={24} className="app-icon" />
                            <span>
                                <small>Tải về trên</small>
                                <strong>Google Play</strong>
                            </span>
                        </a>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default ContactPage;