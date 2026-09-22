import { Wallpaper } from '../types';

// IndexedDB persistent storage for user uploaded wallpapers (videos, GIFs, large images)
const DB_NAME = 'AuraTabMediaDB';
const DB_VERSION = 2; // Incremented to migrate and ensure clean object store
const STORE_NAME = 'wallpapers_v2';
const FALLBACK_STORE = 'wallpapers';

export interface StoredWallpaperRecord {
  id: string;
  title: string;
  category: 'custom';
  isVideo: boolean;
  mimeType: string;
  buffer?: ArrayBuffer;
  videoUrl?: string;
  thumbnailUrl: string;
  createdAt: number;
}

const DEFAULT_FALLBACK_THUMB =
  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=600&q=80';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB non supporté'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(FALLBACK_STORE)) {
        db.createObjectStore(FALLBACK_STORE);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Erreur ouverture DB'));
  });
}

/**
 * Saves a local PC file (video, GIF, image) permanently into IndexedDB as an ArrayBuffer.
 * Waiting for transaction completion ensures data is flushed to disk before returning.
 */
export async function saveCustomWallpaper(
  file: File | Blob,
  customTitle?: string
): Promise<Wallpaper> {
  const fileName = (file as File).name || 'fond-anime';
  const fileNameLower = fileName.toLowerCase();
  const isVideo =
    file.type.startsWith('video/') ||
    /\.(mp4|webm|mov|mkv|m4v|avi|ogv)$/i.test(fileNameLower);

  const wpId = `custom-media-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const title =
    customTitle ||
    fileName.replace(/\.[^/.]+$/, '').trim() ||
    (isVideo ? 'Fond Vidéo' : 'Fond Animé');

  // Convert to ArrayBuffer for 100% safe cloneable storage in IndexedDB
  const buffer = await file.arrayBuffer();
  const mimeType = file.type || (isVideo ? 'video/mp4' : 'image/jpeg');

  // Create temporary blob URL to generate thumbnail
  const tempBlob = new Blob([buffer], { type: mimeType });
  const tempUrl = URL.createObjectURL(tempBlob);

  let thumbnailUrl = DEFAULT_FALLBACK_THUMB;
  if (isVideo) {
    try {
      thumbnailUrl = await extractVideoThumbnail(tempUrl);
    } catch {
      thumbnailUrl = DEFAULT_FALLBACK_THUMB;
    }
  } else {
    // For images/GIFs, tempUrl is the display URL
    thumbnailUrl = tempUrl;
  }

  const record: StoredWallpaperRecord = {
    id: wpId,
    title,
    category: 'custom',
    isVideo,
    mimeType,
    buffer,
    thumbnailUrl: isVideo ? thumbnailUrl : '', // Non-videos use generated blob URL
    createdAt: Date.now(),
  };

  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(record);

      req.onerror = () => reject(req.error);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('Erreur sauvegarde IndexedDB:', err);
  }

  // Create clean, persistent Object URL for the current session
  const activeBlob = new Blob([buffer], { type: mimeType });
  const activeUrl = URL.createObjectURL(activeBlob);

  return {
    id: wpId,
    title,
    category: 'custom',
    videoUrl: isVideo ? activeUrl : '',
    thumbnailUrl: isVideo ? thumbnailUrl : activeUrl,
    is4k: false,
  };
}

/**
 * Saves a web URL wallpaper into IndexedDB
 */
export async function saveCustomWallpaperUrl(
  url: string,
  title = 'Fond personnalisé'
): Promise<Wallpaper> {
  const isVideo = /\.(mp4|webm|mov|mkv|m4v)(\?.*)?$/i.test(url);
  const wpId = `custom-url-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  const record: StoredWallpaperRecord = {
    id: wpId,
    title,
    category: 'custom',
    isVideo,
    mimeType: isVideo ? 'video/mp4' : 'image/jpeg',
    videoUrl: isVideo ? url : '',
    thumbnailUrl: url,
    createdAt: Date.now(),
  };

  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(record);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (err) {
    console.warn('Erreur sauvegarde URL IndexedDB:', err);
  }

  return {
    id: wpId,
    title,
    category: 'custom',
    videoUrl: isVideo ? url : '',
    thumbnailUrl: url,
    is4k: false,
  };
}

