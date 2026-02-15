import React, { useState } from 'react';
import { 
  User, Lock, Bell, Globe, Palette, Volume2, Music, 
  Zap, Eye, EyeOff, Save, Sparkles, Radio as RadioIcon,
  Headphones, Sliders
} from 'lucide-react';
import './Settings.css';

const Settings = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState({
    // Profile
    displayName: currentUser?.displayName || 'User',
    email: currentUser?.username || 'user@soggify.com',
    bio: 'Music lover 🎵',
    
    // Appearance
    theme: 'dark',
    accentColor: 'purple',
    albumArtBlur: true,
    animations: true,
    particleEffects: true,
    
    // Audio
    audioQuality: 'high',
    normalization: true,
    crossfade: 3,
    replayGain: false,
    bassBoost: false,
    
    // Notifications
    notifications: true,
    nowPlayingNotifs: false,
    playlistUpdates: true,
    newReleases: true,
    
    // Privacy
    publicProfile: true,
    showRecentlyPlayed: true,
    shareListeningActivity: false,
    
    // Playback
    autoplay: true,
    gaplessPlayback: true,
    showSongLyrics: true,
    videoAutoplay: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleSave = () => {
    // Save settings to localStorage or backend
    localStorage.setItem('soggify_settings', JSON.stringify(settings));
    alert('Settings saved! ✨');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'audio', label: 'Audio', icon: Headphones },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: Lock },
    { id: 'playback', label: 'Playback', icon: Music },
  ];

  const accentColors = [
    { name: 'purple', color: '#a855f7' },
    { name: 'pink', color: '#ec4899' },
    { name: 'blue', color: '#3b82f6' },
    { name: 'green', color: '#10b981' },
    { name: 'orange', color: '#f97316' },
    { name: 'red', color: '#ef4444' },
  ];

  const renderTabContent = () => {
    switch(activeTab) {
      case 'profile':
        return (
          <div className="settings-section">
            <h2 className="section-title">
              <Sparkles size={20} />
              Profile Settings
            </h2>
            
            <div className="setting-group">
              <label>Display Name</label>
              <input 
                type="text"
                value={settings.displayName}
                onChange={(e) => setSettings({...settings, displayName: e.target.value})}
                className="settings-input"
              />
            </div>

            <div className="setting-group">
              <label>Email</label>
              <input 
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({...settings, email: e.target.value})}
                className="settings-input"
              />
            </div>

            <div className="setting-group">
              <label>Bio</label>
              <textarea 
                value={settings.bio}
                onChange={(e) => setSettings({...settings, bio: e.target.value})}
                className="settings-textarea"
                rows="3"
                placeholder="Tell us about yourself..."
              />
            </div>

            <div className="setting-group">
              <label>Password</label>
              <div className="password-input-wrapper">
                <input 
                  type={showPassword ? "text" : "password"}
                  placeholder="Change password"
                  className="settings-input"
                />
                <button 
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>
        );

      case 'appearance':
        return (
          <div className="settings-section">
            <h2 className="section-title">
              <Palette size={20} />
              Appearance & Vibe
            </h2>

            <div className="setting-group">
              <label>Accent Color</label>
              <div className="color-picker">
                {accentColors.map(color => (
                  <button
                    key={color.name}
                    className={`color-option ${settings.accentColor === color.name ? 'active' : ''}`}
                    style={{ backgroundColor: color.color }}
                    onClick={() => setSettings({...settings, accentColor: color.name})}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div className="toggle-setting">
              <div className="toggle-info">
                <Sparkles size={18} />
                <div>
                  <div className="toggle-label">Album Art Blur Effect</div>
                  <div className="toggle-description">Dynamic background blur</div>
                </div>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox"
                  checked={settings.albumArtBlur}
                  onChange={(e) => setSettings({...settings, albumArtBlur: e.target.checked})}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="toggle-setting">
              <div className="toggle-info">
                <Zap size={18} />
                <div>
                  <div className="toggle-label">Smooth Animations</div>
                  <div className="toggle-description">Fluid UI transitions</div>
                </div>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox"
                  checked={settings.animations}
                  onChange={(e) => setSettings({...settings, animations: e.target.checked})}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="toggle-setting">
              <div className="toggle-info">
                <Sparkles size={18} />
                <div>
                  <div className="toggle-label">Particle Effects</div>
                  <div className="toggle-description">Funky visual particles</div>
                </div>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox"
                  checked={settings.particleEffects}
                  onChange={(e) => setSettings({...settings, particleEffects: e.target.checked})}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        );

      case 'audio':
        return (
          <div className="settings-section">
            <h2 className="section-title">
              <Headphones size={20} />
              Audio Quality & Effects
            </h2>

            <div className="setting-group">
              <label>Streaming Quality</label>
              <select 
                value={settings.audioQuality}
                onChange={(e) => setSettings({...settings, audioQuality: e.target.value})}
                className="settings-select"
              >
                <option value="low">Low (96kbps) - Save data</option>
                <option value="normal">Normal (160kbps)</option>
                <option value="high">High (320kbps) - Best quality</option>
                <option value="lossless">Lossless - Audiophile</option>
              </select>
            </div>

            <div className="setting-group">
              <label>Crossfade Duration</label>
              <div className="slider-container">
                <input 
                  type="range"
                  min="0"
                  max="12"
                  value={settings.crossfade}
                  onChange={(e) => setSettings({...settings, crossfade: parseInt(e.target.value)})}
                  className="settings-slider"
                />
                <span className="slider-value">{settings.crossfade}s</span>
              </div>
            </div>

            <div className="toggle-setting">
              <div className="toggle-info">
                <Volume2 size={18} />
                <div>
                  <div className="toggle-label">Volume Normalization</div>
                  <div className="toggle-description">Equal volume across tracks</div>
                </div>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox"
                  checked={settings.normalization}
                  onChange={(e) => setSettings({...settings, normalization: e.target.checked})}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="toggle-setting">
              <div className="toggle-info">
                <Sliders size={18} />
                <div>
                  <div className="toggle-label">Bass Boost</div>
                  <div className="toggle-description">Enhanced low frequencies</div>
                </div>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox"
                  checked={settings.bassBoost}
                  onChange={(e) => setSettings({...settings, bassBoost: e.target.checked})}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="toggle-setting">
              <div className="toggle-info">
                <RadioIcon size={18} />
                <div>
                  <div className="toggle-label">ReplayGain</div>
                  <div className="toggle-description">Automatic volume leveling</div>
                </div>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox"
                  checked={settings.replayGain}
                  onChange={(e) => setSettings({...settings, replayGain: e.target.checked})}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="settings-section">
            <h2 className="section-title">
              <Bell size={20} />
              Notification Preferences
            </h2>

            <div className="toggle-setting">
              <div className="toggle-info">
                <Bell size={18} />
                <div>
                  <div className="toggle-label">Enable Notifications</div>
                  <div className="toggle-description">Master notification switch</div>
                </div>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={(e) => setSettings({...settings, notifications: e.target.checked})}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="toggle-setting">
              <div className="toggle-info">
                <Music size={18} />
                <div>
                  <div className="toggle-label">Now Playing Notifications</div>
                  <div className="toggle-description">Show track info in system tray</div>
                </div>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox"
                  checked={settings.nowPlayingNotifs}
                  onChange={(e) => setSettings({...settings, nowPlayingNotifs: e.target.checked})}
                  disabled={!settings.notifications}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="toggle-setting">
              <div className="toggle-info">
                <Sparkles size={18} />
                <div>
                  <div className="toggle-label">Playlist Updates</div>
                  <div className="toggle-description">Notify when playlists change</div>
                </div>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox"
                  checked={settings.playlistUpdates}
                  onChange={(e) => setSettings({...settings, playlistUpdates: e.target.checked})}
                  disabled={!settings.notifications}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="toggle-setting">
              <div className="toggle-info">
                <Zap size={18} />
                <div>
                  <div className="toggle-label">New Releases</div>
                  <div className="toggle-description">Alert for favorite artists</div>
                </div>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox"
                  checked={settings.newReleases}
                  onChange={(e) => setSettings({...settings, newReleases: e.target.checked})}
                  disabled={!settings.notifications}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        );

      case 'privacy':
        return (
          <div className="settings-section">
            <h2 className="section-title">
              <Lock size={20} />
              Privacy & Sharing
            </h2>

            <div className="toggle-setting">
              <div className="toggle-info">
                <Globe size={18} />
                <div>
                  <div className="toggle-label">Public Profile</div>
                  <div className="toggle-description">Let others see your profile</div>
                </div>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox"
                  checked={settings.publicProfile}
                  onChange={(e) => setSettings({...settings, publicProfile: e.target.checked})}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="toggle-setting">
              <div className="toggle-info">
                <Music size={18} />
                <div>
                  <div className="toggle-label">Show Recently Played</div>
                  <div className="toggle-description">Display listening history</div>
                </div>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox"
                  checked={settings.showRecentlyPlayed}
                  onChange={(e) => setSettings({...settings, showRecentlyPlayed: e.target.checked})}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="toggle-setting">
              <div className="toggle-info">
                <Eye size={18} />
                <div>
                  <div className="toggle-label">Share Listening Activity</div>
                  <div className="toggle-description">Broadcast what you're playing</div>
                </div>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox"
                  checked={settings.shareListeningActivity}
                  onChange={(e) => setSettings({...settings, shareListeningActivity: e.target.checked})}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        );

      case 'playback':
        return (
          <div className="settings-section">
            <h2 className="section-title">
              <Music size={20} />
              Playback Preferences
            </h2>

            <div className="toggle-setting">
              <div className="toggle-info">
                <Zap size={18} />
                <div>
                  <div className="toggle-label">Autoplay Similar Tracks</div>
                  <div className="toggle-description">Keep the music going</div>
                </div>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox"
                  checked={settings.autoplay}
                  onChange={(e) => setSettings({...settings, autoplay: e.target.checked})}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="toggle-setting">
              <div className="toggle-info">
                <Music size={18} />
                <div>
                  <div className="toggle-label">Gapless Playback</div>
                  <div className="toggle-description">Seamless transitions</div>
                </div>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox"
                  checked={settings.gaplessPlayback}
                  onChange={(e) => setSettings({...settings, gaplessPlayback: e.target.checked})}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="toggle-setting">
              <div className="toggle-info">
                <Sparkles size={18} />
                <div>
                  <div className="toggle-label">Show Lyrics</div>
                  <div className="toggle-description">Display synchronized lyrics</div>
                </div>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox"
                  checked={settings.showSongLyrics}
                  onChange={(e) => setSettings({...settings, showSongLyrics: e.target.checked})}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>

            <div className="toggle-setting">
              <div className="toggle-info">
                <Eye size={18} />
                <div>
                  <div className="toggle-label">Video Autoplay</div>
                  <div className="toggle-description">Auto-play music videos</div>
                </div>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox"
                  checked={settings.videoAutoplay}
                  onChange={(e) => setSettings({...settings, videoAutoplay: e.target.checked})}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="settings-page-container">
      <div className="settings-content">
        <div className="settings-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={18} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="settings-panel">
          {renderTabContent()}
        </div>
      </div>

      <div className="settings-footer">
        <button className="save-btn" onClick={handleSave}>
          <Save size={18} />
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Settings;
