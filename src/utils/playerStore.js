// Music player state management
import { getAudioBlob } from './indexedDBStore.js';

let playerState = {
  currentSong: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.7,
  isShuffle: false,
  repeatMode: 'off', // 'off', 'all', 'one'
  queue: [],
  originalQueue: [], // Keep original order for unshuffle
  currentIndex: -1,
};

let listeners = [];
let audioElement = null;
let currentBlobUrl = null; // Track blob URL for cleanup

export function initializePlayer() {
  if (!audioElement) {
    audioElement = new Audio();
    audioElement.volume = playerState.volume;

    audioElement.addEventListener('timeupdate', () => {
      updateState({
        currentTime: audioElement.currentTime,
        duration: audioElement.duration || 0,
      });
    });

    audioElement.addEventListener('ended', () => {
      handleSongEnd();
    });

    audioElement.addEventListener('loadedmetadata', () => {
      updateState({ duration: audioElement.duration });
    });

    audioElement.addEventListener('play', () => {
      updateState({ isPlaying: true });
    });

    audioElement.addEventListener('pause', () => {
      updateState({ isPlaying: false });
    });
  }
  return audioElement;
}

function updateState(updates) {
  playerState = { ...playerState, ...updates };
  notify();
}

function notify() {
  listeners.forEach(l => l(playerState));
}

export function subscribe(listener) {
  listeners.push(listener);
  listener(playerState); // Immediately notify with current state
  return () => {
    listeners = listeners.filter(l => l !== listener);
  };
}

export function getPlayerState() {
  return playerState;
}

export async function setQueue(songs, startIndex = 0) {
  const audio = initializePlayer();
  
  // Shallow-copy to prevent external mutations from corrupting internal state
  const queueCopy = [...songs];
  const originalQueueCopy = [...songs];
  
  updateState({
    queue: queueCopy,
    originalQueue: originalQueueCopy,
    currentIndex: startIndex,
    currentSong: queueCopy[startIndex] || null,
  });

  if (queueCopy[startIndex]) {
    await loadSong(queueCopy[startIndex]);
  }
}

export async function playSong(song, queue = null) {
  const audio = initializePlayer();
  
  if (queue) {
    const index = queue.findIndex(s => s.id === song.id);
    await setQueue(queue, index >= 0 ? index : 0);
  } else {
    updateState({
      currentSong: song,
      currentIndex: playerState.queue.findIndex(s => s.id === song.id),
    });
    try {
      await loadSong(song);
    } catch (error) {
      console.error('Failed to load song:', error);
      updateState({ isPlaying: false });
      alert(error.message || 'Failed to load audio file. Please make sure the song file is available.');
      return;
    }
  }
  
  play();
}

async function loadSong(song) {
  const audio = initializePlayer();
  
  audio.pause();
  audio.currentTime = 0;

  // Helper: revoke previous blob URL and set new src
  const setAudioSrc = (url, isBlobUrl = false) => {
    if (currentBlobUrl) {
      URL.revokeObjectURL(currentBlobUrl);
      currentBlobUrl = null;
    }
    audio.src = url;
    if (isBlobUrl) {
      currentBlobUrl = url;
    }
  };
  
  // Use the audioUrl directly (created from the original file or restored from IndexedDB)
  if (song.audioUrl) {
    setAudioSrc(song.audioUrl, false); // audioUrl may already be managed elsewhere
    console.log('Loading song from audioUrl:', song.fileName || song.title);
    audio.load();
  } else if (song.audioBase64) {
    // Legacy: reconstruct blob URL from base64
    const binaryString = atob(song.audioBase64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: song.audioMimeType || 'audio/mpeg' });
    const url = URL.createObjectURL(blob);
    setAudioSrc(url, true);
    console.log('Loading song from base64 data:', song.fileName || song.title);
    audio.load();
  } else if (song.file) {
    // Fallback: create URL from file if audioUrl is missing
    const url = URL.createObjectURL(song.file);
    setAudioSrc(url, true);
    console.log('Loading song from file object:', song.fileName);
    audio.load();
  } else {
    // Last resort: try to load from IndexedDB
    console.log('Trying to load audio from IndexedDB for:', song.title);
    const record = await getAudioBlob(song.id);
    if (record && record.blob) {
      const url = URL.createObjectURL(record.blob);
      setAudioSrc(url, true);
      console.log('Loading song from IndexedDB:', song.title);
      audio.load();
    } else {
      console.error('No audio source available for song:', song);
      throw new Error(`Cannot play song: no audio source available for "${song.title}"`);
    }
  }
}

export function play() {
  const audio = initializePlayer();
  
  console.log('Attempting to play audio, src:', audio.src);
  console.log('Audio ready state:', audio.readyState);
  console.log('Audio volume:', audio.volume);
  
  const promise = audio.play();
  
  if (promise !== undefined) {
    promise
      .then(() => {
        console.log('Playback started successfully');
        updateState({ isPlaying: true });
      })
      .catch(error => {
        console.error('Playback failed:', error);
        updateState({ isPlaying: false });
      });
  }
}

