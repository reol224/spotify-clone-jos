import React from "react";
import { Play } from 'lucide-react';
import './Home.css';

const Home = () => {
  const featuredAlbums = [
    { title: "Midnight Vibes", artist: "Luna Wave", img: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=400&q=80" },
    { title: "Electric Soul", artist: "Neon Dreams", img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80" },
    { title: "Ocean Breeze", artist: "Coastal Harmony", img: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&q=80" },
    { title: "Urban Nights", artist: "City Sounds", img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80" },
    { title: "Retro Future", artist: "Synthwave Collective", img: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=400&q=80" },
    { title: "Jazz Lounge", artist: "The Smooth Trio", img: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400&q=80" },
  ];

  const recentlyPlayed = [
    { title: "Sunset Dreams", artist: "Wave Rider", img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80" },
    { title: "Cosmic Dance", artist: "Star Gazers", img: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=400&q=80" },
    { title: "Morning Chill", artist: "Cafe Beats", img: "https://images.unsplash.com/photo-1490971524970-1918cb3b2398?w=400&q=80" },
    { title: "Bass Drop", artist: "Electronic Pulse", img: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&q=80" },
  ];

  return (
    <div className="home-container">
      <section className="greeting-section">
        <h2 className="greeting">Good evening</h2>
      </section>

      <section className="quick-picks">
        {recentlyPlayed.slice(0, 4).map((item, index) => (
          <div key={index} className="quick-pick-card">
            <img src={item.img} alt={item.title} />
            <div className="quick-pick-info">
              <div className="quick-pick-title">{item.title}</div>
            </div>
            <button className="quick-pick-play">
              <Play size={20} fill="currentColor" />
            </button>
          </div>
        ))}
      </section>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Featured Albums</h2>
          <a href="#" className="section-link">Show all</a>
        </div>
        <div className="cards-grid">
          {featuredAlbums.map((album, index) => (
            <div key={index} className="music-card">
              <div className="card-image-wrapper">
                <img src={album.img} alt={album.title} className="card-image" />
                <button className="card-play-btn">
                  <Play size={24} fill="currentColor" />
                </button>
              </div>
              <h3 className="card-title">{album.title}</h3>
              <p className="card-subtitle">{album.artist}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Recently Played</h2>
          <a href="#" className="section-link">Show all</a>
        </div>
        <div className="cards-grid">
          {recentlyPlayed.map((item, index) => (
            <div key={index} className="music-card">
              <div className="card-image-wrapper">
                <img src={item.img} alt={item.title} className="card-image" />
                <button className="card-play-btn">
                  <Play size={24} fill="currentColor" />
                </button>
              </div>
              <h3 className="card-title">{item.title}</h3>
              <p className="card-subtitle">{item.artist}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
export default Home;
