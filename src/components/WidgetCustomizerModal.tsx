import React from 'react';
import { WidgetLayoutConfig, LayoutPreset } from '../types';
import {
  X,
  Layout,
  Clock,
  Search,
  Bookmark as BookmarkIcon,
  Sliders,
  RotateCcw,
  Eye,
  EyeOff,
} from 'lucide-react';

interface WidgetCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: WidgetLayoutConfig;
  onChangeConfig: (newConfig: WidgetLayoutConfig) => void;
  onResetDefaults: () => void;
}

export const WidgetCustomizerModal: React.FC<WidgetCustomizerModalProps> = ({
  isOpen,
  onClose,
  config,
  onChangeConfig,
  onResetDefaults,
}) => {
  if (!isOpen) return null;

  const handlePresetSelect = (preset: LayoutPreset) => {
    let updated: WidgetLayoutConfig = { ...config, preset };

    if (preset === 'centered') {
      updated = {
        ...updated,
        clockPosition: { vertical: 'top', horizontal: 'center', visible: true },
        searchPosition: { vertical: 'center', horizontal: 'center', visible: true },
        bookmarksPosition: { vertical: 'bottom', horizontal: 'center', visible: true },
      };
    } else if (preset === 'top-minimal') {
      updated = {
        ...updated,
        clockPosition: { vertical: 'top', horizontal: 'left', visible: true },
        searchPosition: { vertical: 'top', horizontal: 'center', visible: true },
        bookmarksPosition: { vertical: 'center', horizontal: 'center', visible: true },
      };
    } else if (preset === 'bottom-dock') {
      updated = {
        ...updated,
        clockPosition: { vertical: 'top', horizontal: 'center', visible: true },
        searchPosition: { vertical: 'bottom', horizontal: 'center', visible: true },
        bookmarksPosition: { vertical: 'bottom', horizontal: 'center', visible: true },
      };
    } else if (preset === 'split-view') {
      updated = {
        ...updated,
        clockPosition: { vertical: 'center', horizontal: 'left', visible: true },
        searchPosition: { vertical: 'center', horizontal: 'right', visible: true },
        bookmarksPosition: { vertical: 'bottom', horizontal: 'right', visible: true },
      };
    }

    onChangeConfig(updated);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div
        id="widget-customizer-dialog"
        className="w-full max-w-xl max-h-[90vh] flex flex-col rounded-3xl bg-[#0f1118]/95 border border-white/15 shadow-2xl text-white overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold leading-tight">
                Emplacement & Personnalisation des Widgets
              </h2>
              <p className="text-xs text-white/50">
                Ajustez l'alignement, l'agencement et l'affichage des éléments
              </p>
            </div>
          </div>
          <button
            type="button"
            id="close-customizer-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-white/60 mb-3 flex items-center gap-1.5">
              <Layout className="w-3.5 h-3.5 text-blue-400" />
              Disposition Rapide (Presets)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'centered', label: 'Centré Élégant', desc: 'Classique & équilibré' },
                { id: 'top-minimal', label: 'Minimal Haut', desc: 'Fond 4K dégagé' },
                { id: 'bottom-dock', label: 'Dock Inférieur', desc: 'Style moderne' },
                { id: 'split-view', label: 'Asymétrique', desc: 'Gauche / Droite' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  id={`preset-${item.id}`}
                  onClick={() => handlePresetSelect(item.id as LayoutPreset)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    config.preset === item.id
                      ? 'bg-white/15 border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="text-xs font-semibold text-white">
                    {item.label}
                  </div>
                  <div className="text-[11px] text-white/50 mt-0.5">
                    {item.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-semibold">Horloge & Date</span>
              </div>
              <button
                type="button"
                id="toggle-clock-visibility-btn"
                onClick={() =>
                  onChangeConfig({
                    ...config,
                    clockPosition: {
                      ...config.clockPosition,
                      visible: !config.clockPosition.visible,
                    },
                  })
                }
                className={`p-1.5 rounded-xl border text-xs flex items-center gap-1.5 transition-colors ${
                  config.clockPosition.visible
                    ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300'
                    : 'bg-white/5 border-white/10 text-white/40'
                }`}
              >
                {config.clockPosition.visible ? (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>Visible</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Masqué</span>
                  </>
                )}
              </button>
            </div>

            {config.clockPosition.visible && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] text-white/60 mb-1">
                    Alignement horizontal
                  </label>
                  <div className="flex rounded-xl bg-white/5 p-1 border border-white/10">
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
                            ? 'bg-white/20 text-white shadow-sm'
                            : 'text-white/50 hover:text-white'
                        }`}
                      >
                        {pos === 'left' ? 'Gauche' : pos === 'center' ? 'Centre' : 'Droite'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-white/60 mb-1">
                    Position verticale
                  </label>
                  <div className="flex rounded-xl bg-white/5 p-1 border border-white/10">
                    {(['top', 'center', 'bottom'] as const).map((pos) => (
                      <button
                        key={pos}
                        type="button"
                        onClick={() =>
                          onChangeConfig({
                            ...config,
                            clockPosition: { ...config.clockPosition, vertical: pos },
                          })
                        }
                        className={`flex-1 py-1 text-xs rounded-lg font-medium transition-all ${
                          config.clockPosition.vertical === pos
                            ? 'bg-white/20 text-white shadow-sm'
                            : 'text-white/50 hover:text-white'
                        }`}
                      >
                        {pos === 'top' ? 'Haut' : pos === 'center' ? 'Milieu' : 'Bas'}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="sm:col-span-2 flex flex-wrap gap-4 pt-1">
                  <label className="flex items-center gap-2 text-xs text-white/80 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.is24Hour}
                      onChange={(e) =>
                        onChangeConfig({ ...config, is24Hour: e.target.checked })
                      }
                      className="rounded bg-white/10 border-white/20 text-emerald-500 focus:ring-0"
                    />
                    Format 24 Heures
                  </label>

                  <label className="flex items-center gap-2 text-xs text-white/80 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.showSeconds}
                      onChange={(e) =>
                        onChangeConfig({ ...config, showSeconds: e.target.checked })
                      }
                      className="rounded bg-white/10 border-white/20 text-emerald-500 focus:ring-0"
                    />
                    Afficher les secondes
                  </label>

                  <label className="flex items-center gap-2 text-xs text-white/80 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.showGreeting}
                      onChange={(e) =>
                        onChangeConfig({ ...config, showGreeting: e.target.checked })
                      }
                      className="rounded bg-white/10 border-white/20 text-emerald-500 focus:ring-0"
                    />
                    Message de salutation
                  </label>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-semibold">Barre de Recherche</span>
              </div>
              <span className="text-[11px] text-white/40">Toujours visible</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] text-white/60 mb-1">
                  Position verticale
                </label>
                <div className="flex rounded-xl bg-white/5 p-1 border border-white/10">
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
                          ? 'bg-white/20 text-white shadow-sm'
                          : 'text-white/50 hover:text-white'
                      }`}
                    >
                      {pos === 'top' ? 'Haut' : pos === 'center' ? 'Centre' : 'Bas'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-white/60 mb-1">
                  Alignement horizontal
                </label>
                <div className="flex rounded-xl bg-white/5 p-1 border border-white/10">
                  {(['left', 'center', 'right'] as const).map((pos) => (
                    <button
                      key={pos}
                      type="button"
                      onClick={() =>
                        onChangeConfig({
                          ...config,
                          searchPosition: { ...config.searchPosition, horizontal: pos },
                        })
                      }
                      className={`flex-1 py-1 text-xs rounded-lg font-medium transition-all ${
                        config.searchPosition.horizontal === pos
                          ? 'bg-white/20 text-white shadow-sm'
                          : 'text-white/50 hover:text-white'
                      }`}
                    >
                      {pos === 'left' ? 'Gauche' : pos === 'center' ? 'Centre' : 'Droite'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookmarkIcon className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-semibold">Zone Favoris</span>
              </div>
              <button
                type="button"
                onClick={() =>
                  onChangeConfig({
                    ...config,
                    bookmarksPosition: {
                      ...config.bookmarksPosition,
                      visible: !config.bookmarksPosition.visible,
                    },
                  })
                }
                className={`p-1 rounded-lg border text-xs transition-colors ${
                  config.bookmarksPosition.visible
                    ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300'
                    : 'bg-white/5 border-white/10 text-white/40'
                }`}
              >
                {config.bookmarksPosition.visible ? 'Visible' : 'Caché'}
              </button>
            </div>

            {config.bookmarksPosition.visible && (
              <div>
                <label className="block text-[11px] text-white/60 mb-1">
                  Position
                </label>
                <div className="flex rounded-xl bg-white/5 p-1 border border-white/10">
                  {(['top', 'center', 'bottom'] as const).map((pos) => (
                    <button
                      key={pos}
                      type="button"
                      onClick={() =>
                        onChangeConfig({
                          ...config,
                          bookmarksPosition: { ...config.bookmarksPosition, vertical: pos },
                        })
                      }
                      className={`flex-1 py-1 text-xs rounded-lg font-medium transition-all ${
                        config.bookmarksPosition.vertical === pos
                          ? 'bg-white/20 text-white shadow-sm'
                          : 'text-white/50 hover:text-white'
                      }`}
                    >
                      {pos === 'top' ? 'Haut' : pos === 'center' ? 'Centre' : 'Bas'}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-4">
            <span className="text-sm font-semibold block">
              Contraste & Lisibilité du Fond 4K
            </span>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-white/70 mb-1">
                  <span>Luminosité du fond animé</span>
                  <span className="font-semibold text-white">
                    {config.wallpaperBrightness}%
                  </span>
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
                  className="w-full accent-white h-1.5 bg-white/15 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-white/70 mb-1">
                  <span>Flou d'arrière-plan (effet verre)</span>
                  <span className="font-semibold text-white">
                    {config.wallpaperBlur}px
                  </span>
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
                  className="w-full accent-white h-1.5 bg-white/15 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-white/[0.02]">
          <button
            type="button"
            onClick={onResetDefaults}
            className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Réinitialiser par défaut</span>
          </button>

          <button
            type="button"
            id="apply-customizer-btn"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-white text-black hover:bg-white/90 shadow transition-all"
          >
            Appliquer et fermer
          </button>
        </div>
      </div>
    </div>
  );
};
