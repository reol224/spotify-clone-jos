import React, {useEffect, useState} from "react";
import { getLibrary, subscribe } from '../utils/musicStore';
import './Playlists.css'

const Playlists = ({ onSelectPlaylist }) => {
  const [library, setLibrary] = useState(getLibrary());

  useEffect(() => {
    return subscribe(setLibrary);
  }, []);

  const playlists = library.playlists || [];

  return (
    <div className="playlists-panel">
      <div>
        <h3 className="playlists-title">Playlists</h3>
        {playlists.length === 0 ? (
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
