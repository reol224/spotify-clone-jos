import React, { useState } from "react";
import { User, Settings, Moon, Bell, ChevronDown, Music } from 'lucide-react';
import { Link } from 'react-router-dom';
import "./UserBubble.css";

const UserBubble = ({ user, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    // Try to sync with saved settings
    try {
      const saved = localStorage.getItem('soggify_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.theme || 'dark';
      }
    } catch (e) { /* ignore */ }
    return 'dark';
  });
  const [notifications, setNotifications] = useState(true);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    // Use classList to only toggle the theme class without overwriting other classes
    document.body.classList.remove('dark-mode', 'light-mode');
    document.body.classList.add(newTheme === 'dark' ? 'dark-mode' : 'light-mode');
    // Persist theme choice in settings
    try {
      const saved = localStorage.getItem('soggify_settings');
      const settings = saved ? JSON.parse(saved) : {};
      settings.theme = newTheme;
      localStorage.setItem('soggify_settings', JSON.stringify(settings));
    } catch (e) { /* ignore */ }
  };

  const toggleNotifications = () => {
    setNotifications(!notifications);
  };

  return (
    <div className="user-bubble-container">
        <button 
          className="user-bubble dropdown-trigger"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="user-avatar placeholder">
            <User size={20} />
          </div>
          <span className="user-name">{user?.displayName || 'Guest'}</span>
          <ChevronDown size={16} className="dropdown-arrow" />
        </button>

        {isOpen && (
          <div className="user-dropdown-menu">
            <div className="dropdown-header">
              <div className="user-info">
                <div className="user-avatar-large">
                  <User size={24} />
                </div>
                <div>
                  <div className="user-display-name">{user?.displayName || 'User'}</div>
                  <div className="user-email">{user?.username || 'user@soggify'}</div>
                </div>
              </div>
            </div>

            <div className="dropdown-divider"></div>

            <div className="dropdown-options">
            <Link
              to="/settings"
              className="dropdown-option"
              title="Account settings"
              onClick={() => setIsOpen(false)}
            >
              <Settings size={18} />
              <span>Settings</span>
            </Link>
            
            <button 
              className="dropdown-option" 
              onClick={toggleTheme}
              title="Toggle dark/light theme"
            >
              <Moon size={18} />
              <span>Theme ({theme === 'dark' ? 'Dark' : 'Light'})</span>
            </button>
            
            <button 
              className="dropdown-option" 
              onClick={toggleNotifications}
              title="Toggle notifications"
            >
              <Bell size={18} />
              <span>Notifications ({notifications ? 'On' : 'Off'})</span>
            </button>

            <button className="dropdown-option" title="Download playlist">
              <Music size={18} />
              <span>Downloads</span>
            </button>
          </div>

          <div className="dropdown-divider"></div>

          <button 
            className="dropdown-option logout-option"
            onClick={onLogout}
            title="Sign out"
          >
            <span>Sign Out</span>
          </button>
        </div>
      )}
      </div>
  );
};
export default UserBubble;
