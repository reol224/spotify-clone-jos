import React, { useState, useRef, useCallback } from 'react';
import { Upload, Music, X, Loader2, CheckCircle, AlertCircle, FolderOpen } from 'lucide-react';
import { parseAudioFiles } from '../utils/audioParser';
import { addSongs } from '../utils/musicStore';
import './ImportMusic.css';

const ImportMusic = ({ onImportComplete }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0, fileName: '' });
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const processFiles = useCallback(async (files) => {
    if (!files || files.length === 0) return;

    setIsProcessing(true);
    setError(null);
    setResults(null);

    try {
      const parsed = await parseAudioFiles(files, (current, total, fileName) => {
        setProgress({ current, total, fileName });
      });

      if (parsed.length === 0) {
        setError('No audio files found. Supported formats: MP3, M4A, FLAC, WAV, OGG, AAC, OPUS');
        setIsProcessing(false);
        return;
      }

      addSongs(parsed);
      setResults(parsed);

      if (onImportComplete) {
        onImportComplete(parsed);
      }
    } catch (err) {
      console.error('Import error:', err);
      setError('Failed to import some files. Please try again.');
    }

    setIsProcessing(false);
  }, [onImportComplete]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const items = e.dataTransfer.items;
    if (items) {
      const files = [];
      const processEntry = async (entry) => {
        if (entry.isFile) {
          return new Promise((resolve, reject) => {
            entry.file((file) => {
              files.push(file);
              resolve();
            }, (err) => {
              reject(err);
            });
          });
        } else if (entry.isDirectory) {
          const reader = entry.createReader();
          return new Promise((resolve, reject) => {
            const readAllEntries = () => {
              reader.readEntries(async (entries) => {
                try {
                  if (entries.length === 0) {
                    resolve();
                    return;
                  }
                  for (const e of entries) {
                    await processEntry(e);
                  }
                  readAllEntries();
                } catch (err) {
                  reject(err);
                }
              }, (err) => {
                reject(err);
              });
            };
            readAllEntries();
          });
        }
      };

      const entries = [];
      for (let i = 0; i < items.length; i++) {
        const entry = items[i].webkitGetAsEntry?.();
        if (entry) entries.push(entry);
      }

      Promise.all(entries.map(processEntry)).then(() => {
        processFiles(files);
      });
    } else {
      processFiles(Array.from(e.dataTransfer.files));
    }
  }, [processFiles]);

  const handleFileSelect = (e) => {
    processFiles(Array.from(e.target.files));
    e.target.value = '';
  };

  const resetImport = () => {
    setResults(null);
    setError(null);
    setProgress({ current: 0, total: 0, fileName: '' });
  };

  return (
    <div className="import-music-container">
      <div className="import-header">
        <h2 className="import-title">Import Music</h2>
        <p className="import-subtitle">Add your music files. We'll automatically read album art, artist info, and more from each track.</p>
      </div>

      {!isProcessing && !results && (
        <>
          <div
            className={`drop-zone ${isDragging ? 'drop-zone-active' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="drop-zone-content">
              <div className="drop-icon">
                <Upload size={48} />
              </div>
              <h3 className="drop-title">
                {isDragging ? 'Drop your files here' : 'Drag & drop music files'}
              </h3>
              <p className="drop-subtitle">or click to browse</p>
              <p className="drop-formats">MP3, M4A, FLAC, WAV, OGG, AAC, OPUS</p>
            </div>
          </div>

          <div className="import-actions">
            <button className="import-btn import-btn-primary" onClick={() => fileInputRef.current?.click()}>
              <Music size={18} />
              Select Files
            </button>
            <button className="import-btn import-btn-secondary" onClick={() => folderInputRef.current?.click()}>
              <FolderOpen size={18} />
              Import Folder
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="audio/*,.mp3,.m4a,.flac,.wav,.ogg,.aac,.opus,.wma,.webm"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          <input
            ref={folderInputRef}
            type="file"
            webkitdirectory=""
            directory=""
            multiple
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </>
      )}

      {isProcessing && (
        <div className="processing-state">
          <div className="processing-spinner">
            <Loader2 size={48} className="spin" />
          </div>
          <h3 className="processing-title">Processing your music...</h3>
          <p className="processing-info">
            Parsing {progress.current} of {progress.total} files
          </p>
          {progress.fileName && (
            <p className="processing-file">{progress.fileName}</p>
          )}
          <div className="processing-bar">
            <div
              className="processing-bar-fill"
              style={{ width: progress.total > 0 ? `${(progress.current / progress.total) * 100}%` : '0%' }}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="import-error">
          <AlertCircle size={20} />
          <span>{error}</span>
          <button className="error-dismiss" onClick={() => setError(null)}>
            <X size={16} />
          </button>
        </div>
      )}

      {results && (
        <div className="import-results">
          <div className="results-header">
            <CheckCircle size={24} className="success-icon" />
            <div>
              <h3 className="results-title">Successfully imported {results.length} track{results.length !== 1 ? 's' : ''}</h3>
              <p className="results-subtitle">Your music is ready to play</p>
            </div>
          </div>

          <div className="results-list">
            {results.map((song) => (
              <div key={song.id} className="result-item">
                <div className="result-cover">
                  {song.coverArt ? (
                    <img src={song.coverArt} alt={song.album} />
                  ) : (
                    <div className="result-cover-placeholder">
                      <Music size={20} />
                    </div>
                  )}
                </div>
                <div className="result-info">
                  <div className="result-name">{song.title}</div>
                  <div className="result-meta">
                    {song.artist}
                    {song.album !== 'Unknown Album' && <span> · {song.album}</span>}
                    {song.year && <span> · {song.year}</span>}
                  </div>
                </div>
                {song.genre && (
                  <span className="result-genre">{song.genre}</span>
                )}
              </div>
            ))}
          </div>

          <div className="results-actions">
            <button className="import-btn import-btn-primary" onClick={resetImport}>
              <Upload size={18} />
              Import More
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportMusic;
