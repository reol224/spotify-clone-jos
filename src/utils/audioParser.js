/**
 * Parse audio file metadata using the Web Audio API and manual ID3 parsing.
 * Falls back gracefully when metadata is unavailable.
 */

function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

/**
 * Parse ID3v2 tags from an ArrayBuffer
 */
function parseID3v2(buffer) {
  const view = new DataView(buffer);
  const result = {
    title: null,
    artist: null,
    album: null,
    year: null,
    genre: null,
    trackNumber: null,
    coverArt: null,
  };

  // Check for ID3v2 header
  if (buffer.byteLength < 10) return result;
  
  const header = String.fromCharCode(view.getUint8(0), view.getUint8(1), view.getUint8(2));
  if (header !== 'ID3') return result;

  const version = view.getUint8(3);
  // const revision = view.getUint8(4);
  // const flags = view.getUint8(5);
  
  // Syncsafe integer for tag size
  const size = (view.getUint8(6) << 21) | (view.getUint8(7) << 14) | (view.getUint8(8) << 7) | view.getUint8(9);

  let offset = 10;
  const end = Math.min(10 + size, buffer.byteLength);

  while (offset < end - 10) {
    let frameId, frameSize, frameData;

    if (version >= 3) {
      // ID3v2.3 / ID3v2.4
      frameId = String.fromCharCode(
        view.getUint8(offset),
        view.getUint8(offset + 1),
        view.getUint8(offset + 2),
        view.getUint8(offset + 3)
      );

      if (frameId.charCodeAt(0) === 0) break;

      if (version === 4) {
        // v2.4 uses syncsafe integers
        frameSize = (view.getUint8(offset + 4) << 21) | (view.getUint8(offset + 5) << 14) | (view.getUint8(offset + 6) << 7) | view.getUint8(offset + 7);
      } else {
        frameSize = view.getUint32(offset + 4);
      }
      // const frameFlags = view.getUint16(offset + 8);
      offset += 10;
      frameData = new Uint8Array(buffer, offset, Math.min(frameSize, end - offset));
    } else if (version === 2) {
      // ID3v2.2 has 3-character frame IDs
      frameId = String.fromCharCode(
        view.getUint8(offset),
        view.getUint8(offset + 1),
        view.getUint8(offset + 2)
      );

      if (frameId.charCodeAt(0) === 0) break;

      frameSize = (view.getUint8(offset + 3) << 16) | (view.getUint8(offset + 4) << 8) | view.getUint8(offset + 5);
      offset += 6;
      frameData = new Uint8Array(buffer, offset, Math.min(frameSize, end - offset));
    } else {
      break;
    }

    // Map v2.2 frame IDs to v2.3+ equivalents
    const frameMap = {
      'TT2': 'TIT2', 'TP1': 'TPE1', 'TAL': 'TALB', 'TYE': 'TYER',
      'TCO': 'TCON', 'TRK': 'TRCK', 'PIC': 'APIC',
    };
    const normalizedFrameId = frameMap[frameId] || frameId;

    try {
      if (normalizedFrameId === 'TIT2') {
        result.title = decodeTextFrame(frameData);
      } else if (normalizedFrameId === 'TPE1') {
        result.artist = decodeTextFrame(frameData);
      } else if (normalizedFrameId === 'TALB') {
        result.album = decodeTextFrame(frameData);
      } else if (normalizedFrameId === 'TYER' || normalizedFrameId === 'TDRC') {
        result.year = decodeTextFrame(frameData);
      } else if (normalizedFrameId === 'TCON') {
        result.genre = decodeTextFrame(frameData);
      } else if (normalizedFrameId === 'TRCK') {
        result.trackNumber = decodeTextFrame(frameData);
      } else if (normalizedFrameId === 'APIC' && !result.coverArt) {
        result.coverArt = decodeAPICFrame(frameData, version);
      }
    } catch (e) {
      // Skip malformed frames
    }

    offset += frameSize;
  }

  return result;
}

function decodeTextFrame(data) {
  if (data.length < 2) return null;
  const encoding = data[0];
  const textBytes = data.slice(1);

  if (encoding === 0) {
    // ISO-8859-1
    return String.fromCharCode(...textBytes).replace(/\0/g, '');
  } else if (encoding === 1) {
    // UTF-16 with BOM
    return decodeUTF16(textBytes);
  } else if (encoding === 2) {
    // UTF-16BE
    return decodeUTF16BE(textBytes);
  } else if (encoding === 3) {
    // UTF-8
    return new TextDecoder('utf-8').decode(textBytes).replace(/\0/g, '');
  }

  return String.fromCharCode(...textBytes).replace(/\0/g, '');
}

function decodeUTF16(bytes) {
  if (bytes.length < 2) return '';
  // Check BOM
  const bom = (bytes[0] << 8) | bytes[1];
  let littleEndian = false;
  let start = 0;

  if (bom === 0xFFFE) {
    littleEndian = true;
    start = 2;
  } else if (bom === 0xFEFF) {
    start = 2;
  }

  let result = '';
  for (let i = start; i < bytes.length - 1; i += 2) {
    const code = littleEndian ? (bytes[i + 1] << 8) | bytes[i] : (bytes[i] << 8) | bytes[i + 1];
    if (code === 0) break;
    result += String.fromCharCode(code);
  }
  return result;
}

