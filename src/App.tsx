import React, { useState, useEffect } from 'react';
import {
  SearchEngineId,
  Wallpaper,
  Bookmark,
  WidgetLayoutConfig,
} from './types';
import { curatedWallpapers } from './data/wallpapers';
import { defaultBookmarks } from './data/defaultBookmarks';
import {
  saveCustomWallpaper,
  getAllCustomWallpapers,
  deleteCustomWallpaper,
} from './utils/wallpaperStorage';
import { LiveWallpaper } from './components/LiveWallpaper';
import { ClockWidget } from './components/ClockWidget';
import { SearchBar } from './components/SearchBar';
import { BookmarksGrid } from './components/BookmarksGrid';
import { WallpaperSelectorModal } from './components/WallpaperSelectorModal';
import { SettingsModal } from './components/SettingsModal';
import { FirefoxExtensionModal } from './components/FirefoxExtensionModal';
import { SettingsBar } from './components/SettingsBar';
import { Film } from 'lucide-react';

const DEFAULT_CONFIG: WidgetLayoutConfig = {
  preset: 'centered',
  clockPosition: { vertical: 'top', horizontal: 'center', visible: true },
  searchPosition: { vertical: 'center', horizontal: 'center', visible: true },
  bookmarksPosition: { vertical: 'bottom', horizontal: 'center', visible: true },
  is24Hour: true,
  showSeconds: false,
  showGreeting: true,
  wallpaperBrightness: 75,
  wallpaperBlur: 0,
  playbackSpeed: 1,
  uiScale: 1,
  autoHideControls: false,
  language: 'fr',
  timezone: 'local',
  theme: 'dark',
};

