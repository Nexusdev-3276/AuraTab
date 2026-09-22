import React, { useState, useRef } from 'react';
import { Wallpaper, WallpaperCategory } from '../types';
import { curatedWallpapers } from '../data/wallpapers';
import {
  saveCustomWallpaper,
  saveCustomWallpaperUrl,
  extractVideoThumbnail,
} from '../utils/wallpaperStorage';
import {
  X,
  Sparkles,
  Link,
  Upload,
  Check,
  Gauge,
  Image as ImageIcon,
  Film,
  Trash2,
  FolderOpen,
  Loader2,
} from 'lucide-react';

interface WallpaperSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentWallpaper: Wallpaper;
  onSelectWallpaper: (wp: Wallpaper) => void;
  speed: number;
  onChangeSpeed: (newSpeed: number) => void;
  onAddCustomWallpaper: (wp: Wallpaper) => void;
  customWallpapers?: Wallpaper[];
  onDeleteCustomWallpaper?: (id: string) => void;
}

export const WallpaperSelectorModal: React.FC<WallpaperSelectorModalProps> = ({
  isOpen,
  onClose,
  currentWallpaper,
  onSelectWallpaper,
  speed,
  onChangeSpeed,
  onAddCustomWallpaper,
  customWallpapers = [],
  onDeleteCustomWallpaper,
}) => {
  const [selectedCategory, setSelectedCategory] =
    useState<WallpaperCategory | 'custom'>('all');
  const [customUrl, setCustomUrl] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const categories: { id: WallpaperCategory | 'custom'; label: string; count?: number }[] = [
    { id: 'all', label: 'Tous les fonds' },
    { id: 'anime', label: 'Anime Wallpaper' },
    {
      id: 'custom',
      label: 'Mes fonds importés',
      count: customWallpapers.length > 0 ? customWallpapers.length : undefined,
    },
    { id: 'cyberpunk', label: 'Cyberpunk & Néo' },
    { id: 'space', label: 'Espace & Cosmos' },
    { id: 'nature', label: 'Nature & Océan' },
    { id: 'lofi', label: 'Lo-Fi & Cozy' },
    { id: 'minimal', label: 'Minimaliste' },
  ];

  // Combine customWallpapers and curatedWallpapers according to active category
  let displayedWallpapers: Wallpaper[] = [];
  if (selectedCategory === 'all') {
    displayedWallpapers = [...customWallpapers, ...curatedWallpapers];
  } else if (selectedCategory === 'custom') {
    displayedWallpapers = customWallpapers;
  } else {
    displayedWallpapers = curatedWallpapers.filter((w) => w.category === selectedCategory);
  }

  const handleCustomUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = customUrl.trim();
    if (!trimmed) return;

    setIsUploading(true);
    setUploadError(null);
    try {
      const newWp = await saveCustomWallpaperUrl(trimmed);
      onAddCustomWallpaper(newWp);
      onSelectWallpaper(newWp);
      setCustomUrl('');
      setIsUploading(false);
      onClose();
    } catch (err) {
      console.error(err);
      setUploadError('Impossible de charger ce lien.');
      setIsUploading(false);
    }
  };

  const processUploadedFile = async (file: File) => {
    setUploadError(null);
    setIsUploading(true);

    try {
      const fileNameLower = file.name.toLowerCase();
      const isVideo =
        file.type.startsWith('video/') ||
        /\.(mp4|webm|mov|mkv|m4v|avi|ogv)$/i.test(fileNameLower);
      const isImage =
        file.type.startsWith('image/') ||
        /\.(gif|webp|png|jpe?g|bmp)$/i.test(fileNameLower);

      if (!isVideo && !isImage) {
        setUploadError(
          "Format de fichier non reconnu. Veuillez choisir une vidéo (MP4, WebM, MOV) ou une image/GIF animé (GIF, PNG, JPG)."
        );
        setIsUploading(false);
        return;
      }

      // Save directly into IndexedDB as ArrayBuffer with durable commit
      const newWp = await saveCustomWallpaper(file);

      onAddCustomWallpaper(newWp);
      onSelectWallpaper(newWp);
      setIsUploading(false);
      onClose();
    } catch (err) {
      console.error('Erreur lors du traitement du fichier:', err);
      setUploadError("Erreur lors de l'importation. Assurez-vous que le fichier est valide.");
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
    // reset input so the same file can be re-selected if desired
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processUploadedFile(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div
        id="wallpaper-selector-dialog"
        className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-3xl bg-[#0f1118]/95 border border-white/15 shadow-2xl text-white overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-white">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold leading-tight">
                Fonds d'écran & Vidéos Animées
              </h2>
              <p className="text-xs text-white/50">
                Sélectionnez un fond d'écran ou importez vos propres vidéos et GIFs depuis votre PC
              </p>
            </div>
          </div>
          <button
            type="button"
            id="close-wallpaper-modal-btn"
            onClick={onClose}
            className="p-1.5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Categories Bar */}
        <div className="px-6 py-3 border-b border-white/10 bg-white/[0.01] flex items-center gap-2 overflow-x-auto scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              id={`cat-filter-${cat.id}`}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-white text-black shadow-md'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span>{cat.label}</span>
              {typeof cat.count === 'number' && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    selectedCategory === cat.id
                      ? 'bg-black text-white'
                      : 'bg-white/20 text-white'
                  }`}
                >
                  {cat.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Wallpapers Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {displayedWallpapers.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <FolderOpen className="w-10 h-10 text-white/20 mb-3" />
              <p className="text-sm font-medium text-white/70">
                Aucun fond d'écran personnalisé importé pour l'instant.
              </p>
              <p className="text-xs text-white/40 mt-1 max-w-sm">
                Importez une vidéo (MP4, WebM) ou un GIF animé depuis votre PC ci-dessous !
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
              {displayedWallpapers.map((wp) => {
                const isCurrent = currentWallpaper.id === wp.id;
                const isCustom = wp.category === 'custom';
                const isVideo = Boolean(wp.videoUrl);

                return (
                  <div
                    key={wp.id}
                    id={`wallpaper-card-${wp.id}`}
                    onClick={() => onSelectWallpaper(wp)}
                    className={`group relative aspect-video rounded-2xl overflow-hidden border cursor-pointer transition-all duration-200 ${
                      isCurrent
                        ? 'border-white ring-2 ring-white/50 shadow-xl'
                        : 'border-white/10 hover:border-white/40 hover:scale-[1.02]'
                    }`}
                    title={wp.title || 'Cliquer pour appliquer'}
                  >
                    <img
                      src={wp.thumbnailUrl}
                      alt={wp.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Indicator Video Badge if animated video */}
                    {isVideo && (
                      <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-1 text-[10px] text-white/90">
                        <Film className="w-2.5 h-2.5 text-blue-400" />
                        <span>Vidéo</span>
                      </div>
                    )}

                    {/* Delete button if custom wallpaper */}
                    {isCustom && onDeleteCustomWallpaper && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteCustomWallpaper(wp.id);
                        }}
                        className="absolute top-2 left-2 p-1.5 rounded-lg bg-black/60 hover:bg-red-500/80 text-white/80 hover:text-white backdrop-blur-md border border-white/15 opacity-0 group-hover:opacity-100 transition-all"
                        title="Supprimer ce fond"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}

                    {/* Active Indicator Checkmark Badge */}
                    {isCurrent && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-lg">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Section: Custom Image / GIF / Video Import */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/60 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              Ajouter votre propre fond d'écran animé depuis votre PC
            </h3>

            {uploadError && (
              <div className="mb-3 px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300">
                {uploadError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Option A: Direct Local PC File Drop & Upload */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between select-none ${
                  isDragging
                    ? 'border-blue-500 bg-blue-500/10 scale-[1.01]'
                    : 'border-white/15 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/30'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-white mb-1.5">
                    <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <Upload className="w-3.5 h-3.5" />
                    </div>
                    <span>Importer depuis votre PC (Vidéo MP4, WebM ou GIF)</span>
                  </div>
                  <p className="text-[11px] text-white/50 mb-4 leading-relaxed">
                    Glissez-déposez n'importe quelle vidéo animée (.mp4, .webm, .mov) ou GIF animé ici, ou cliquez pour parcourir votre ordinateur.
                  </p>
                </div>

                <div className="w-full py-2.5 px-3 rounded-xl text-xs font-medium bg-white/10 hover:bg-white/20 border border-white/15 text-white text-center transition-all flex items-center justify-center gap-2">
                  <Film className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    {isUploading
                      ? 'Application en cours...'
                      : 'Parcourir mon PC (Vidéo ou GIF)...'}
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/*,image/*,.mp4,.webm,.mov,.mkv,.m4v,.gif,.webp,.avi"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Option B: Direct Image or Video URL */}
              <form
                onSubmit={handleCustomUrlSubmit}
                className="p-5 rounded-2xl bg-white/[0.03] border border-white/15 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-white mb-1.5">
                    <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
                      <Link className="w-3.5 h-3.5" />
                    </div>
                    <span>Ou coller un lien direct (URL)</span>
                  </div>
                  <p className="text-[11px] text-white/50 mb-3 leading-relaxed">
                    Collez le lien direct vers une vidéo animée (.mp4, .webm) ou un GIF en ligne.
                  </p>
                  <input
                    type="url"
                    required
                    placeholder="https://.../mon-anime.mp4 ou .gif"
                    value={customUrl}
                    onChange={(e) => setCustomUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/15 text-white placeholder-white/30 text-xs focus:outline-none focus:border-white/40 mb-3"
                  />
                </div>
                <button
                  type="submit"
                  id="submit-custom-wallpaper-btn"
                  className="w-full py-2.5 rounded-xl text-xs font-medium bg-white/10 hover:bg-white/20 border border-white/15 text-white transition-all"
                >
                  Appliquer ce lien
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Footer with Playback Speed Control */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-white/10 bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/60 flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-white/60" />
              Vitesse d'animation :
            </span>
            <div className="flex rounded-xl bg-white/5 p-1 border border-white/10">
              {[0.5, 0.75, 1, 1.25, 1.5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => onChangeSpeed(s)}
                  className={`px-2 py-0.5 text-xs rounded-lg font-medium transition-all ${
                    speed === s
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-white text-black hover:bg-white/90 shadow transition-all"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

