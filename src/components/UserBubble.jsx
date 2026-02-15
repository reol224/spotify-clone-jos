import React from "react";
import { User } from 'lucide-react';
import "./UserBubble.css";

const UserBubble = ({ user }) => {
  return (
    <div className="user-bubble-container">
      <div className="user-bubble">
        <div className="user-avatar placeholder">
          <User size={20} />
        </div>
        <span className="user-name">{user?.displayName || 'Guest'}</span>
      </div>
    </div>
  );
};
export default UserBubble;