export default function App() {
  const [currentEngineId, setCurrentEngineId] = useState<SearchEngineId>(() => {
    const saved = localStorage.getItem('auratab_engine');
    return (saved as SearchEngineId) || 'google';
  });

  const [customWallpapers, setCustomWallpapers] = useState<Wallpaper[]>([]);
  const [isStorageHydrated, setIsStorageHydrated] = useState(false);

  const [currentWallpaper, setCurrentWallpaper] = useState<Wallpaper>(() => {
    try {
      const savedId = localStorage.getItem('auratab_wallpaper_id');
      if (savedId) {
        const found = curatedWallpapers.find((w) => w.id === savedId);
        if (found) return found;
      }
    } catch {
      // ignore
    }
    return curatedWallpapers[0];
  });

  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    try {
      const saved = localStorage.getItem('auratab_bookmarks');
      return saved ? JSON.parse(saved) : defaultBookmarks;
    } catch {
      return defaultBookmarks;
    }
  });

  const [config, setConfig] = useState<WidgetLayoutConfig>(() => {
    try {
      const saved = localStorage.getItem('auratab_layout_config');
      return saved ? { ...DEFAULT_CONFIG, ...JSON.parse(saved) } : DEFAULT_CONFIG;
    } catch {
      return DEFAULT_CONFIG;
    }
  });

  const [isZenMode, setIsZenMode] = useState(false);
  const [activeModal, setActiveModal] = useState<'none' | 'wallpapers' | 'settings' | 'firefox'>('none');
  const [isWindowDragging, setIsWindowDragging] = useState(false);

  useEffect(() => {
    localStorage.setItem('auratab_engine', currentEngineId);
  }, [currentEngineId]);

  useEffect(() => {
    localStorage.setItem('auratab_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('auratab_layout_config', JSON.stringify(config));
  }, [config]);

  // Load and hydrate all custom wallpapers directly from IndexedDB on startup
  useEffect(() => {
    let isMounted = true;

    const hydrateFromStorage = async () => {
      try {
        const savedId = localStorage.getItem('auratab_wallpaper_id');
        const customList = await getAllCustomWallpapers();

        if (!isMounted) return;
        setCustomWallpapers(customList);

        if (savedId) {
          const curatedFound = curatedWallpapers.find((w) => w.id === savedId);
          if (curatedFound) {
            setCurrentWallpaper(curatedFound);
          } else {
            const customFound = customList.find((w) => w.id === savedId);
            if (customFound) {
              setCurrentWallpaper(customFound);
            }
          }
        }
      } catch (err) {
        console.warn('Erreur hydratation fonds personnalisés:', err);
      } finally {
        if (isMounted) {
          setIsStorageHydrated(true);
        }
      }
    };

    hydrateFromStorage();

    return () => {
      isMounted = false;
    };
  }, []);

  // Only persist wallpaper ID AFTER initial storage hydration has completed
  useEffect(() => {
    if (isStorageHydrated && currentWallpaper?.id) {
      localStorage.setItem('auratab_wallpaper_id', currentWallpaper.id);
    }
  }, [currentWallpaper?.id, isStorageHydrated]);

  useEffect(() => {
    const pressedKeys = new Set<string>();

    const handleKeyDown = (e: KeyboardEvent) => {
      pressedKeys.add(e.key.toLowerCase());

      if (e.key === 'Escape') {
        if (activeModal !== 'none') {
          setActiveModal('none');
        } else if (isZenMode) {
          setIsZenMode(false);
        }
      }
      
      // Toggle Firefox extension modal with C + V
      if (pressedKeys.has('c') && pressedKeys.has('v')) {
         setActiveModal('firefox');
      }

      if (
        (e.key === 'z' || e.key === 'Z') &&
        !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
      ) {
        setIsZenMode((prev) => !prev);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      pressedKeys.delete(e.key.toLowerCase());
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [activeModal, isZenMode]);

  const handleAddBookmark = (bm: Bookmark) => {
    setBookmarks((prev) => [...prev, bm]);
  };

  const handleRemoveBookmark = (id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  const handleAddCustomWallpaper = (wp: Wallpaper) => {
    setCustomWallpapers((prev) => [wp, ...prev.filter((item) => item.id !== wp.id)]);
  };

  const handleDeleteCustomWallpaper = async (id: string) => {
    await deleteCustomWallpaper(id);
    setCustomWallpapers((prev) => prev.filter((w) => w.id !== id));
    if (currentWallpaper.id === id) {
      setCurrentWallpaper(curatedWallpapers[0]);
    }
  };

  const handleWindowDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isWindowDragging) {
      setIsWindowDragging(true);
    }
  };

  const handleWindowDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.relatedTarget === null) {
      setIsWindowDragging(false);
    }
  };

  const handleWindowDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWindowDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const fileNameLower = file.name.toLowerCase();
    const isVideo =
      file.type.startsWith('video/') ||
      /\.(mp4|webm|mov|mkv|m4v|avi|ogv)$/i.test(fileNameLower);
    const isImage =
      file.type.startsWith('image/') ||
      /\.(gif|webp|png|jpe?g|bmp)$/i.test(fileNameLower);

    if (!isVideo && !isImage) return;

    try {
      const newWp = await saveCustomWallpaper(file);
      handleAddCustomWallpaper(newWp);
      setCurrentWallpaper(newWp);
    } catch (err) {
      console.warn('Erreur sauvegarde fond par glisser-déposer:', err);
    }
  };

  const handleResetDefaults = () => {
    setConfig(DEFAULT_CONFIG);
    setBookmarks(defaultBookmarks);
  };

  const getHorizontalAlignClass = (align: 'left' | 'center' | 'right') => {
    switch (align) {
      case 'left':
        return 'items-start text-left';
      case 'right':
        return 'items-end text-right';
      case 'center':
      default:
        return 'items-center text-center';
    }
  };

  return (
    <main
      id="auratab-root"
      onDragOver={handleWindowDragOver}
      onDragLeave={handleWindowDragLeave}
      onDrop={handleWindowDrop}
      className="relative w-screen h-screen overflow-hidden select-none bg-black font-sans"
    >
      {/* Global Window Drag & Drop Overlay */}
      {isWindowDragging && (
        <div className="fixed inset-0 z-[2000] bg-blue-600/35 backdrop-blur-md border-4 border-dashed border-blue-400 flex flex-col items-center justify-center pointer-events-none animate-in fade-in duration-150">
          <div className="p-8 rounded-3xl bg-black/85 border border-white/20 shadow-2xl flex flex-col items-center text-center max-w-md mx-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mb-4 animate-bounce">
              <Film className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold text-white mb-1.5">
              Déposez votre fond animé ici !
            </h2>
            <p className="text-xs text-white/60 leading-relaxed">
              Fichier vidéo (MP4, WebM, MOV) ou GIF animé depuis votre PC — appliqué instantanément en fond d'écran !
            </p>
          </div>
        </div>
      )}

      <LiveWallpaper
        wallpaper={currentWallpaper}
        brightness={config.wallpaperBrightness}
        blur={config.wallpaperBlur}
        speed={config.playbackSpeed}
        isZenMode={isZenMode}
        onToggleZen={() => setIsZenMode(!isZenMode)}
      />

      {!isZenMode && (
        <div
          id="widgets-overlay"
          className="relative z-10 w-full h-full flex flex-col justify-between p-6 sm:p-8 lg:p-10 pointer-events-none transition-all duration-500 animate-in fade-in"
        >
          {/* Top Section */}
          <div className="w-full flex flex-col gap-4 pointer-events-auto">
            {config.clockPosition.visible &&
              config.clockPosition.vertical === 'top' && (
                <div
                  className={`w-full flex flex-col ${getHorizontalAlignClass(
                    config.clockPosition.horizontal
                  )}`}
                >
                  <ClockWidget
                    is24Hour={config.is24Hour}
                    showSeconds={config.showSeconds}
                    showGreeting={config.showGreeting}
                    language={config.language}
                    timezone={config.timezone}
                    theme={config.theme}
                  />
                </div>
              )}

            {config.searchPosition.vertical === 'top' && (
              <div
                className={`relative z-40 w-full flex ${
                  config.searchPosition.horizontal === 'left'
                    ? 'justify-start'
                    : config.searchPosition.horizontal === 'right'
                    ? 'justify-end'
                    : 'justify-center'
                }`}
              >
                <SearchBar
                  currentEngineId={currentEngineId}
                  onSelectEngine={setCurrentEngineId}
                  language={config.language}
                  theme={config.theme}
                />
              </div>
            )}
          </div>

          {/* Center Section */}
          <div className="w-full flex flex-col items-center justify-center my-auto py-4 pointer-events-auto gap-5">
            {config.clockPosition.visible &&
              config.clockPosition.vertical === 'center' && (
                <div className="relative z-10">
                  <ClockWidget
                    is24Hour={config.is24Hour}
                    showSeconds={config.showSeconds}
                    showGreeting={config.showGreeting}
                    language={config.language}
                    timezone={config.timezone}
                    theme={config.theme}
                    className="mb-2"
                  />
                </div>
              )}

            {config.searchPosition.vertical === 'center' && (
              <div
                className={`relative z-40 w-full flex ${
                  config.searchPosition.horizontal === 'left'
                    ? 'justify-start'
                    : config.searchPosition.horizontal === 'right'
                    ? 'justify-end'
                    : 'justify-center'
                }`}
              >
                <SearchBar
                  currentEngineId={currentEngineId}
                  onSelectEngine={setCurrentEngineId}
                  language={config.language}
                  theme={config.theme}
                />
              </div>
            )}

            {config.bookmarksPosition.visible &&
              config.bookmarksPosition.vertical === 'center' && (
                <div className="relative z-10">
                  <BookmarksGrid
                    bookmarks={bookmarks}
                    onAddBookmark={handleAddBookmark}
                    onRemoveBookmark={handleRemoveBookmark}
                    language={config.language}
                    theme={config.theme}
                    className="mt-2"
                  />
                </div>
              )}
          </div>

          {/* Bottom Section */}
          <div className="w-full flex flex-col gap-4 pointer-events-auto pb-4">
            {config.searchPosition.vertical === 'bottom' && (
              <div
                className={`relative z-40 w-full flex ${
                  config.searchPosition.horizontal === 'left'
                    ? 'justify-start'
                    : config.searchPosition.horizontal === 'right'
                    ? 'justify-end'
                    : 'justify-center'
                }`}
              >
                <SearchBar
                  currentEngineId={currentEngineId}
                  onSelectEngine={setCurrentEngineId}
                  language={config.language}
                  theme={config.theme}
                />
              </div>
            )}

            {config.bookmarksPosition.visible &&
              config.bookmarksPosition.vertical === 'bottom' && (
                <div className="relative z-10">
                  <BookmarksGrid
                    bookmarks={bookmarks}
                    onAddBookmark={handleAddBookmark}
                    onRemoveBookmark={handleRemoveBookmark}
                    language={config.language}
                    theme={config.theme}
                    isDockMode={config.preset === 'bottom-dock'}
                  />
                </div>
              )}

            {config.clockPosition.visible &&
              config.clockPosition.vertical === 'bottom' && (
                <ClockWidget
                  is24Hour={config.is24Hour}
                  showSeconds={config.showSeconds}
                  showGreeting={config.showGreeting}
                  language={config.language}
                  timezone={config.timezone}
                  theme={config.theme}
                />
              )}
          </div>
        </div>
      )}

      {/* Floating Settings Bar */}
      <SettingsBar
        onOpenWallpapers={() => setActiveModal('wallpapers')}
        onOpenSettings={() => setActiveModal('settings')}
        isZenMode={isZenMode}
        onToggleZen={() => setIsZenMode(!isZenMode)}
        language={config.language}
        theme={config.theme}
      />

      {/* Modals */}
      <WallpaperSelectorModal
        isOpen={activeModal === 'wallpapers'}
        onClose={() => setActiveModal('none')}
        currentWallpaper={currentWallpaper}
        onSelectWallpaper={setCurrentWallpaper}
        speed={config.playbackSpeed}
        onChangeSpeed={(newSpeed) =>
          setConfig((prev) => ({ ...prev, playbackSpeed: newSpeed }))
        }
        onAddCustomWallpaper={handleAddCustomWallpaper}
        customWallpapers={customWallpapers}
        onDeleteCustomWallpaper={handleDeleteCustomWallpaper}
      />

      <SettingsModal
        isOpen={activeModal === 'settings'}
        onClose={() => setActiveModal('none')}
        config={config}
        onChangeConfig={setConfig}
        onResetDefaults={handleResetDefaults}
      />

      <FirefoxExtensionModal
        isOpen={activeModal === 'firefox'}
        onClose={() => setActiveModal('none')}
      />
    </main>
  );
}
