import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Bookmark, AppLanguage, AppTheme } from '../types';
import { Plus, X, Globe } from 'lucide-react';

interface BookmarksGridProps {
  bookmarks: Bookmark[];
  onAddBookmark: (bookmark: Bookmark) => void;
  onRemoveBookmark: (id: string) => void;
  language?: AppLanguage;
  theme?: AppTheme;
  className?: string;
  isDockMode?: boolean;
}

export const BookmarksGrid: React.FC<BookmarksGridProps> = ({
  bookmarks,
  onAddBookmark,
  onRemoveBookmark,
  language = 'fr',
  theme = 'dark',
  className = '',
  isDockMode = false,
}) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  const isLight = theme === 'light';

  const getDomain = (rawUrl: string) => {
    try {
      const parsed = new URL(
        rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`
      );
      return parsed.hostname;
    } catch {
      return rawUrl.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').split('/')[0];
    }
  };

  const getFaviconUrl = (rawUrl: string) => {
    const domain = getDomain(rawUrl);
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(
      domain
    )}&sz=128`;
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    let validUrl = url.trim();
    if (!validUrl.startsWith('http://') && !validUrl.startsWith('https://')) {
      validUrl = `https://${validUrl}`;
    }

    const newBookmark: Bookmark = {
      id: `bm-${Date.now()}`,
      title: title.trim(),
      url: validUrl,
    };

    onAddBookmark(newBookmark);
    setTitle('');
    setUrl('');
    setIsAddOpen(false);
  };

  useEffect(() => {
    if (!isAddOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsAddOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAddOpen]);

  return (
    <div
      id="bookmarks-section"
      className={`w-full max-w-4xl mx-auto ${className}`}
    >
      <div
        className={`flex items-center justify-center flex-wrap gap-3 ${
          isDockMode
            ? isLight
              ? 'p-2 bg-white/70 backdrop-blur-xl rounded-2xl border border-black/10 shadow-lg'
              : 'p-2 bg-black/40 backdrop-blur-xl rounded-2xl border border-white/10'
            : ''
        }`}
      >
        {bookmarks.map((bm) => {
          const domain = getDomain(bm.url);
          const faviconSrc = getFaviconUrl(bm.url);

          return (
            <div
              key={bm.id}
              className="group relative flex flex-col items-center"
            >
              <a
                id={`bookmark-item-${bm.id}`}
                href={bm.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex flex-col items-center justify-center w-18 h-18 sm:w-20 sm:h-20 rounded-2xl backdrop-blur-md border transition-all duration-200 hover:-translate-y-1 hover:shadow-xl active:scale-95 group ${
                  isLight
                    ? 'bg-white/80 hover:bg-white text-slate-900 border-black/10 hover:border-black/20 shadow-sm'
                    : 'bg-black/35 hover:bg-black/60 text-white border-white/10 hover:border-white/25'
                }`}
                title={`${bm.title} (${domain})`}
              >
                <div
                  className={`w-8 h-8 rounded-xl p-1.5 flex items-center justify-center overflow-hidden border group-hover:scale-110 transition-transform ${
                    isLight
                      ? 'bg-black/5 border-black/10'
                      : 'bg-white/10 border-white/10'
                  }`}
                >
                  <img
                    src={faviconSrc}
                    alt={bm.title}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                      const parent = (e.target as HTMLElement).parentElement;
                      if (parent && !parent.querySelector('.fallback-icon')) {
                        const fallback = document.createElement('span');
                        fallback.className = `fallback-icon text-xs font-semibold uppercase ${
                          isLight ? 'text-slate-800' : 'text-white/80'
                        }`;
                        fallback.innerText = bm.title.substring(0, 2);
                        parent.appendChild(fallback);
                      }
                    }}
                  />
                </div>
                <span
                  className={`text-[11px] font-medium mt-1.5 tracking-tight max-w-[68px] truncate px-1 ${
                    isLight
                      ? 'text-slate-700 group-hover:text-slate-950 font-semibold'
                      : 'text-white/85 group-hover:text-white'
                  }`}
                >
                  {bm.title}
                </span>
              </a>

              {/* Remove Favorite Button */}
              <button
                id={`remove-bookmark-${bm.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onRemoveBookmark(bm.id);
                }}
                className="opacity-0 group-hover:opacity-100 absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500/80 hover:bg-red-500 text-white flex items-center justify-center text-[10px] transition-opacity shadow cursor-pointer"
                title={`Supprimer ${bm.title}`}
              >
                <X className="w-2.5 h-2.5" />
              </button>
            </div>
          );
        })}

        {/* Add Shortcut Tile */}
        <button
          type="button"
          id="add-bookmark-btn"
          onClick={() => setIsAddOpen(true)}
          className={`flex flex-col items-center justify-center w-18 h-18 sm:w-20 sm:h-20 rounded-2xl backdrop-blur-md border transition-all duration-200 hover:-translate-y-1 ${
            isLight
              ? 'bg-white/50 hover:bg-white/80 border-black/10 hover:border-black/20 text-slate-500 hover:text-slate-900 shadow-sm'
              : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20 text-white/50 hover:text-white'
          }`}
          title={language === 'en' ? 'Add shortcut' : 'Ajouter un favori'}
        >
          <div
            className={`w-8 h-8 rounded-xl border flex items-center justify-center ${
              isLight
                ? 'bg-black/5 border-black/10'
                : 'bg-white/5 border-white/10'
            }`}
          >
            <Plus className="w-4 h-4" />
          </div>
          <span
            className={`text-[11px] font-medium mt-1.5 tracking-tight ${
              isLight ? 'text-slate-500' : 'text-white/60'
            }`}
          >
            {language === 'en' ? 'Add' : 'Ajouter'}
          </span>
        </button>
      </div>

      {/* Add Modal rendered via portal so it floats over all widgets including the search bar */}
      {isAddOpen &&
        createPortal(
          <div
            id="add-bookmark-modal-backdrop"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setIsAddOpen(false);
              }
            }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-150"
          >
            <div
              className={`w-full max-w-sm rounded-2xl border p-5 shadow-2xl animate-in zoom-in-95 duration-150 ${
                isLight
                  ? 'bg-white border-black/15 text-slate-900'
                  : 'bg-[#12141c] border-white/15 text-white'
              }`}
            >
              <div
                className={`flex items-center justify-between pb-3 border-b ${
                  isLight ? 'border-black/10' : 'border-white/10'
                }`}
              >
                <h3 className="text-sm font-semibold">
                  {language === 'en' ? 'Add shortcut' : 'Ajouter un favori'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className={`p-1 rounded-lg ${
                    isLight
                      ? 'text-slate-400 hover:text-slate-700'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="mt-4 space-y-3">
                <div>
                  <label
                    className={`block text-xs font-medium mb-1 ${
                      isLight ? 'text-slate-600' : 'text-white/70'
                    }`}
                  >
                    {language === 'en' ? 'Site name' : 'Nom du site'}
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="Ex: GitHub, Wikipedia, Netflix"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl text-sm focus:outline-none ${
                      isLight
                        ? 'bg-black/5 border border-black/15 text-slate-900 placeholder-slate-400 focus:border-black/40'
                        : 'bg-white/5 border border-white/15 text-white placeholder-white/30 focus:border-white/40'
                    }`}
                  />
                </div>

                <div>
                  <label
                    className={`block text-xs font-medium mb-1 ${
                      isLight ? 'text-slate-600' : 'text-white/70'
                    }`}
                  >
                    {language === 'en' ? 'URL Address' : 'Adresse URL'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl text-sm focus:outline-none ${
                      isLight
                        ? 'bg-black/5 border border-black/15 text-slate-900 placeholder-slate-400 focus:border-black/40'
                        : 'bg-white/5 border border-white/15 text-white placeholder-white/30 focus:border-white/40'
                    }`}
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddOpen(false)}
                    className={`px-3 py-1.5 rounded-xl text-xs ${
                      isLight
                        ? 'text-slate-500 hover:text-slate-800'
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {language === 'en' ? 'Cancel' : 'Annuler'}
                  </button>
                  <button
                    type="submit"
                    id="confirm-add-bookmark-btn"
                    className={`px-4 py-1.5 rounded-xl text-xs font-medium shadow transition-all ${
                      isLight
                        ? 'bg-slate-900 text-white hover:bg-black'
                        : 'bg-white text-black hover:bg-white/90'
                    }`}
                  >
                    {language === 'en' ? 'Add to shortcuts' : 'Ajouter aux favoris'}
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
