import React, { useState } from 'react';
import { WidgetLayoutConfig, AppLanguage, AppTheme } from '../types';
import {
  X,
  Clock,
  Globe,
  Palette,
  Bookmark as BookmarkIcon,
  RotateCcw,
  Sliders,
  Check,
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: WidgetLayoutConfig;
  onChangeConfig: (newConfig: WidgetLayoutConfig) => void;
  onResetDefaults: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onChangeConfig,
  onResetDefaults,
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'clock' | 'shortcuts' | 'appearance'>('general');

  if (!isOpen) return null;

  const isEn = config.language === 'en';
  const isLight = config.theme === 'light';

  const timezones = [
    { id: 'local', label: isEn ? 'Local Time (Automatic)' : 'Heure Locale (Automatique)' },
    { id: 'America/New_York', label: isEn ? 'United States (New York, ET)' : 'États-Unis (New York, ET)' },
    { id: 'America/Chicago', label: isEn ? 'United States (Chicago, CT)' : 'États-Unis (Chicago, CT)' },
    { id: 'America/Los_Angeles', label: isEn ? 'United States (Los Angeles, PT)' : 'États-Unis (Los Angeles, PT)' },
    { id: 'Europe/Paris', label: isEn ? 'France (Paris, CET)' : 'France (Paris, CET)' },
    { id: 'Europe/London', label: isEn ? 'United Kingdom (London, GMT)' : 'Royaume-Uni (Londres, GMT)' },
    { id: 'Asia/Tokyo', label: isEn ? 'Japan (Tokyo, JST)' : 'Japon (Tokyo, JST)' },
    { id: 'Australia/Sydney', label: isEn ? 'Australia (Sydney, AEST)' : 'Australie (Sydney, AEST)' },
  ];

  const themes: { id: AppTheme; label: string; colorDot: string }[] = [
    { id: 'dark', label: isEn ? 'Dark' : 'Sombre', colorDot: 'bg-zinc-800 border-zinc-600' },
    { id: 'light', label: isEn ? 'White (Light)' : 'Blanc (Clair)', colorDot: 'bg-white border-zinc-300' },
    { id: 'purple', label: isEn ? 'Purple' : 'Violet', colorDot: 'bg-purple-500 border-purple-400' },
    { id: 'blue', label: isEn ? 'Blue' : 'Bleu', colorDot: 'bg-blue-500 border-blue-400' },
    { id: 'emerald', label: isEn ? 'Emerald' : 'Émeraude', colorDot: 'bg-emerald-500 border-emerald-400' },
    { id: 'rose', label: isEn ? 'Rose' : 'Rose', colorDot: 'bg-rose-500 border-rose-400' },
    { id: 'amber', label: isEn ? 'Amber' : 'Ambre', colorDot: 'bg-amber-500 border-amber-400' },
  ];

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div
        id="settings-dialog"
        className={`w-full max-w-xl max-h-[90vh] flex flex-col rounded-3xl border shadow-2xl overflow-hidden transition-all ${
          isLight
            ? 'bg-white border-black/15 text-slate-900 shadow-2xl'
            : 'bg-[#10121a]/95 border-white/15 text-white shadow-2xl'
        }`}
      >
        {/* Header - Clean, professional, Apple/macOS level typography */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b ${
            isLight ? 'border-black/10 bg-slate-50/50' : 'border-white/10 bg-white/[0.02]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                isLight ? 'bg-black/5 text-slate-800' : 'bg-white/10 text-white'
              }`}
            >
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold leading-tight">
                {isEn ? 'Settings' : 'Paramètres'}
              </h2>
              <p
                className={`text-xs ${
                  isLight ? 'text-slate-500' : 'text-white/50'
                }`}
              >
                {isEn
                  ? 'Customize your new tab experience'
                  : 'Personnalisez votre page de démarrage'}
              </p>
            </div>
          </div>
          <button
            type="button"
            id="close-settings-modal-btn"
            onClick={onClose}
            className={`p-1.5 rounded-xl transition-colors ${
              isLight
                ? 'text-slate-400 hover:text-slate-800 hover:bg-black/5'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div
          className={`flex items-center gap-1 px-6 py-2 border-b overflow-x-auto ${
            isLight ? 'border-black/10 bg-slate-50/30' : 'border-white/10 bg-white/[0.01]'
          }`}
        >
          {[
            { id: 'general', label: isEn ? 'General' : 'Général', icon: <Globe className="w-3.5 h-3.5" /> },
            { id: 'clock', label: isEn ? 'Clock & Time' : 'Horloge & Heure', icon: <Clock className="w-3.5 h-3.5" /> },
            { id: 'shortcuts', label: isEn ? 'Shortcuts' : 'Raccourcis', icon: <BookmarkIcon className="w-3.5 h-3.5" /> },
            { id: 'appearance', label: isEn ? 'Appearance' : 'Apparence', icon: <Palette className="w-3.5 h-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              id={`tab-btn-${tab.id}`}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === tab.id
                  ? isLight
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-950 shadow-md'
                  : isLight
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-black/5'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* TAB 1: GENERAL */}
          {activeTab === 'general' && (
            <div className="space-y-5">
              {/* Language selection */}
              <div
                className={`p-4 rounded-2xl border ${
                  isLight ? 'bg-slate-50 border-black/10' : 'bg-white/[0.03] border-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold">
                      {isEn ? 'Language' : 'Langue'}
                    </h3>
                    <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-white/50'}`}>
                      {isEn ? 'Select display language' : 'Choisissez la langue daffichage'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    id="lang-fr-btn"
                    onClick={() => onChangeConfig({ ...config, language: 'fr' })}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      config.language === 'fr'
                        ? isLight
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'bg-white text-slate-950 border-white shadow-md'
                        : isLight
                        ? 'bg-white border-black/10 text-slate-700 hover:bg-black/5'
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    <span>🇫🇷 Français</span>
                    {config.language === 'fr' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>

                  <button
                    type="button"
                    id="lang-en-btn"
                    onClick={() => onChangeConfig({ ...config, language: 'en' })}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      config.language === 'en'
                        ? isLight
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'bg-white text-slate-950 border-white shadow-md'
                        : isLight
                        ? 'bg-white border-black/10 text-slate-700 hover:bg-black/5'
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                    }`}
                  >
                    <span>🇺🇸 English</span>
                    {config.language === 'en' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>
                </div>
              </div>

              {/* Timezone Selection */}
              <div
                className={`p-4 rounded-2xl border ${
                  isLight ? 'bg-slate-50 border-black/10' : 'bg-white/[0.03] border-white/10'
                }`}
              >
                <div className="mb-3">
                  <h3 className="text-sm font-semibold">
                    {isEn ? 'Timezone & Location' : 'Fuseau horaire & Région'}
                  </h3>
                  <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-white/50'}`}>
                    {isEn
                      ? 'Set the clock to US time, Paris, or your local time'
                      : 'Afficher lheure des États-Unis, de Paris ou lheure locale'}
                  </p>
                </div>

                <div className="space-y-1.5">
                  {timezones.map((tz) => {
                    const isSelected = (config.timezone || 'local') === tz.id;
                    return (
                      <button
                        key={tz.id}
                        type="button"
                        id={`timezone-btn-${tz.id}`}
                        onClick={() => onChangeConfig({ ...config, timezone: tz.id })}
                        className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-left transition-all ${
                          isSelected
                            ? isLight
                              ? 'bg-slate-900 text-white font-medium shadow-sm'
                              : 'bg-white text-slate-950 font-semibold shadow-md'
                            : isLight
                            ? 'bg-white border border-black/5 text-slate-700 hover:bg-black/5'
                            : 'bg-white/5 border border-white/5 text-white/80 hover:bg-white/10'
                        }`}
                      >
                        <span>{tz.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CLOCK & TIME */}
          {activeTab === 'clock' && (
            <div className="space-y-5">
              {/* Toggle Clock Visibility */}
              <div
                className={`p-4 rounded-2xl border flex items-center justify-between ${
                  isLight ? 'bg-slate-50 border-black/10' : 'bg-white/[0.03] border-white/10'
                }`}
              >
                <div>
                  <h3 className="text-sm font-semibold">
                    {isEn ? 'Display Clock' : 'Afficher lhorloge'}
                  </h3>
                  <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-white/50'}`}>
                    {isEn ? 'Show or hide the main clock on the screen' : 'Activer ou masquer lhorloge centrale'}
                  </p>
                </div>

                <button
                  type="button"
                  id="toggle-clock-main-btn"
                  onClick={() =>
                    onChangeConfig({
                      ...config,
                      clockPosition: {
                        ...config.clockPosition,
                        visible: !config.clockPosition.visible,
                      },
                    })
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    config.clockPosition.visible
                      ? isLight ? 'bg-slate-900' : 'bg-white'
                      : isLight ? 'bg-slate-300' : 'bg-white/20'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full transition-transform ${
                      config.clockPosition.visible
                        ? isLight ? 'translate-x-6 bg-white' : 'translate-x-6 bg-slate-900'
                        : 'translate-x-1 bg-white'
                    }`}
                  />
                </button>
              </div>

              {config.clockPosition.visible && (
                <div
                  className={`p-4 rounded-2xl border space-y-4 ${
                    isLight ? 'bg-slate-50 border-black/10' : 'bg-white/[0.03] border-white/10'
                  }`}
                >
                  <h3 className="text-sm font-semibold">
                    {isEn ? 'Clock Options' : 'Options de lhorloge'}
                  </h3>

                  <div className="space-y-3">
                    <label className="flex items-center justify-between text-xs cursor-pointer">
                      <span className={isLight ? 'text-slate-700' : 'text-white/80'}>
                        {isEn ? '24-Hour Format' : 'Format 24 Heures'}
                      </span>
                      <input
                        type="checkbox"
                        checked={config.is24Hour}
                        onChange={(e) =>
                          onChangeConfig({ ...config, is24Hour: e.target.checked })
                        }
                        className="rounded h-4 w-4 accent-slate-900"
                      />
                    </label>

                    <label className="flex items-center justify-between text-xs cursor-pointer">
                      <span className={isLight ? 'text-slate-700' : 'text-white/80'}>
                        {isEn ? 'Show Seconds' : 'Afficher les secondes'}
                      </span>
                      <input
                        type="checkbox"
                        checked={config.showSeconds}
                        onChange={(e) =>
                          onChangeConfig({ ...config, showSeconds: e.target.checked })
                        }
                        className="rounded h-4 w-4 accent-slate-900"
                      />
                    </label>

                    <label className="flex items-center justify-between text-xs cursor-pointer">
                      <span className={isLight ? 'text-slate-700' : 'text-white/80'}>
                        {isEn ? 'Greeting Message' : 'Message de salutation'}
                      </span>
                      <input
                        type="checkbox"
                        checked={config.showGreeting}
                        onChange={(e) =>
                          onChangeConfig({ ...config, showGreeting: e.target.checked })
                        }
                        className="rounded h-4 w-4 accent-slate-900"
                      />
                    </label>
                  </div>

                  {/* Horizontal Alignment */}
                  <div className="pt-2">
                    <label className={`block text-xs mb-1.5 ${isLight ? 'text-slate-600' : 'text-white/60'}`}>
                      {isEn ? 'Horizontal Alignment' : 'Alignement horizontal'}
                    </label>
                    <div
                      className={`flex rounded-xl p-1 border ${
                        isLight ? 'bg-white border-black/10' : 'bg-white/5 border-white/10'
                      }`}
                    >
                      {(['left', 'center', 'right'] as const).map((pos) => (
                        <button
                          key={pos}
                          type="button"
                          onClick={() =>
                            onChangeConfig({
                              ...config,
                              clockPosition: { ...config.clockPosition, horizontal: pos },
                            })
                          }
                          className={`flex-1 py-1 text-xs rounded-lg font-medium transition-all ${
                            config.clockPosition.horizontal === pos
                              ? isLight
                                ? 'bg-slate-900 text-white'
                                : 'bg-white text-slate-900'
                              : isLight
                              ? 'text-slate-600 hover:text-slate-900'
                              : 'text-white/60 hover:text-white'
                          }`}
                        >
                          {pos === 'left' ? (isEn ? 'Left' : 'Gauche') : pos === 'center' ? (isEn ? 'Center' : 'Centre') : (isEn ? 'Right' : 'Droite')}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: SHORTCUTS / FAVORITES ZONE (YouTube, GitHub, etc.) */}
          {activeTab === 'shortcuts' && (
            <div className="space-y-5">
              {/* Toggle Shortcuts Zone Visibility */}
              <div
                className={`p-4 rounded-2xl border flex items-center justify-between ${
                  isLight ? 'bg-slate-50 border-black/10' : 'bg-white/[0.03] border-white/10'
                }`}
              >
                <div>
                  <h3 className="text-sm font-semibold">
                    {isEn ? 'Shortcuts Zone (YouTube, GitHub...)' : 'Zone des raccourcis (YouTube, GitHub...)'}
                  </h3>
                  <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-white/50'}`}>
                    {isEn ? 'Show or hide the quick access bookmarks' : 'Activer ou désactiver la zone des raccourcis et favoris'}
                  </p>
                </div>

                <button
                  type="button"
                  id="toggle-shortcuts-visibility-btn"
                  onClick={() =>
                    onChangeConfig({
                      ...config,
                      bookmarksPosition: {
                        ...config.bookmarksPosition,
                        visible: !config.bookmarksPosition.visible,
                      },
                    })
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                    config.bookmarksPosition.visible
                      ? isLight ? 'bg-slate-900' : 'bg-white'
                      : isLight ? 'bg-slate-300' : 'bg-white/20'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full transition-transform ${
                      config.bookmarksPosition.visible
                        ? isLight ? 'translate-x-6 bg-white' : 'translate-x-6 bg-slate-900'
                        : 'translate-x-1 bg-white'
                    }`}
                  />
                </button>
              </div>

              {/* Search Bar Position */}
              <div
                className={`p-4 rounded-2xl border ${
                  isLight ? 'bg-slate-50 border-black/10' : 'bg-white/[0.03] border-white/10'
                }`}
              >
                <div className="mb-3">
                  <h3 className="text-sm font-semibold">
                    {isEn ? 'Search Bar Position' : 'Position de la barre de recherche'}
                  </h3>
                  <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-white/50'}`}>
                    {isEn ? 'Place search bar at top, center, or bottom' : 'Placer la barre de recherche en haut, au centre ou en bas'}
                  </p>
                </div>

                <div
                  className={`flex rounded-xl p-1 border ${
                    isLight ? 'bg-white border-black/10' : 'bg-white/5 border-white/10'
                  }`}
                >
                  {(['top', 'center', 'bottom'] as const).map((pos) => (
                    <button
                      key={pos}
                      type="button"
                      onClick={() =>
                        onChangeConfig({
                          ...config,
                          searchPosition: { ...config.searchPosition, vertical: pos },
                        })
                      }
                      className={`flex-1 py-1 text-xs rounded-lg font-medium transition-all ${
                        config.searchPosition.vertical === pos
                          ? isLight
                            ? 'bg-slate-900 text-white'
                            : 'bg-white text-slate-900'
                          : isLight
                          ? 'text-slate-600 hover:text-slate-900'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      {pos === 'top' ? (isEn ? 'Top' : 'Haut') : pos === 'center' ? (isEn ? 'Center' : 'Centre') : (isEn ? 'Bottom' : 'Bas')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: APPEARANCE & THEME */}
          {activeTab === 'appearance' && (
            <div className="space-y-5">
              {/* Theme Colors */}
              <div
                className={`p-4 rounded-2xl border ${
                  isLight ? 'bg-slate-50 border-black/10' : 'bg-white/[0.03] border-white/10'
                }`}
              >
                <div className="mb-3">
                  <h3 className="text-sm font-semibold">
                    {isEn ? 'Theme & Color Scheme' : 'Thème & Couleurs'}
                  </h3>
                  <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-white/50'}`}>
                    {isEn ? 'Select light, dark, or custom styles' : 'Passez en mode blanc / clair ou sombre'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {themes.map((t) => {
                    const isSelected = (config.theme || 'dark') === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        id={`theme-btn-${t.id}`}
                        onClick={() => onChangeConfig({ ...config, theme: t.id })}
                        className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all ${
                          isSelected
                            ? isLight
                              ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                              : 'bg-white text-slate-950 border-white shadow-md'
                            : isLight
                            ? 'bg-white border-black/10 text-slate-700 hover:bg-black/5'
                            : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-3.5 h-3.5 rounded-full border shadow-sm ${t.colorDot}`} />
                          <span>{t.label}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Wallpaper Sliders */}
              <div
                className={`p-4 rounded-2xl border space-y-4 ${
                  isLight ? 'bg-slate-50 border-black/10' : 'bg-white/[0.03] border-white/10'
                }`}
              >
                <h3 className="text-sm font-semibold">
                  {isEn ? 'Wallpaper Adjustments' : 'Ajustements du fond'}
                </h3>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className={isLight ? 'text-slate-600' : 'text-white/70'}>
                      {isEn ? 'Brightness' : 'Luminosité'}
                    </span>
                    <span className="font-semibold">{config.wallpaperBrightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    step="5"
                    value={config.wallpaperBrightness}
                    onChange={(e) =>
                      onChangeConfig({
                        ...config,
                        wallpaperBrightness: parseInt(e.target.value, 10),
                      })
                    }
                    className="w-full accent-slate-900 h-1.5 bg-black/10 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className={isLight ? 'text-slate-600' : 'text-white/70'}>
                      {isEn ? 'Blur' : 'Flou d’arrière-plan'}
                    </span>
                    <span className="font-semibold">{config.wallpaperBlur}px</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="16"
                    step="1"
                    value={config.wallpaperBlur}
                    onChange={(e) =>
                      onChangeConfig({
                        ...config,
                        wallpaperBlur: parseInt(e.target.value, 10),
                      })
                    }
                    className="w-full accent-slate-900 h-1.5 bg-black/10 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-t ${
            isLight ? 'border-black/10 bg-slate-50/50' : 'border-white/10 bg-white/[0.02]'
          }`}
        >
          <button
            type="button"
            onClick={onResetDefaults}
            className={`flex items-center gap-1.5 text-xs transition-colors ${
              isLight ? 'text-slate-400 hover:text-slate-800' : 'text-white/50 hover:text-white'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isEn ? 'Reset to defaults' : 'Réinitialiser'}</span>
          </button>

          <button
            type="button"
            id="apply-settings-btn"
            onClick={onClose}
            className={`px-5 py-2 rounded-xl text-xs font-semibold shadow transition-all ${
              isLight
                ? 'bg-slate-900 text-white hover:bg-black'
                : 'bg-white text-slate-950 hover:bg-white/90'
            }`}
          >
            {isEn ? 'Done' : 'Terminer'}
          </button>
        </div>
      </div>
    </div>
  );
};
