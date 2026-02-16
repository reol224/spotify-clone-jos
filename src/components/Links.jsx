import React from "react";
import {Link} from 'react-router-dom'
import "./Links.css";

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" style={{verticalAlign: 'middle'}}>
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </svg>
  );
}

function BrowseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" style={{verticalAlign: 'middle'}}>
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 14H4v-4h11v4zm0-5H4V9h11v4zm5 5h-4V9h4v9z" />
    </svg>
  );
}

function RadioIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" style={{verticalAlign: 'middle'}}>
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM7.76 16.24l-1.41 1.41C4.78 16.1 4 14.05 4 12c0-2.05.78-4.1 2.34-5.66l1.41 1.41C6.59 8.93 6 10.46 6 12s.59 3.07 1.76 4.24zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm5.66 1.66l-1.41-1.41C17.41 15.07 18 13.54 18 12s-.59-3.07-1.76-4.24l1.41-1.41C19.22 7.9 20 9.95 20 12c0 2.05-.78 4.1-2.34 5.66zM12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
    </svg>
  );
}

function LibraryIcon() {
    return (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" style={{verticalAlign: 'middle'}}>
        <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-4v4h-2v-4H9V9h4V5h2v4h4v2z" />
      </svg>
    );
  }

function ImportIcon() {
    return (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" style={{verticalAlign: 'middle'}}>
        <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z" />
      </svg>
    );
  }

function SettingsIcon() {
    return (
      <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" style={{verticalAlign: 'middle'}}>
        <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l1.72-1.35c.15-.12.19-.34.1-.51l-1.63-2.83c-.12-.22-.37-.29-.59-.22l-2.03.81c-.42-.32-.9-.6-1.44-.79l-.3-2.16c-.04-.24-.25-.41-.5-.41h-3.26c-.25 0-.46.17-.49.41l-.3 2.16c-.54.19-1.02.47-1.44.79l-2.03-.81c-.22-.09-.47 0-.59.22L2.74 8.87c-.12.22-.04.42.1.51l1.72 1.35c-.05.3-.07.62-.07.94s.02.64.07.94l-1.72 1.35c-.15.12-.19.34-.1.51l1.63 2.83c.12.22.37.29.59.22l2.03-.81c.42.32.9.6 1.44.79l.3 2.16c.04.24.25.41.5.41h3.26c.25 0 .46-.17.49-.41l.3-2.16c.54-.19 1.02-.47 1.44-.79l2.03.81c.22.09.47 0 .59-.22l1.63-2.83c.12-.22.04-.42-.1-.51l-1.72-1.35zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
      </svg>
    );
  }

const Links = () => {
  return (
    <div className="links-panel">
      <div className="link-item">
        <Link to="/" className="link">
          <HomeIcon />
          <span className="link-name">Home</span>
        </Link>
      </div>
      <div className="link-item">
        <Link to="/browse" className="link">
          <BrowseIcon />
          <span className="link-name">Browse</span>
        </Link>
      </div>
      <div className="link-item">
        <Link to="/radio" className="link">
          <RadioIcon />
          <span className="link-name">Radio</span>
        </Link>
      </div>
      <div className="link-item">
        <Link to="/library" className="link">
          <LibraryIcon />
          <span className="link-name">Your Library</span>
        </Link>
      </div>
      <div className="link-item">
        <Link to="/import" className="link">
          <ImportIcon />
          <span className="link-name">Import Music</span>
        </Link>
      </div>
      <div className="link-item">
        <Link to="/settings" className="link">
          <SettingsIcon />
          <span className="link-name">Settings</span>
        </Link>
      </div>
    </div>
  );
};
export default Links;
