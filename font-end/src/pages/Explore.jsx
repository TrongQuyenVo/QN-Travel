import React, { useState, useEffect } from 'react';
import video from '../assets/video2.mp4';
import '../styles/Explore.css';

const Explore = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <div className="Introduce">
            <div className="introduce-container">
                <div className="videoBg">
                    <video src={video} autoPlay loop muted></video>
                    <div className="overlay"></div>
                </div>

                <div className={`introduce-content ${isVisible ? 'fade-in' : ''}`}>
                    <h1 className="introduce-title">
                        <span className="highlight">Quảng Nam</span> - Di Sản & Trải Nghiệm
                    </h1>

                    <div className="introduce-description">
                        <p className="introduce-text">
                            Quảng Nam, mảnh đất giàu truyền thống văn hóa và lịch sử, là điểm đến hấp dẫn đối với du khách trong và ngoài nước.
                            Với hai di sản văn hóa thế giới được UNESCO công nhận là <span className="highlight">Phố cổ Hội An</span> và <span className="highlight">Thánh địa Mỹ Sơn</span>,
                            Quảng Nam mang đến những trải nghiệm độc đáo, kết hợp giữa vẻ đẹp cổ kính và thiên nhiên thơ mộng.
                        </p>

                        <div className="attraction-highlights">
                            <div className="highlight-item">
                                <h3>Di Sản Văn Hóa</h3>
                                <p>Khám phá Phố Cổ Hội An với những ngôi nhà cổ hàng trăm năm tuổi và Thánh địa Mỹ Sơn - trung tâm văn hóa tôn giáo của vương quốc Chăm Pa.</p>
                            </div>

                            <div className="highlight-item">
                                <h3>Thiên Nhiên Kỳ Vĩ</h3>
                                <p>Thư giãn tại những bãi biển hoang sơ như Cửa Đại, An Bàng, và khám phá Khu dự trữ sinh quyển thế giới Cù Lao Chàm với hệ sinh thái biển phong phú.</p>
                            </div>

                            <div className="highlight-item">
                                <h3>Ẩm Thực Đặc Sắc</h3>
                                <p>Thưởng thức cao lầu, mì Quảng, bánh đập và nhiều món ngon đặc trưng khác chỉ có thể tìm thấy tại vùng đất này.</p>
                            </div>
                        </div>

                        <p className="introduce-summary">
                            Hãy cùng khám phá Quảng Nam - nơi hội tụ những giá trị văn hóa, lịch sử và thiên nhiên đặc sắc!
                            Từ những con phố rợp đèn lồng ở Hội An đến những bãi biển hoang sơ và núi rừng hùng vĩ, mỗi góc nhỏ của Quảng Nam đều mang đến cho du khách những trải nghiệm khó quên.
                        </p>
                    </div>

                    <div className="cta-container">
                        <button className="cta-button">Khám Phá Ngay</button>
                        <button className="cta-button outline">Xem Lịch Trình</button>
                    </div>

                    <div className="stats-container">
                        <div className="stat-item">
                            <span className="stat-number">2</span>
                            <span className="stat-text">Di sản UNESCO</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">125</span>
                            <span className="stat-text">km bờ biển</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">400+</span>
                            <span className="stat-text">công trình lịch sử</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Explore;