import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getLibrary, subscribe, removeSongFromPlaylist, getSongsForPlaylist } from '../utils/musicStore';
import * as playerStore from '../utils/playerStore';
import { Play, Trash2, Plus } from 'lucide-react';
import './Playlists.css';

const PlaylistView = () => {
  const { playlistId } = useParams();
  const [library, setLibrary] = useState(getLibrary());
  const [playlist, setPlaylist] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);

  useEffect(() => {
    return subscribe(setLibrary);
  }, []);

  useEffect(() => {
    const foundPlaylist = library.playlists?.find(p => p.id === playlistId);
    if (!foundPlaylist) {
      setPlaylist(null);
      return;
    }

    const songs = getSongsForPlaylist(playlistId);
    setPlaylist({ ...foundPlaylist, songs });
  }, [library, playlistId]);

  const handlePlaySong = (song) => {
    if (playlist?.songs) {
      playerStore.playSongs(playlist.songs, song.id);
    }
  };

  const handleRemoveSong = (e, song) => {
    e.stopPropagation();
    removeSongFromPlaylist(playlistId, song.id);
    setContextMenu(null);
  };

  const handleContextMenu = (e, song) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      song: song,
    });
  };

  if (!playlist) {
    return (
      <div className="playlist-view">
        <p style={{ color: '#b3b3b3', padding: '20px' }}>Playlist not found</p>
        <button onClick={() => (window.location.href = '/library')} className="back-btn">
          Back to Library
        </button>
      </div>
    );
  }

  const songs = playlist.songs || [];

  return (
    <div className="playlist-view">
      <div className="playlist-header">
        <h2 className="playlist-title">{playlist.name}</h2>
        <p className="playlist-info">{songs.length} songs</p>
      </div>

      {songs.length === 0 ? (
        <p style={{ color: '#b3b3b3', padding: '20px' }}>No songs in this playlist</p>
      ) : (
        <div className="songs-list">
          {songs.map((song) => (
            <div
              key={song.id}
              className="song-row"
              onClick={() => handlePlaySong(song)}
              onContextMenu={(e) => handleContextMenu(e, song)}
            >
              <div className="song-info">
                <div className="song-title">{song.title}</div>
                <div className="song-artist">{song.artist}</div>
              </div>
              <div className="song-duration">{song.duration || '0:00'}</div>
              <button
                className="play-icon-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePlaySong(song);
                }}
              >
                <Play size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {contextMenu && (
        <div
          className="context-menu"
          style={{
            top: `${contextMenu.y}px`,
            left: `${contextMenu.x}px`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="context-menu-item"
            onClick={(e) => handleRemoveSong(e, contextMenu.song)}
          >
            <Trash2 size={14} />
            Remove from Playlist
          </button>
        </div>
      )}
    </div>
  );
};

export default PlaylistView;
