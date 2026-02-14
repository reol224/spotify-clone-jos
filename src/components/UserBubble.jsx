import React, {useEffect, useState} from "react";
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
    <div>
      {isLoading ? (
        <p>Getting user...</p>
      ) : error || !user ? (
        <div className="user-bubble">
          <p>
            <span className="user-name">Not connected</span>
          </p>
        </div>
      ) : (
        <div className="user-bubble">
          <p>
            {profileImage && (
              <img className="profile-icon" src={profileImage} width="30" alt="profile" />
            )}
            <span className="user-name">{user.displayName}</span>
          </p>
        </div>
      )}
    </div>
  );
};
export default UserBubble;
