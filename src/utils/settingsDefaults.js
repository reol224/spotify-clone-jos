// Canonical settings shape shared by Settings.jsx and any other consumers
// All settings keys are defined here as the single source of truth.

// Map of legacy keys -> canonical keys for migration
const LEGACY_KEY_MAP = {
  albumBlur: 'albumArtBlur',
  streamQuality: 'audioQuality',
  gapless: 'gaplessPlayback',
  particles: 'particleEffects',
  listeningActivity: 'shareListeningActivity',
  showLyrics: 'showSongLyrics',
  volumeNorm: 'normalization',
};

export function getDefaultSettings(currentUser = null) {
  return {
    // Profile
    displayName: currentUser?.displayName || 'User',
    email: currentUser?.username || 'user@soggify.com',
    bio: 'Music lover 🎵',

    // Appearance
    theme: 'dark',
    accentColor: 'purple',
    albumArtBlur: true,
    animations: true,
    particleEffects: true,

    // Audio
    audioQuality: 'high',
    normalization: true,
    crossfade: 3,
    replayGain: false,
    bassBoost: false,

    // Notifications
    notifications: true,
    nowPlayingNotifs: false,
    playlistUpdates: true,
    newReleases: true,

    // Privacy
    publicProfile: true,
    showRecentlyPlayed: true,
    shareListeningActivity: false,

    // Playback
    autoplay: true,
    gaplessPlayback: true,
    showSongLyrics: true,
    videoAutoplay: false,
  };
}

/**
 * Migrate legacy key names to canonical ones.
 * Returns a new object with legacy keys replaced.
 */
function migrateLegacyKeys(obj) {
  const migrated = { ...obj };
  for (const [legacy, canonical] of Object.entries(LEGACY_KEY_MAP)) {
    if (legacy in migrated && !(canonical in migrated)) {
      migrated[canonical] = migrated[legacy];
    }
    delete migrated[legacy];
  }
  return migrated;
}

/**
 * Load settings from localStorage, merging with defaults and migrating legacy keys.
 */
export function loadSettings(currentUser = null) {
  const defaults = getDefaultSettings(currentUser);
  try {
    const saved = localStorage.getItem('soggify_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      const migrated = migrateLegacyKeys(parsed);
      // Re-save with canonical keys so migration only happens once
      const merged = { ...defaults, ...migrated };
      localStorage.setItem('soggify_settings', JSON.stringify(merged));
      return merged;
    }
  } catch (e) {
    console.error('Failed to load settings:', e);
  }
  return defaults;
}
