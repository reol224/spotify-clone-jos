import React, { useState, useEffect } from "react";
import { Play, Music2, Sparkles } from 'lucide-react';
import './Home.css';
import { getLibrary, subscribe } from '../utils/musicStore';

const Home = () => {
  const [library, setLibrary] = useState(getLibrary());

  useEffect(() => {
    const unsubscribe = subscribe((newLibrary) => {
      setLibrary(newLibrary);
    });
    return unsubscribe;
  }, []);

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Group songs by album
  const getAlbums = () => {
    const albumMap = {};
    library.songs.forEach(song => {
      const albumKey = `${song.album || 'Unknown Album'}_${song.artist || 'Unknown Artist'}`;
      if (!albumMap[albumKey]) {
        albumMap[albumKey] = {
          title: song.album || 'Unknown Album',
          artist: song.artist || 'Unknown Artist',
          img: song.coverArt || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80',
          songs: []
        };
      }
      albumMap[albumKey].songs.push(song);
    });
    return Object.values(albumMap);
  };

  const albums = getAlbums();
  const recentlyPlayed = library.songs.slice(-4).reverse(); // Last 4 songs added

  return (
    <div className="home-container">
      <section className="greeting-section">
        <h2 className="greeting">{getTimeBasedGreeting()}</h2>
      </section>

      <section className="quick-picks">
        {recentlyPlayed.length > 0 ? (
          recentlyPlayed.slice(0, 4).map((song, index) => (
            <div key={song.id || index} className="quick-pick-card">
              <img src={song.coverArt || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80'} alt={song.title} />
              <div className="quick-pick-info">
                <div className="quick-pick-title">{song.title}</div>
              </div>
              <button className="quick-pick-play">
                <Play size={20} fill="currentColor" />
              </button>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <Music2 size={48} />
            <p>Your quick picks are taking a coffee break ☕</p>
            <p className="empty-subtitle">Import some music to get this party started!</p>
          </div>
        )}
      </section>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Your Albums</h2>
          {albums.length > 6 && <button type="button" className="section-link">Show all</button>}
        </div>
        {albums.length > 0 ? (
          <div className="cards-grid">
            {albums.slice(0, 6).map((album, index) => (
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
        ) : (
          <div className="empty-state-section">
            <Sparkles size={64} className="empty-icon" />
            <h3 className="empty-title">Your album collection is feeling shy 🎭</h3>
            <p className="empty-text">Head over to "Import Music" and give your library some love!</p>
          </div>
        )}
      </section>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Recently Added</h2>
          {recentlyPlayed.length > 4 && <button type="button" className="section-link">Show all</button>}
        </div>
        {recentlyPlayed.length > 0 ? (
          <div className="cards-grid">
            {recentlyPlayed.map((song, index) => (
              <div key={song.id || index} className="music-card">
                <div className="card-image-wrapper">
                  <img src={song.coverArt || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80'} alt={song.title} className="card-image" />
                  <button className="card-play-btn">
                    <Play size={24} fill="currentColor" />
                  </button>
                </div>
                <h3 className="card-title">{song.title}</h3>
                <p className="card-subtitle">{song.artist || 'Unknown Artist'}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state-section">
            <Music2 size={64} className="empty-icon" />
            <h3 className="empty-title">Nothing's been played yet... silence is golden? 🤔</h3>
            <p className="empty-text">Drop some tunes in your library and let the music do the talking!</p>
          </div>
        )}
      </section>
    </div>
  );
};
export default Home;
