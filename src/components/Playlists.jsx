import React, {useEffect, useState} from "react";
import './Playlists.css'

const Playlists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  async function fetchData() {
    try {
      const res = await fetch("/api/user/playlist");
      if (!res.ok) {
        throw new Error(`Request failed with status ${res.status}`);
      }
      const data = await res.json();
      const items = Array.isArray(data?.items) ? data.items : [];
      setPlaylists(items.map(item => {
        return {
          name: item?.name ?? "Untitled Playlist",
          href: item?.externalUrls?.externalUrls?.spotify ?? "#"
        }
      }));
      setLoading(false);
    } catch (err) {
      console.log("Failed to fetch playlists:", err);
      setError(true);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="playlists-panel">
        {isLoading ? <p>Getting playlists...</p> : 
          error ? <p>Could not load playlists</p> :
          <div>
            <h3 className="playlists-title">Playlists</h3>
            {playlists.map((playlist, index) => 
              <div className="playlists-item" key={index}>
                <a href={playlist.href} className="playlists-link">{playlist.name}</a>
              </div>
            )}
          </div>
        }
    </div>
  );
};
export default Playlists;
