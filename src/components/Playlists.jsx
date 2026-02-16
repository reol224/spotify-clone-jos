import React, {useEffect, useState} from "react";
import { playlistsAPI } from '../services/api';
import './Playlists.css'

const Playlists = ({ onSelectPlaylist }) => {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlaylists();
  }, []);

  const loadPlaylists = async () => {
    try {
      const data = await playlistsAPI.getAllPlaylists();
      setPlaylists(data);
    } catch (error) {
      console.error('Failed to load playlists:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="playlists-panel">
      <div>
        <h3 className="playlists-title">Playlists</h3>
        {loading ? (
          <p style={{ color: '#b3b3b3', fontSize: '14px', padding: '0 8px' }}>Loading...</p>
        ) : playlists.length === 0 ? (
          <p style={{ color: '#b3b3b3', fontSize: '14px', padding: '0 8px' }}>No playlists yet</p>
        ) : (
          playlists.map((playlist) => 
            <div className="playlists-item" key={playlist.id}>
              <span
                className="playlists-link"
                style={{ cursor: 'pointer' }}
                onClick={() => onSelectPlaylist && onSelectPlaylist(playlist)}
              >
                {playlist.name}
              </span>
            </div>
          )
        )}
      </div>
    </div>
  );
};
export default Playlists;
