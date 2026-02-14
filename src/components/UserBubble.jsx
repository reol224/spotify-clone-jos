import React, {useEffect, useState} from "react";
import { User } from 'lucide-react';
import "./UserBubble.css";

const UserBubble = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  async function fetchData() {
    try {
      const res = await fetch("api/users/me");
      const json = await res.json();
      setUser(json);
      setLoading(false);
      console.log(json);
    } catch (err) {
      console.log("Failed to fetch user:", err);
      setError(true);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const profileImage = user?.images?.[0]?.url;

  return (
    <div className="user-bubble-container">
      {isLoading ? (
        <div className="user-bubble loading">
          <div className="loading-spinner"></div>
        </div>
      ) : error || !user ? (
        <div className="user-bubble">
          <div className="user-avatar placeholder">
            <User size={20} />
          </div>
          <span className="user-name">Not connected</span>
        </div>
      ) : (
        <div className="user-bubble">
          {profileImage ? (
            <img className="user-avatar" src={profileImage} alt="profile" />
          ) : (
            <div className="user-avatar placeholder">
              <User size={20} />
            </div>
          )}
          <span className="user-name">{user.displayName}</span>
        </div>
      )}
    </div>
  );
};
export default UserBubble;
