import React, { useState, useEffect } from 'react';
import { Play, Plus, Music, Trash2, ListMusic, Clock, MoreHorizontal, X } from 'lucide-react';
import { getLibrary, subscribe, removeSong, createPlaylist, deletePlaylist, addSongToPlaylist, removeSongFromPlaylist, getSongsForPlaylist } from '../utils/musicStore';
import { formatDuration } from '../utils/audioParser';
import * as playerStore from '../utils/playerStore';
import { useLocation } from 'react-router-dom';
import './Library.css';

const Library = () => {
  const location = useLocation();
  const [library, setLibrary] = useState(getLibrary());
  const [view, setView] = useState('songs'); // 'songs' | 'playlists' | 'playlist-detail'
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [showAddToPlaylist, setShowAddToPlaylist] = useState(null); // songId or null
  const [contextMenu, setContextMenu] = useState(null);

  useEffect(() => {
    const unsub = subscribe((lib) => setLibrary({ ...lib }));
    return unsub;
  }, []);

  useEffect(() => {
    // Check if there's a playlist query parameter
    const params = new URLSearchParams(location.search);
    const playlistId = params.get('playlist');
    
    if (playlistId && view !== 'playlist-detail') {
      const playlist = library.playlists.find(p => p.id === playlistId);
      if (playlist) {
        setSelectedPlaylist(playlist);
        setView('playlist-detail');
      }
    }
  }, [location.search]);

  const handleCreatePlaylist = (e) => {
    e.preventDefault();
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName.trim());
      setNewPlaylistName('');
      setShowCreatePlaylist(false);
    }
  };

  const openPlaylist = (playlist) => {
    setSelectedPlaylist(playlist);
    setView('playlist-detail');
  };

  const playlistSongs = selectedPlaylist ? getSongsForPlaylist(selectedPlaylist.id) : [];
  const playlistCover = playlistSongs.length > 0 && playlistSongs[0].coverArt;

  const handlePlaySong = async (song, songList) => {
    await playerStore.playSong(song, songList);
  };

  const handlePlayPlaylist = async (e, playlist) => {
    e.stopPropagation();
    const songs = getSongsForPlaylist(playlist.id);
    if (songs.length > 0) {
      await playerStore.playSong(songs[0], songs);
    }
  };

  return (
    <div className="library-container">
      {view !== 'playlist-detail' && (
        <>
          <div className="library-tabs">
            <button
              className={`library-tab ${view === 'songs' ? 'library-tab-active' : ''}`}
              onClick={() => setView('songs')}
            >
              <Music size={16} />
              Songs ({library.songs.length})
            </button>
            <button
              className={`library-tab ${view === 'playlists' ? 'library-tab-active' : ''}`}
              onClick={() => setView('playlists')}
            >
              <ListMusic size={16} />
              Playlists ({library.playlists.length})
            </button>
          </div>

          {view === 'songs' && (
            <div className="library-songs">
              {library.songs.length === 0 ? (
                <div className="library-empty">
                  <Music size={48} />
                  <h3>No songs yet</h3>
                  <p>Import music to get started</p>
                </div>
              ) : (
                <>
                  <div className="songs-table-header">
                    <span className="col-num">#</span>
                    <span className="col-title">Title</span>
                    <span className="col-album">Album</span>
                    <span className="col-genre">Genre</span>
                    <span className="col-duration"><Clock size={14} /></span>
                    <span className="col-actions"></span>
                  </div>
                  <div className="songs-list">
                    {library.songs.map((song, index) => (
                      <div 
                        key={song.id} 
                        className="song-row"
                        onClick={() => handlePlaySong(song, library.songs)}
                      >
                        <span className="col-num song-num">{index + 1}</span>
                        <div className="col-title song-title-col">
                          <div className="song-cover-small">
                            {song.coverArt ? (
                              <img src={song.coverArt} alt={song.album} />
                            ) : (
                              <div className="song-cover-placeholder">
                                <Music size={14} />
                              </div>
                            )}
                          </div>
                          <div className="song-title-info">
                            <div className="song-title">{song.title}</div>
                            <div className="song-artist">{song.artist}</div>
                          </div>
                        </div>
                        <span className="col-album song-album">{song.album}</span>
                        <span className="col-genre song-genre">{song.genre || '—'}</span>
                        <span className="col-duration song-duration">{formatDuration(song.duration)}</span>
                        <div className="col-actions">
                          <button
                            className="song-action-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setContextMenu(contextMenu === song.id ? null : song.id);
                            }}
                          >
                            <MoreHorizontal size={16} />
                          </button>
                          {contextMenu === song.id && (
                            <div className="song-context-menu">
                              <button
                                className="context-menu-item"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setShowAddToPlaylist(song.id);
                                  setContextMenu(null);
                                }}
                              >
                                <Plus size={14} /> Add to Playlist
                              </button>
                              <button
                                className="context-menu-item context-menu-danger"
                                onClick={() => {
                                  removeSong(song.id);
                                  setContextMenu(null);
                                }}
                              >
                                <Trash2 size={14} /> Remove
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {view === 'playlists' && (
            <div className="library-playlists">
              <button
                className="create-playlist-btn"
                onClick={() => setShowCreatePlaylist(true)}
              >
                <div className="create-playlist-icon">
                  <Plus size={24} />
                </div>
                <span>Create Playlist</span>
              </button>

              {showCreatePlaylist && (
                <div className="create-playlist-modal-overlay" onClick={() => setShowCreatePlaylist(false)}>
                  <div className="create-playlist-modal" onClick={(e) => e.stopPropagation()}>
                    <h3>Create New Playlist</h3>
                    <form onSubmit={handleCreatePlaylist}>
                      <input
                        type="text"
                        value={newPlaylistName}
                        onChange={(e) => setNewPlaylistName(e.target.value)}
                        placeholder="Playlist name..."
                        className="playlist-name-input"
                        autoFocus
                      />
                      <div className="modal-actions">
                        <button type="button" className="import-btn import-btn-secondary" onClick={() => setShowCreatePlaylist(false)}>
                          Cancel
                        </button>
                        <button type="submit" className="import-btn import-btn-primary" disabled={!newPlaylistName.trim()}>
                          Create
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              <div className="playlists-grid">
                {library.playlists.map((playlist) => {
                  const songs = getSongsForPlaylist(playlist.id);
                  const cover = songs.find(s => s.coverArt)?.coverArt;
                  return (
                    <div
                      key={playlist.id}
                      className="playlist-card"
                      onClick={() => openPlaylist(playlist)}
                    >
                      <div className="playlist-card-cover">
                        {cover ? (
                          <img src={cover} alt={playlist.name} />
                        ) : (
                          <div className="playlist-card-cover-placeholder">
                            <ListMusic size={32} />
                          </div>
                        )}
                        <button className="card-play-btn" onClick={(e) => handlePlayPlaylist(e, playlist)}>
                          <Play size={24} fill="currentColor" />
                        </button>
                      </div>
                      <h3 className="card-title">{playlist.name}</h3>
                      <p className="card-subtitle">{songs.length} track{songs.length !== 1 ? 's' : ''}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {view === 'playlist-detail' && selectedPlaylist && (
        <div className="playlist-detail">
          <button className="back-btn" onClick={() => { setView('playlists'); setSelectedPlaylist(null); }}>
            ← Back to Playlists
          </button>
          <div className="playlist-detail-header">
            <div className="playlist-detail-cover">
              {playlistCover ? (
                <img src={playlistCover} alt={selectedPlaylist.name} />
              ) : (
                <div className="playlist-detail-cover-placeholder">
                  <ListMusic size={48} />
                </div>
              )}
            </div>
            <div className="playlist-detail-info">
              <span className="playlist-label">PLAYLIST</span>
              <h2 className="playlist-detail-name">{selectedPlaylist.name}</h2>
              <p className="playlist-detail-meta">{playlistSongs.length} track{playlistSongs.length !== 1 ? 's' : ''}</p>
              <button
                className="delete-playlist-btn"
                onClick={() => {
                  deletePlaylist(selectedPlaylist.id);
                  setView('playlists');
                  setSelectedPlaylist(null);
                }}
              >
                <Trash2 size={14} /> Delete Playlist
              </button>
            </div>
          </div>

          {playlistSongs.length === 0 ? (
            <div className="library-empty">
              <Music size={48} />
              <h3>This playlist is empty</h3>
              <p>Add songs from your library</p>
            </div>
          ) : (
            <div className="songs-list">
              {playlistSongs.map((song, index) => (
                <div 
                  key={song.id} 
                  className="song-row"
                  onClick={() => handlePlaySong(song, playlistSongs)}
                >
                  <span className="col-num song-num">{index + 1}</span>
                  <div className="col-title song-title-col">
                    <div className="song-cover-small">
                      {song.coverArt ? (
                        <img src={song.coverArt} alt={song.album} />
                      ) : (
                        <div className="song-cover-placeholder">
                          <Music size={14} />
                        </div>
                      )}
                    </div>
                    <div className="song-title-info">
                      <div className="song-title">{song.title}</div>
                      <div className="song-artist">{song.artist}</div>
                    </div>
                  </div>
                  <span className="col-album song-album">{song.album}</span>
                  <span className="col-genre song-genre">{song.genre || '—'}</span>
                  <span className="col-duration song-duration">{formatDuration(song.duration)}</span>
                  <div className="col-actions">
                    <button
                      className="song-action-btn"
                      onClick={() => removeSongFromPlaylist(selectedPlaylist.id, song.id)}
                      title="Remove from playlist"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add to Playlist Modal */}
      {showAddToPlaylist && (
        <div className="create-playlist-modal-overlay" onClick={() => setShowAddToPlaylist(null)}>
          <div className="create-playlist-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Add to Playlist</h3>
            {library.playlists.length === 0 ? (
              <p className="modal-empty">No playlists yet. Create one first!</p>
            ) : (
              <div className="playlist-select-list">
                {library.playlists.map((pl) => (
                  <button
                    key={pl.id}
                    className="playlist-select-item"
                    onClick={() => {
                      addSongToPlaylist(pl.id, showAddToPlaylist);
                      setShowAddToPlaylist(null);
                    }}
                  >
                    <ListMusic size={16} />
                    <span>{pl.name}</span>
                    <span className="playlist-select-count">{pl.songIds.length} tracks</span>
                  </button>
                ))}
              </div>
            )}
            <div className="modal-actions">
              <button className="import-btn import-btn-secondary" onClick={() => setShowAddToPlaylist(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Library;
