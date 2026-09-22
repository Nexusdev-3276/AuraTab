export type SearchEngineId =
  | 'google'
  | 'duckduckgo'
  | 'bing'
  | 'brave'
  | 'ecosia'
  | 'qwant'
  | 'startpage'
  | 'youtube'
  | 'github';

export interface SearchEngine {
  id: SearchEngineId;
  name: string;
  searchUrl: string;
  placeholder: string;
  color: string;
  iconType: 'svg';
}

export type WallpaperCategory = 'all' | 'cyberpunk' | 'nature' | 'space' | 'lofi' | 'minimal' | 'anime' | 'custom';

export interface Wallpaper {
  id: string;
  title: string;
  category: WallpaperCategory;
  videoUrl: string;
  thumbnailUrl: string;
  is4k: boolean;
  author?: string;
  hasAudio?: boolean;
}

export interface Bookmark {
  id: string;
  title: string;
  url: string;
  icon?: string;
  color?: string;
}

export type LayoutPreset = 'centered' | 'top-minimal' | 'bottom-dock' | 'split-view';

export type HorizontalAlign = 'left' | 'center' | 'right';
export type VerticalAlign = 'top' | 'center' | 'bottom';

export type AppLanguage = 'fr' | 'en';

export type AppTheme = 'dark' | 'light' | 'purple' | 'blue' | 'emerald' | 'rose' | 'amber';

export interface WidgetLayoutConfig {
  preset: LayoutPreset;
  // Positioning & Visibilities
  clockPosition: { vertical: VerticalAlign; horizontal: HorizontalAlign; visible: boolean };
  searchPosition: { vertical: VerticalAlign; horizontal: HorizontalAlign; visible: boolean };
  bookmarksPosition: { vertical: VerticalAlign; horizontal: HorizontalAlign; visible: boolean };
  // Preferences
  language: AppLanguage;
  timezone: string; // 'local' or IANA timezone like 'America/New_York', 'Europe/Paris'
  theme: AppTheme;
  is24Hour: boolean;
  showSeconds: boolean;
  showGreeting: boolean;
  wallpaperBrightness: number; // 20 to 100
  wallpaperBlur: number; // 0 to 20 px
  playbackSpeed: number; // 0.5 to 2
  uiScale: number; // 0.85 to 1.15
  autoHideControls: boolean;
}
