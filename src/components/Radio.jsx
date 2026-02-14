import React from "react";
import { Play, Radio as RadioIcon } from 'lucide-react';
import './Radio.css';

const Radio = () => {
  const stations = [
    { 
      name: "Chill Vibes", 
      description: "Relax and unwind with smooth beats",
      img: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&q=80",
      listeners: "12.4K"
    },
    { 
      name: "Workout Mix", 
      description: "High energy tracks to fuel your workout",
      img: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&q=80",
      listeners: "8.9K"
    },
    { 
      name: "Late Night Jazz", 
      description: "Smooth jazz for those late hours",
      img: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400&q=80",
      listeners: "5.2K"
    },
    { 
      name: "90s Nostalgia", 
      description: "The best hits from the 90s",
      img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80",
      listeners: "15.7K"
    },
    { 
      name: "Electronic Pulse", 
      description: "Fresh electronic and house music",
      img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80",
      listeners: "11.3K"
    },
    { 
      name: "Indie Discovery", 
      description: "Discover new indie artists",
      img: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=400&q=80",
      listeners: "6.8K"
    },
  ];

  return (
    <div className="radio-container">
      <div className="radio-header">
        <div className="radio-icon-wrapper">
          <RadioIcon size={48} />
        </div>
        <div>
          <h2 className="radio-title">Radio Stations</h2>
          <p className="radio-subtitle">Endless music tailored to your taste</p>
        </div>
      </div>

      <div className="stations-grid">
        {stations.map((station, index) => (
          <div key={index} className="station-card">
            <div className="station-image-wrapper">
              <img src={station.img} alt={station.name} className="station-image" />
              <button className="station-play-btn">
                <Play size={28} fill="currentColor" />
              </button>
              <div className="live-indicator">
                <span className="live-dot"></span>
                LIVE
              </div>
            </div>
            <div className="station-info">
              <h3 className="station-name">{station.name}</h3>
              <p className="station-description">{station.description}</p>
              <div className="station-listeners">
                <RadioIcon size={14} />
                <span>{station.listeners} listening</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Radio;
