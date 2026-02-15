import React, { useState } from 'react';
import './Login.css';

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

const Login = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.username || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    if (isSignUp) {
      // Sign up logic
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }

      // Check if user already exists
      const users = JSON.parse(localStorage.getItem('soggify_users') || '[]');
      if (users.find(u => u.username === formData.username)) {
        setError('Username already exists');
        return;
      }

      // Hash the password
      const passwordHash = await hashPassword(formData.password);

      // Create new user for persistence (with hash, no plaintext)
      const newUser = {
        username: formData.username,
        passwordHash,
        displayName: formData.username,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem('soggify_users', JSON.stringify(users));

      // Safe user object (no password-related fields) for session & callbacks
      const safeUser = {
        username: newUser.username,
        displayName: newUser.displayName,
        createdAt: newUser.createdAt,
      };
      localStorage.setItem('soggify_current_user', JSON.stringify(safeUser));
      onLogin(safeUser);
    } else {
      // Login logic
      const users = JSON.parse(localStorage.getItem('soggify_users') || '[]');
      const passwordHash = await hashPassword(formData.password);
      const user = users.find(u =>
        u.username === formData.username && (u.passwordHash === passwordHash || u.password === formData.password)
      );

      if (!user) {
        setError('Invalid username or password');
        return;
      }

      // If user still has plaintext password, migrate to hash
      if (user.password && !user.passwordHash) {
        user.passwordHash = passwordHash;
        delete user.password;
        localStorage.setItem('soggify_users', JSON.stringify(users));
      }

      // Strip password fields before storing session
      const safeUser = {
        username: user.username,
        displayName: user.displayName,
        createdAt: user.createdAt,
      };
      localStorage.setItem('soggify_current_user', JSON.stringify(safeUser));
      onLogin(safeUser);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-logo">
          <svg viewBox="0 0 24 24" width="48" height="48" fill="url(#gradient)">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
            <circle cx="12" cy="12" r="10" />
            <path d="M8 12l3 3 5-6" stroke="white" strokeWidth="2" fill="none" />
          </svg>
          <h1>Soggify</h1>
        </div>

        <h2>{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
        <p className="login-subtitle">
          {isSignUp ? 'Sign up to get started' : 'Log in to continue'}
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete={isSignUp ? "new-password" : "current-password"}
            />
          </div>

          {isSignUp && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                autoComplete="new-password"
              />
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-btn">
            {isSignUp ? 'Sign Up' : 'Log In'}
          </button>
        </form>

        <div className="toggle-form">
          {isSignUp ? (
            <p>
              Already have an account?{' '}
              <button onClick={() => setIsSignUp(false)}>Log In</button>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <button onClick={() => setIsSignUp(true)}>Sign Up</button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
