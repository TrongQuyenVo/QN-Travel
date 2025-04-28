import React from 'react';
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';
import { SiZalo } from 'react-icons/si';
import '../styles/Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-about">
                    <h2 className="footer-title">GIỚI THIỆU</h2>
                    <p className="footer-text">Quảng Nam Tourism là một tổ chức chuyên cung cấp các dịch vụ du lịch và khám phá văn hóa tại Quảng Nam.</p>
                    <p className="footer-text">Chúng tôi cam kết mang đến cho bạn những trải nghiệm tuyệt vời và đáng nhớ.</p>
                    <a href="#" className="footer-read-more">Xem thêm</a>
                </div>
                <div className="footer-social">
                    <h2 className="footer-title">LIÊN KẾT MẠNG XÃ HỘI</h2>
                    <div className="footer-social-links">
                        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">
                            <FaFacebook className="footer-social-icon" />
                            <span>Facebook</span>
                        </a>
                        <a href="https://zalo.me" target="_blank" rel="noopener noreferrer" className="footer-social-link">
                            <SiZalo className="footer-social-icon" />
                            <span>Zalo</span>
                        </a>
                        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">
                            <FaInstagram className="footer-social-icon" />
                            <span>Instagram</span>
                        </a>
                        <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="footer-social-link">
                            <FaYoutube className="footer-social-icon" />
                            <span>YouTube</span>
                        </a>
                    </div>
                </div>
                <div className="footer-contact">
                    <h2 className="footer-title">LIÊN HỆ</h2>
                    <p className="footer-text">Địa chỉ: 566 Núi Thành, P. Hòa Cường Nam,</p>
                    <p className="footer-text">Q. Hải Châu, TP. Đà Nẵng</p>
                    <p className="footer-text">Email: <a href="mailto:info@quangnamtourism.com" className="footer-link">info@quangnamtourism.com</a></p>
                    <p className="footer-text">Điện thoại: <a href="tel:+123456789" className="footer-link">+123 456 789</a></p>
                    <p className="footer-text">Website: <a href="https://www.quangnamtourism.com" className="footer-link">quangnamtourism.com</a></p>
                </div>
            </div>
            <div className="footer-copyright">
                <p className="footer-text">© 2025 Quảng Nam Tourism. All Rights Reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;