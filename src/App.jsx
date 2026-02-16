import "./App.css";
import {Browse, Home, Links, Playlists, Radio, UserBubble, ImportMusic, Library} from "./components";
import Login from "./components/Login";
import Settings from "./components/Settings";
import { Route, Switch, useLocation, useHistory } from "react-router-dom";
import { Play, Pause, SkipBack, SkipForward, Volume2, Heart, Shuffle, Repeat, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import * as playerStore from './utils/playerStore';
import { toggleFavorite, getLibrary } from './utils/musicStore';
import PlaylistView from "./components/PlaylistView";

function App() {
  const location = useLocation();
  const history = useHistory();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [playerState, setPlayerState] = useState(playerStore.getPlayerState());
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('soggify_current_user');
    if (user) {
      try {
        const parsed = JSON.parse(user);
        setCurrentUser(parsed);
        setIsAuthenticated(true);
      } catch (e) {
        console.error('Corrupted soggify_current_user in localStorage, removing:', e);
        localStorage.removeItem('soggify_current_user');
      }
    }
  }, []);

  useEffect(() => {
    // Subscribe to player state changes
    const unsubscribe = playerStore.subscribe((state) => {
      setPlayerState(state);
    });
    
    // Initialize player
    playerStore.initializePlayer();
    
    return unsubscribe;
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('soggify_current_user');
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }
  
  const handleSelectPlaylist = (playlist) => {
    setSelectedPlaylist(playlist);
    history.push(`/playlist/${playlist.id}`);
  };
  
  const getPageTitle = () => {
    if (location.pathname.startsWith('/playlist/')) {
      return selectedPlaylist?.name || 'Playlist';
    }
    switch(location.pathname) {
      case '/browse': return 'Browse';
      case '/radio': return 'Radio';
      case '/library': return 'Your Library';
      case '/import': return 'Import Music';
      case '/settings': return 'Settings';
      default: return 'Home';
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    let percent = (e.clientX - rect.left) / rect.width;
    percent = Math.max(0, Math.min(1, percent));
    const newTime = percent * playerState.duration;
    playerStore.seek(newTime);
  };

  const handleVolumeClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    let percent = (e.clientX - rect.left) / rect.width;
    percent = Math.max(0, Math.min(1, percent));
    playerStore.setVolume(percent);
  };

  const handleToggleFavorite = () => {
    if (playerState.currentSong) {
      toggleFavorite(playerState.currentSong.id);
      // Propagate the change to playerState so the UI reflects immediately
      const updatedSong = getLibrary().songs.find(s => s.id === playerState.currentSong.id);
      if (updatedSong) {
        playerStore.updateCurrentSongFavorite(updatedSong.isFavorite);
      }
    }
  };

  const { currentSong, isPlaying, currentTime, duration, volume, isShuffle, repeatMode } = playerState;

  return (
    <div className="App">
      <section className="left-panel">
        <div className="logo-section">
          <div className="logo">
            <svg viewBox="0 0 24 24" width="32" height="32" fill="url(#gradient)">
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
              <circle cx="12" cy="12" r="10" />
              <path d="M8 12l3 3 5-6" stroke="white" strokeWidth="2" fill="none" />
            </svg>
            <span className="logo-text">Soggify</span>
          </div>
        </div>
        <Links />
        <Playlists onSelectPlaylist={handleSelectPlaylist} />
      </section>
      <section className="middle-panel">
        <section className="header-panel">
          <div className="nav-arrows">
            <button className="nav-btn">‹</button>
            <button className="nav-btn">›</button>
          </div>
          <h1 className="page-title">{getPageTitle()}</h1>
          <div className="header-right">
            <UserBubble user={currentUser} onLogout={handleLogout} />
            <button className="logout-btn" onClick={handleLogout} title="Logout">
              <LogOut size={18} />
            </button>
          </div>
        </section>
        <section className="body-panel">
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/browse" component={Browse} />
            <Route path="/radio" component={Radio} />
            <Route path="/library" component={Library} />
            <Route path="/import" component={ImportMusic} />
            <Route path="/settings" render={() => <Settings currentUser={currentUser} />} />
            <Route path="/playlist/:playlistId" component={PlaylistView} />
          </Switch>
        </section>
      </section>
      
      {/* Now Playing Bar */}
      <div className="now-playing-bar">
        <div className="now-playing-track">
          <div className="track-image">
            <img 
              src={currentSong?.coverArt || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=80&q=80"} 
              alt={currentSong?.title || "No song playing"} 
            />
          </div>
          <div className="track-info">
            <div className="track-name">{currentSong?.title || 'No song playing'}</div>
            <div className="track-artist">{currentSong?.artist || 'Select a song to play'}</div>
          </div>
          <button 
            className={`icon-btn ${currentSong?.isFavorite ? 'active' : ''}`}
            onClick={handleToggleFavorite}
            disabled={!currentSong}
          >
            <Heart size={16} fill={currentSong?.isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>
        
        <div className="player-controls">
          <div className="control-buttons">
            <button 
              className={`control-btn ${isShuffle ? 'active' : ''}`}
              onClick={() => playerStore.toggleShuffle()}
              title={isShuffle ? 'Shuffle on' : 'Shuffle off'}
            >
              <Shuffle size={16} />
            </button>
            <button 
              className="control-btn"
              onClick={async () => await playerStore.previousSong()}
              disabled={!currentSong}
            >
              <SkipBack size={20} />
            </button>
            <button 
              className="play-btn"
              onClick={() => playerStore.togglePlayPause()}
              disabled={!currentSong}
            >
              {isPlaying ? (
                <Pause size={20} fill="currentColor" />
              ) : (
                <Play size={20} fill="currentColor" />
              )}
            </button>
            <button 
              className="control-btn"
              onClick={async () => await playerStore.nextSong()}
              disabled={!currentSong}
            >
              <SkipForward size={20} />
            </button>
            <button 
              className={`control-btn ${repeatMode !== 'off' ? 'active' : ''}`}
              onClick={() => playerStore.toggleRepeat()}
              title={repeatMode === 'off' ? 'Repeat off' : repeatMode === 'all' ? 'Repeat all' : 'Repeat one'}
            >
              <Repeat size={16} />
              {repeatMode === 'one' && <span className="repeat-one-indicator">1</span>}
            </button>
          </div>
          <div className="progress-bar">
            <span className="time">{formatTime(currentTime)}</span>
            <div className="progress" onClick={handleProgressClick}>
              <div 
                className="progress-fill" 
                style={{width: `${duration ? (currentTime / duration) * 100 : 0}%`}}
              ></div>
            </div>
            <span className="time">{formatTime(duration)}</span>
          </div>
        </div>
        
        <div className="volume-control">
          <Volume2 size={18} />
          <div className="volume-bar" onClick={handleVolumeClick}>
            <div className="volume-fill" style={{width: `${volume * 100}%`}}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
