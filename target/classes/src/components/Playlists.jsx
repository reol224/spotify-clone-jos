import React, {useEffect, useState} from "react";
import './Playlists.css'

const Playlists = () => {
  const [playlists, setPlaylists] = useState({});
  const [isLoading, setLoading] = useState(true);

  async function fetchData() {
    const res = await fetch("/api/users/playlists");
    // if(res.ok) {
    //     const data = await res.json();
    //     setPlaylists(data);
    //     setLoading(false);
    // }
    res.json()
      .then(res => {
        setPlaylists(res.items.map(item => {
            return {
              name: item.name,
              href: item.href
            }
          }, []))
        setLoading(false)
      })
      .catch(error => console.log(error));
  }

  useEffect(() => {
    fetchData().then(r => console.log(r));
  }, [setPlaylists, setLoading]);

  return (
    <div className="playlists-panel">
        {(isLoading ? <p>Getting playlists...</p> : 
          <div>
            <h3 className="playlists-title">Playlists</h3>
            {playlists.map(playlist => 
              <div className="playlists-item">
                <a href={playlist.href} className="playlists-link">{playlist.name}</a>
              </div>
            )}
          </div>
        )}
    </div>
  );
};
export default Playlists;