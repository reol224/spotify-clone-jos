import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { playlistsAPI } from '../services/api';
import * as playerStore from '../utils/playerStore';
import { Play, Trash2, Plus } from 'lucide-react';
import { formatDuration } from '../utils/audioParser';
import './Playlists.css';

const PlaylistView = () => {
  const { playlistId } = useParams();
  const history = useHistory();
  const [playlist, setPlaylist] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contextMenu, setContextMenu] = useState(null);

  useEffect(() => {
    loadPlaylist();
  }, [playlistId]);

  const loadPlaylist = async () => {
    try {
      setLoading(true);
      const [playlistData, tracksData] = await Promise.all([
        playlistsAPI.getPlaylistById(playlistId),
        playlistsAPI.getPlaylistTracks(playlistId)
      ]);
      setPlaylist(playlistData);
      setTracks(tracksData);
    } catch (error) {
      console.error('Failed to load playlist:', error);
      setPlaylist(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaySong = (song) => {
    if (tracks?.length > 0) {
      playerStore.playSong(song, tracks);
    }
  };

  const handleRemoveSong = async (e, song) => {
    e.stopPropagation();
    try {
      await playlistsAPI.removeTrackFromPlaylist(playlistId, song.id);
      await loadPlaylist();
    } catch (error) {
      console.error('Failed to remove song:', error);
    }
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

  useEffect(() => {
    if (contextMenu) {
      const handleDocumentClick = () => {
        setContextMenu(null);
      };
      
      document.addEventListener('click', handleDocumentClick);
      document.addEventListener('contextmenu', handleDocumentClick);
      
      return () => {
        document.removeEventListener('click', handleDocumentClick);
        document.removeEventListener('contextmenu', handleDocumentClick);
      };
    }
  }, [contextMenu]);

  if (loading) {
    return (
      <div className="playlist-view">
        <p style={{ color: '#b3b3b3', padding: '20px' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="playlist-view">
      <div className="playlist-header">
        <h2 className="playlist-title">{playlist.name}</h2>
        <p className="playlist-info">{tracks.length} songs</p>
      </div>

      {tracks.length === 0 ? (
        <p style={{ color: '#b3b3b3', padding: '20px' }}>No songs in this playlist</p>
      ) : (
        <div className="songs-list">
          {tracks.map((song) => (
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
              <div className="song-duration">{formatDuration(song.duration) || '0:00'}</div>
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