/**
 * Retrieves all stored custom wallpapers from IndexedDB and generates fresh blob URLs.
 * Call this on page reload to restore every single imported wallpaper!
 */
export async function getAllCustomWallpapers(): Promise<Wallpaper[]> {
  try {
    const db = await openDB();
    const records: StoredWallpaperRecord[] = await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });

    const wallpapers: Wallpaper[] = [];

    // Sort newest first
    records.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

    for (const rec of records) {
      if (rec.buffer) {
        // Reconstruct fresh valid Blob and Object URL from ArrayBuffer
        const blob = new Blob([rec.buffer], { type: rec.mimeType || 'video/mp4' });
        const freshUrl = URL.createObjectURL(blob);

        wallpapers.push({
          id: rec.id,
          title: rec.title,
          category: 'custom',
          videoUrl: rec.isVideo ? freshUrl : '',
          thumbnailUrl: rec.isVideo
            ? (rec.thumbnailUrl || DEFAULT_FALLBACK_THUMB)
            : freshUrl,
          is4k: false,
        });
      } else if (rec.videoUrl || rec.thumbnailUrl) {
        // Web URL record
        wallpapers.push({
          id: rec.id,
          title: rec.title,
          category: 'custom',
          videoUrl: rec.videoUrl || '',
          thumbnailUrl: rec.thumbnailUrl || DEFAULT_FALLBACK_THUMB,
          is4k: false,
        });
      }
    }

    return wallpapers;
  } catch (err) {
    console.warn('Impossible de charger les fonds depuis IndexedDB:', err);
    return [];
  }
}

/**
 * Deletes a custom wallpaper from IndexedDB
 */
export async function deleteCustomWallpaper(id: string): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });

    // Also try legacy store just in case
    try {
      const tx2 = db.transaction(FALLBACK_STORE, 'readwrite');
      const store2 = tx2.objectStore(FALLBACK_STORE);
      store2.delete(id);
    } catch {
      // ignore
    }
  } catch (err) {
    console.warn('Erreur suppression wallpaper:', err);
  }
}

/**
 * Backward compatibility: get raw blob if needed
 */
export async function getWallpaperBlob(id: string): Promise<Blob | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(id);
      req.onsuccess = () => {
        const record = req.result as StoredWallpaperRecord | undefined;
        if (record && record.buffer) {
          resolve(new Blob([record.buffer], { type: record.mimeType }));
        } else {
          resolve(null);
        }
      };
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

/**
 * Rapidly captures a thumbnail frame from a video file or object URL.
 * Never hangs: has a strict 1000ms safety timeout fallback.
 */
export function extractVideoThumbnail(videoSrc: string): Promise<string> {
  return new Promise((resolve) => {
    let resolved = false;
    const finish = (result: string) => {
      if (resolved) return;
      resolved = true;
      clearTimeout(timer);
      try {
        video.src = '';
        video.remove();
      } catch {
        // ignore
      }
      resolve(result);
    };

    // Strict safety timeout so it never blocks or hangs
    const timer = setTimeout(() => {
      finish(DEFAULT_FALLBACK_THUMB);
    }, 1200);

    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.preload = 'auto';

    video.onloadeddata = () => {
      try {
        video.currentTime = Math.min(0.5, Math.max(0.1, (video.duration || 1) / 3));
      } catch {
        finish(DEFAULT_FALLBACK_THUMB);
      }
    };

    video.onseeked = () => {
      try {
        const canvas = document.createElement('canvas');
        const width = 480;
        const height = Math.round((width * (video.videoHeight || 9)) / (video.videoWidth || 16));
        canvas.width = width;
        canvas.height = height || 270;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.75);
          finish(dataUrl);
          return;
        }
      } catch {
        // ignore
      }
      finish(DEFAULT_FALLBACK_THUMB);
    };

    video.onerror = () => {
      finish(DEFAULT_FALLBACK_THUMB);
    };

    try {
      video.src = videoSrc;
      video.load();
    } catch {
      finish(DEFAULT_FALLBACK_THUMB);
    }
  });
}
