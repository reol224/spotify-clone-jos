import React from "react";
import './Browse.css';

const Browse = () => {
  const genres = [
    { name: "Pop", color: "#ff6b9d", img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&q=80" },
    { name: "Rock", color: "#ff4500", img: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=300&q=80" },
    { name: "Hip-Hop", color: "#ffd700", img: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=300&q=80" },
    { name: "Electronic", color: "#00ffff", img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&q=80" },
    { name: "Jazz", color: "#9370db", img: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=300&q=80" },
    { name: "Classical", color: "#daa520", img: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=300&q=80" },
    { name: "R&B", color: "#ff69b4", img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&q=80" },
    { name: "Country", color: "#8b4513", img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&q=80" },
    { name: "Latin", color: "#ff4757", img: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=300&q=80" },
    { name: "Indie", color: "#7bed9f", img: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=300&q=80" },
    { name: "Metal", color: "#2c2c2c", img: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=300&q=80" },
    { name: "Soul", color: "#ff7f50", img: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&q=80" },
  ];

  return (
    <div className="browse-container">
      <h2 className="browse-title">Browse All</h2>
      <div className="genres-grid">
        {genres.map((genre, index) => (
          <div 
            key={index} 
            className="genre-card" 
            style={{ background: `linear-gradient(135deg, ${genre.color}dd 0%, ${genre.color}66 100%)` }}
          >
            <h3 className="genre-name">{genre.name}</h3>
            <div className="genre-image-wrapper">
              <img src={genre.img} alt={genre.name} className="genre-image" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Browse;
