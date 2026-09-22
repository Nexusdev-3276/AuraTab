import React, { useState, useRef, useEffect } from 'react';
import { SearchEngine, SearchEngineId, AppLanguage, AppTheme } from '../types';
import { searchEngines, SearchEngineIcons } from '../data/searchEngines';
import { Search, ChevronDown, X, ArrowRight } from 'lucide-react';

interface SearchBarProps {
  currentEngineId: SearchEngineId;
  onSelectEngine: (id: SearchEngineId) => void;
  language?: AppLanguage;
  theme?: AppTheme;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  currentEngineId,
  onSelectEngine,
  language = 'fr',
  theme = 'dark',
  className = '',
}) => {
  const [query, setQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeEngine =
    searchEngines.find((e) => e.id === currentEngineId) || searchEngines[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut: "/" to focus search bar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement !== inputRef.current &&
        !(document.activeElement instanceof HTMLInputElement)
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setIsDropdownOpen(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    // Direct URL navigation detection
    const isUrl =
      /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/.test(trimmed) &&
      !trimmed.includes(' ');

    if (isUrl) {
      const destination = trimmed.startsWith('http')
        ? trimmed
        : `https://${trimmed}`;
      window.location.href = destination;
      return;
    }

    // Otherwise redirect to selected search engine with query
    const targetUrl = `${activeEngine.searchUrl}${encodeURIComponent(trimmed)}`;
    window.location.href = targetUrl;
  };

  const isLight = theme === 'light';

  const placeholderText =
    language === 'en'
      ? `Search on ${activeEngine.name} or type a URL...`
      : activeEngine.placeholder;

  return (
    <div
      id="search-bar-wrapper"
      className={`relative ${isDropdownOpen ? 'z-50' : 'z-20'} w-full max-w-2xl mx-auto ${className}`}
    >
      <form
        onSubmit={handleSearch}
        className={`group relative flex items-center w-full px-3.5 py-2.5 rounded-2xl transition-all duration-300 ${
          isLight
            ? isFocused
              ? 'bg-white/95 text-slate-900 backdrop-blur-2xl border border-black/20 shadow-2xl ring-1 ring-black/10'
              : 'bg-white/80 text-slate-900 backdrop-blur-xl border border-black/10 hover:border-black/20 hover:bg-white/90 shadow-lg'
            : isFocused
            ? 'bg-black/65 text-white backdrop-blur-xl border border-white/30 shadow-[0_0_25px_rgba(255,255,255,0.1)] ring-1 ring-white/20'
            : 'bg-black/45 text-white backdrop-blur-lg border border-white/15 hover:border-white/25 hover:bg-black/55 shadow-lg'
        }`}
      >
        {/* Search Engine Switcher Trigger with REAL Official Logo */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            id="engine-selector-btn"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-colors cursor-pointer ${
              isLight
                ? 'bg-black/5 hover:bg-black/10 border-black/10 text-slate-800'
                : 'bg-white/10 hover:bg-white/20 border border-white/10 text-white/90 group-hover:bg-white/15'
            }`}
            title={`Moteur : ${activeEngine.name}`}
          >
            <div className="flex-shrink-0 flex items-center justify-center">
              {SearchEngineIcons[activeEngine.id]}
            </div>
            <span className="text-xs font-medium hidden sm:inline-block">
              {activeEngine.name}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${
                isLight ? 'text-slate-500' : 'text-white/60'
              } ${isDropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Engine Selection Dropdown Menu */}
          {isDropdownOpen && (
            <div
              id="engine-dropdown-menu"
              className={`absolute left-0 mt-3 w-64 p-1.5 backdrop-blur-2xl rounded-2xl border shadow-[0_25px_60px_rgba(0,0,0,0.9)] z-[100] animate-in fade-in zoom-in-95 duration-150 ${
                isLight
                  ? 'bg-white/98 border-black/15 text-slate-900 shadow-2xl'
                  : 'bg-[#0f1117]/98 border-white/20 text-white shadow-2xl'
              }`}
            >
              <div
                className={`px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider ${
                  isLight ? 'text-slate-400' : 'text-white/40'
                }`}
              >
                {language === 'en' ? 'Choose search engine' : 'Choisir un moteur'}
              </div>
              <div className="flex flex-col gap-1 max-h-72 overflow-y-auto">
                {searchEngines.map((engine) => {
                  const isSelected = engine.id === activeEngine.id;
                  return (
                    <button
                      key={engine.id}
                      type="button"
                      id={`select-engine-${engine.id}`}
                      onClick={() => {
                        onSelectEngine(engine.id);
                        setIsDropdownOpen(false);
                        inputRef.current?.focus();
                      }}
                      className={`flex items-center gap-3 w-full px-3 py-2 rounded-xl text-left text-sm transition-all ${
                        isLight
                          ? isSelected
                            ? 'bg-black/10 text-slate-900 font-semibold'
                            : 'text-slate-700 hover:bg-black/5 hover:text-slate-900'
                          : isSelected
                          ? 'bg-white/20 text-white font-medium shadow-sm'
                          : 'text-white/80 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                        {SearchEngineIcons[engine.id]}
                      </div>
                      <span className="flex-1 truncate">{engine.name}</span>
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          id="search-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholderText}
          autoComplete="off"
          spellCheck="false"
          className={`flex-1 bg-transparent px-3 text-sm md:text-base focus:outline-none tracking-normal font-normal ${
            isLight
              ? 'text-slate-900 placeholder-slate-400'
              : 'text-white placeholder-white/45'
          }`}
        />

        {/* Clear Button */}
        {query && (
          <button
            type="button"
            id="clear-search-btn"
            onClick={() => {
              setQuery('');
              inputRef.current?.focus();
            }}
            className={`p-1 rounded-full transition-colors mr-1 ${
              isLight
                ? 'text-slate-400 hover:text-slate-700 hover:bg-black/5'
                : 'text-white/50 hover:text-white hover:bg-white/10'
            }`}
            title={language === 'en' ? 'Clear' : 'Effacer'}
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Search Submit Action Button */}
        <button
          type="submit"
          id="submit-search-btn"
          className={`p-2 rounded-xl transition-all active:scale-95 ${
            isLight
              ? 'bg-black/10 hover:bg-black/15 text-slate-800'
              : 'bg-white/15 hover:bg-white/25 text-white/80 hover:text-white'
          }`}
          title={language === 'en' ? 'Search (Enter)' : 'Rechercher (Entrée)'}
        >
          {query ? (
            <ArrowRight className="w-4 h-4" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </button>
      </form>
    </div>
  );
};
