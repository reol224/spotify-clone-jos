import "./App.css";
import {Browse, Home, Links, Playlists, Radio, UserBubble, ImportMusic, Library} from "./components";
import Login from "./components/Login";
import Settings from "./components/Settings";
import {Route, Switch, useLocation} from "react-router-dom";
import { Play, SkipBack, SkipForward, Volume2, Heart, Shuffle, Repeat, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';

function App() {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem('soggify_current_user');
    if (user) {
      setCurrentUser(JSON.parse(user));
      setIsAuthenticated(true);
    }
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
  
  const getPageTitle = () => {
    switch(location.pathname) {
      case '/browse': return 'Browse';
      case '/radio': return 'Radio';
      case '/library': return 'Your Library';
      case '/import': return 'Import Music';
      case '/settings': return 'Settings';
      default: return 'Home';
    }
  };

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
        <Playlists />
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
          </Switch>
        </section>
      </section>
      
      {/* Now Playing Bar */}
      <div className="now-playing-bar">
        <div className="now-playing-track">
          <div className="track-image">
            <img src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=80&q=80" alt="Album" />
          </div>
          <div className="track-info">
            <div className="track-name">Electric Dreams</div>
            <div className="track-artist">The Synthwave</div>
          </div>
          <button className="icon-btn">
            <Heart size={16} />
          </button>
        </div>
        
        <div className="player-controls">
          <div className="control-buttons">
            <button className="control-btn"><Shuffle size={16} /></button>
            <button className="control-btn"><SkipBack size={20} /></button>
            <button className="play-btn">
              <Play size={20} fill="currentColor" />
            </button>
            <button className="control-btn"><SkipForward size={20} /></button>
            <button className="control-btn"><Repeat size={16} /></button>
          </div>
          <div className="progress-bar">
            <span className="time">1:24</span>
            <div className="progress">
              <div className="progress-fill" style={{width: '35%'}}></div>
            </div>
            <span className="time">3:45</span>
          </div>
        </div>
        
        <div className="volume-control">
          <Volume2 size={18} />
          <div className="volume-bar">
            <div className="volume-fill" style={{width: '70%'}}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