function decodeUTF16BE(bytes) {
  let result = '';
  for (let i = 0; i < bytes.length - 1; i += 2) {
    const code = (bytes[i] << 8) | bytes[i + 1];
    if (code === 0) break;
    result += String.fromCharCode(code);
  }
  return result;
}

function decodeAPICFrame(data, version) {
  let offset = 0;
  const encoding = data[offset++];

  if (version === 2) {
    // v2.2: 3-byte image format
    const imgFormat = String.fromCharCode(data[offset], data[offset + 1], data[offset + 2]);
    offset += 3;
    const mimeType = imgFormat === 'JPG' ? 'image/jpeg' : imgFormat === 'PNG' ? 'image/png' : 'image/jpeg';
    const pictureType = data[offset++];
    
    // Skip description
    if (encoding === 0 || encoding === 3) {
      while (offset < data.length && data[offset] !== 0) offset++;
      offset++;
    } else {
      while (offset < data.length - 1 && !(data[offset] === 0 && data[offset + 1] === 0)) offset += 2;
      offset += 2;
    }

    const imageData = data.slice(offset);
    if (imageData.length > 0) {
      return `data:${mimeType};base64,${arrayBufferToBase64(imageData.buffer.slice(imageData.byteOffset, imageData.byteOffset + imageData.length))}`;
    }
    return null;
  }

  // v2.3/v2.4: null-terminated MIME type
  let mimeType = '';
  while (offset < data.length && data[offset] !== 0) {
    mimeType += String.fromCharCode(data[offset]);
    offset++;
  }
  offset++; // skip null

  if (!mimeType) mimeType = 'image/jpeg';

  const pictureType = data[offset++];

  // Skip description
  if (encoding === 0 || encoding === 3) {
    while (offset < data.length && data[offset] !== 0) offset++;
    offset++;
  } else {
    while (offset < data.length - 1 && !(data[offset] === 0 && data[offset + 1] === 0)) offset += 2;
    offset += 2;
  }

  const imageData = data.slice(offset);
  if (imageData.length > 0) {
    return `data:${mimeType};base64,${arrayBufferToBase64(imageData.buffer.slice(imageData.byteOffset, imageData.byteOffset + imageData.length))}`;
  }

  return null;
}

/**
 * Get audio duration using Web Audio API
 */
function getAudioDuration(file) {
  return new Promise((resolve) => {
    const audio = new Audio();
    const url = URL.createObjectURL(file);
    audio.addEventListener('loadedmetadata', () => {
      resolve(audio.duration);
      URL.revokeObjectURL(url);
    });
    audio.addEventListener('error', () => {
      resolve(0);
      URL.revokeObjectURL(url);
    });
    audio.src = url;
  });
}

/**
 * Parse a single audio file and extract metadata
 */
export async function parseAudioFile(file) {
  const id = 'song_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  const audioUrl = URL.createObjectURL(file);

  // Default metadata from filename
  const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
  let metadata = {
    title: nameWithoutExt,
    artist: 'Unknown Artist',
    album: 'Unknown Album',
    year: null,
    genre: null,
    trackNumber: null,
    coverArt: null,
  };

  try {
    const arrayBuffer = await file.arrayBuffer();
    const id3Data = parseID3v2(arrayBuffer);

    if (id3Data.title) metadata.title = id3Data.title;
    if (id3Data.artist) metadata.artist = id3Data.artist;
    if (id3Data.album) metadata.album = id3Data.album;
    if (id3Data.year) metadata.year = id3Data.year;
    if (id3Data.genre) metadata.genre = id3Data.genre;
    if (id3Data.trackNumber) metadata.trackNumber = id3Data.trackNumber;
    if (id3Data.coverArt) metadata.coverArt = id3Data.coverArt;
  } catch (e) {
    console.warn('Failed to parse metadata for', file.name, e);
  }

  let duration = 0;
  try {
    duration = await getAudioDuration(file);
  } catch (e) {
    console.warn('Failed to get duration for', file.name);
  }

  return {
    id,
    ...metadata,
    duration,
    audioUrl,
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    addedAt: new Date().toISOString(),
  };
}

/**
 * Parse multiple audio files
 */
export async function parseAudioFiles(files, onProgress) {
  const results = [];
  const audioExtensions = ['.mp3', '.m4a', '.flac', '.wav', '.ogg', '.aac', '.wma', '.opus', '.webm'];

  const audioFiles = Array.from(files).filter(f => {
    const ext = '.' + f.name.split('.').pop().toLowerCase();
    return audioExtensions.includes(ext) || f.type.startsWith('audio/');
  });

  for (let i = 0; i < audioFiles.length; i++) {
    if (onProgress) onProgress(i + 1, audioFiles.length, audioFiles[i].name);
    const parsed = await parseAudioFile(audioFiles[i]);
    results.push(parsed);
  }

  return results;
}

export function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
