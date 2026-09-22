import React from 'react';
import {
  Image as ImageIcon,
  Settings,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { AppLanguage, AppTheme } from '../types';

interface SettingsBarProps {
  onOpenWallpapers: () => void;
  onOpenSettings: () => void;
  isZenMode: boolean;
  onToggleZen: () => void;
  language?: AppLanguage;
  theme?: AppTheme;
}

export const SettingsBar: React.FC<SettingsBarProps> = ({
  onOpenWallpapers,
  onOpenSettings,
  isZenMode,
  onToggleZen,
  language = 'fr',
  theme = 'dark',
}) => {
  const isEn = language === 'en';
  const isLight = theme === 'light';

  if (isZenMode) {
    return (
      <div className="fixed top-4 right-4 z-40 animate-in fade-in duration-300">
        <button
          type="button"
          id="exit-zen-btn"
          onClick={onToggleZen}
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full backdrop-blur-md border text-xs shadow-lg transition-all group ${
            isLight
              ? 'bg-white/80 hover:bg-white text-slate-800 border-black/10'
              : 'bg-black/50 hover:bg-black/80 text-white/80 hover:text-white border-white/15'
          }`}
          title={isEn ? 'Exit Zen Mode (Esc or Z)' : 'Quitter le mode Zen (Échap ou Z)'}
        >
          <Minimize2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          <span>{isEn ? 'Show widgets' : 'Afficher les widgets'}</span>
        </button>
      </div>
    );
  }

  return (
    <div
      id="floating-settings-bar"
      className={`fixed bottom-4 right-4 z-40 flex items-center gap-1.5 p-1.5 rounded-2xl backdrop-blur-xl border transition-all duration-300 shadow-xl opacity-75 hover:opacity-100 ${
        isLight
          ? 'bg-white/80 hover:bg-white/95 border-black/15 text-slate-800'
          : 'bg-black/45 hover:bg-black/75 border-white/15 hover:border-white/30 text-white'
      }`}
    >
      {/* Wallpapers Modal Trigger */}
      <button
        type="button"
        id="open-wallpaper-selector-btn"
        onClick={onOpenWallpapers}
        className={`p-2 rounded-xl transition-all text-xs flex items-center gap-1.5 ${
          isLight
            ? 'text-slate-700 hover:text-slate-950 hover:bg-black/5'
            : 'text-white/70 hover:text-white hover:bg-white/15'
        }`}
        title={isEn ? 'Change Wallpaper' : "Changer de fond d'écran"}
      >
        <ImageIcon className="w-4 h-4" />
        <span className="text-xs hidden md:inline font-medium">
          {isEn ? 'Wallpapers' : "Fonds d'écran"}
        </span>
      </button>

      {/* Settings Trigger (Replaces old 'Emplacement') */}
      <button
        type="button"
        id="open-settings-btn"
        onClick={onOpenSettings}
        className={`p-2 rounded-xl transition-all text-xs flex items-center gap-1.5 ${
          isLight
            ? 'text-slate-700 hover:text-slate-950 hover:bg-black/5'
            : 'text-white/70 hover:text-white hover:bg-white/15'
        }`}
        title={isEn ? 'Settings' : 'Paramètres'}
      >
        <Settings className="w-4 h-4" />
        <span className="text-xs hidden md:inline font-medium">
          {isEn ? 'Settings' : 'Paramètres'}
        </span>
      </button>

      {/* Zen Mode Button */}
      <button
        type="button"
        id="toggle-zen-mode-btn"
        onClick={onToggleZen}
        className={`p-2 rounded-xl transition-all text-xs flex items-center gap-1.5 ${
          isLight
            ? 'text-slate-700 hover:text-slate-950 hover:bg-black/5'
            : 'text-white/70 hover:text-white hover:bg-white/15'
        }`}
        title={isEn ? 'Zen mode (Z key)' : 'Mode Zen (Touche Z)'}
      >
        <Maximize2 className="w-4 h-4" />
      </button>
    </div>
  );
};
