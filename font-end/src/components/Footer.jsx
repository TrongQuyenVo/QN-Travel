import React from 'react';
import { FaFacebook, FaInstagram, FaYoutube } from 'react-icons/fa';
import { SiZalo } from 'react-icons/si';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white p-8">
            <div className="container mx-auto flex flex-col md:flex-row justify-between">
                <div className="mb-8 md:mb-0">
                    <h2 className="text-lg font-bold mb-2">GIỚI THIỆU</h2>
                    <p>Quảng Nam Tourism là một tổ chức chuyên cung cấp các dịch vụ du lịch và khám phá văn hóa tại Quảng Nam.</p>
                    <p>Chúng tôi cam kết mang đến cho bạn những trải nghiệm tuyệt vời và đáng nhớ.</p>
                    <a href="#" className="text-blue-400 mt-2 inline-block">Xem thêm</a>
                </div>
                <div className="mb-8 md:mb-0">
                    <h2 className="text-lg font-bold mb-2">LIÊN KẾT MẠNG XÃ HỘI</h2>
                    <div className="flex flex-col space-y-2">
                        <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2">
                            <FaFacebook className="w-6 h-6" />
                            <span>Facebook</span>
                        </a>
                        <a href="https://zalo.me" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2">
                            <SiZalo className="w-6 h-6" />
                            <span>Zalo</span>
                        </a>
                        <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2">
                            <FaInstagram className="w-6 h-6" />
                            <span>Instagram</span>
                        </a>
                        <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2">
                            <FaYoutube className="w-6 h-6" />
                            <span>YouTube</span>
                        </a>
                    </div>
                </div>
                <div>
                    <h2 className="text-lg font-bold mb-2">LIÊN HỆ</h2>
                    <p>Địa chỉ: 566 Núi Thành, P. Hòa Cường Nam,</p>
                    <p>Q. Hải Châu, TP. Đà Nẵng</p>
                    <p>Email: <a href="mailto:info@quangnamtourism.com" className="text-blue-400">info@quangnamtourism.com</a></p>
                    <p>Điện thoại: <a href="tel:+123456789" className="text-blue-400">+123 456 789</a></p>
                    <p>Website: <a href="https://www.quangnamtourism.com" className="text-blue-400">quangnamtourism.com</a></p>
                </div>
            </div>
            <div className="text-center mt-8">
                <p>© 2025 Quảng Nam Tourism. All Rights Reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;