export function pause() {
  const audio = initializePlayer();
  audio.pause();
}

export function togglePlayPause() {
  if (playerState.isPlaying) {
    pause();
  } else {
    play();
  }
}

export async function nextSong() {
  const { queue, currentIndex, repeatMode } = playerState;
  
  if (queue.length === 0) return;
  
  let nextIndex;
  
  if (repeatMode === 'one') {
    nextIndex = currentIndex;
  } else if (currentIndex < queue.length - 1) {
    nextIndex = currentIndex + 1;
  } else if (repeatMode === 'all') {
    nextIndex = 0;
  } else {
    // End of queue
    pause();
    return;
  }
  
  updateState({
    currentIndex: nextIndex,
    currentSong: queue[nextIndex],
  });
  
  await loadSong(queue[nextIndex]);
  play();
}

export async function previousSong() {
  const { queue, currentIndex, currentTime } = playerState;
  
  if (queue.length === 0) return;
  
  // If more than 3 seconds into the song, restart it
  if (currentTime > 3) {
    seek(0);
    return;
  }
  
  const prevIndex = currentIndex > 0 ? currentIndex - 1 : queue.length - 1;
  
  updateState({
    currentIndex: prevIndex,
    currentSong: queue[prevIndex],
  });
  
  await loadSong(queue[prevIndex]);
  play();
}

export function seek(time) {
  const audio = initializePlayer();
  audio.currentTime = time;
  updateState({ currentTime: time });
}

export function setVolume(volume) {
  const audio = initializePlayer();
  const clampedVolume = Math.max(0, Math.min(1, volume));
  audio.volume = clampedVolume;
  updateState({ volume: clampedVolume });
}

export function toggleShuffle() {
  const { isShuffle, queue, originalQueue, currentSong } = playerState;
  
  if (!isShuffle) {
    // Enable shuffle
    const shuffled = [...queue];
    const currentIndex = shuffled.findIndex(s => s?.id === currentSong?.id);
    
    // Remove current song temporarily
    if (currentIndex >= 0) {
      shuffled.splice(currentIndex, 1);
    }
    
    // Shuffle remaining songs
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    // Put current song at the beginning
    if (currentSong && currentIndex >= 0) {
      shuffled.unshift(currentSong);
    }
    
    updateState({
      isShuffle: true,
      queue: shuffled,
      currentIndex: currentSong ? 0 : -1,
    });
  } else {
    // Disable shuffle - restore original order
    const currentIndex = originalQueue.findIndex(s => s?.id === currentSong?.id);
    updateState({
      isShuffle: false,
      queue: originalQueue,
      currentIndex,
    });
  }
}

export function toggleRepeat() {
  const { repeatMode } = playerState;
  
  let newMode;
  if (repeatMode === 'off') {
    newMode = 'all';
  } else if (repeatMode === 'all') {
    newMode = 'one';
  } else {
    newMode = 'off';
  }
  
  updateState({ repeatMode: newMode });
}

function handleSongEnd() {
  nextSong().catch(e => console.error('Error playing next song:', e));
}

export function addToQueue(songs) {
  const songsArray = Array.isArray(songs) ? songs : [songs];
  updateState({
    queue: [...playerState.queue, ...songsArray],
    originalQueue: [...playerState.originalQueue, ...songsArray],
  });
}

export function clearQueue() {
  updateState({
    queue: [],
    originalQueue: [],
    currentIndex: -1,
    currentSong: null,
  });
  pause();
}

export function removeFromQueue(index) {
  const { queue, originalQueue, currentIndex } = playerState;

  // Guard: validate index
  if (!Number.isSafeInteger(index) || index < 0 || index >= queue.length) {
    return; // no-op for invalid index
  }

  const newQueue = queue.filter((_, i) => i !== index);
  const removedSong = queue[index];
  const newOriginalQueue = originalQueue.filter(s => s.id !== removedSong.id);
  
  let newCurrentIndex = currentIndex;
  if (index < currentIndex) {
    newCurrentIndex = currentIndex - 1;
  } else if (index === currentIndex) {
    // Current song was removed, stop playback
    pause();
    newCurrentIndex = -1;
  }
  
  updateState({
    queue: newQueue,
    originalQueue: newOriginalQueue,
    currentIndex: newCurrentIndex,
    currentSong: newCurrentIndex >= 0 ? newQueue[newCurrentIndex] : null,
  });
}

export function updateCurrentSongFavorite(isFavorite) {
  if (playerState.currentSong) {
    updateState({
      currentSong: { ...playerState.currentSong, isFavorite },
    });
  }
}
