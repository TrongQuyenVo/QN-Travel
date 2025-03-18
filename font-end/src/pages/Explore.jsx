import React from 'react';
import video from '../assets/video2.mp4';
import '../styles/Explore.css';

const places = [
    { name: 'Hội An', image: 'path/to/hoi-an.jpg' },
    { name: 'Mỹ Sơn', image: 'path/to/my-son.jpg' },
    { name: 'Cù Lao Chàm', image: 'path/to/cu-lao-cham.jpg' },
    { name: 'Thánh địa Mỹ Sơn', image: 'path/to/thanh-dia-my-son.jpg' },
];

const Explore = () => {
    return (
        <div className="Explore">

            <div className="explore-container">
                <div className="videoBg">
                    <video src={video} autoPlay loop muted></video>
                </div>
                <h2 className="explore-title">Khám phá các địa điểm nổi bật</h2>
                <div className="places-grid">
                    {places.map((place, index) => (
                        <div key={index} className="place-card">
                            <img src={place.image} alt={place.name} className="place-image" />
                            <div className="place-name">{place.name}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Explore;