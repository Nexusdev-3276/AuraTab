import React from 'react';
import { SearchEngine, SearchEngineId } from '../types';

export const SearchEngineIcons: Record<SearchEngineId, React.ReactNode> = {
  // Official Google 4-Color 'G' Logo (Clean & Transparent)
  google: (
    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </svg>
  ),

  // Official DuckDuckGo Dax Mascot Logo (Transparent background, no circle container)
  duckduckgo: (
    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 512 512" fill="none">
      <defs>
        <linearGradient id="ddg-orange-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0" stopColor="#d14427" />
          <stop offset="1" stopColor="#e55225" />
        </linearGradient>
        <linearGradient id="ddg-eye-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0" stopColor="#6176b9" />
          <stop offset="1" stopColor="#394a9f" />
        </linearGradient>
        <linearGradient id="ddg-eye-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0" stopColor="#6176b9" />
          <stop offset="1" stopColor="#394a9f" />
        </linearGradient>
        <clipPath id="ddg-head-clip">
          <path d="M480.9 255.4c0 124-100.9 224.8-224.9 224.8S31.2 379.3 31.2 255.4C31.2 131.4 132 30.6 256 30.6s224.9 100.8 224.9 224.8" />
        </clipPath>
      </defs>

      {/* Main Orange Background Circle with Dax's silhouette */}
      <path
        d="M497.7 254.3c0 138.2-108.7 250.2-242.7 250.2S12.3 392.5 12.3 254.3 121 4.1 255.1 4.1c134 0 242.6 112 242.6 250.2"
        fill="#ffffff"
      />
      <path
        d="M480 256c0 123.7-100.3 224-224 224S32 379.7 32 256 132.3 32 256 32s224 100.3 224 224m32 0c0 141.4-114.6 256-256 256S0 397.4 0 256 114.6 0 256 0s256 114.6 256 256m-21.1 0c0-129.7-105.2-234.9-234.9-234.9S21.1 126.3 21.1 256 126.3 490.9 256 490.9 490.9 385.7 490.9 256"
        fill="url(#ddg-orange-grad)"
      />

      {/* Head & Body elements inside clip-path */}
      <g clipPath="url(#ddg-head-clip)">
        {/* Shadow neck */}
        <path
          d="M346 582.9c-7.7-35.6-52.6-116-69.6-150.1-17-34-34.1-82-26.3-112.9 1.4-5.6-14.7-48.5-10.1-51.6 36.1-23.6 45.6 2.6 60.1-8 7.5-5.5 17.6 4.5 20.1-4.5 9.3-32.5-12.9-89.1-37.6-113.8-8.1-8.1-20.5-13.1-34.5-15.8-5.4-7.4-14.1-14.4-26.3-20.9-13.8-7.3-43.5-16.9-58.9-19.5-10.7-1.8-13.1 1.2-17.7 2 4.3.4 24.5 10.4 28.4 10.9-3.9 2.7-15.5-.1-22.8 3.2-3.7 1.7-6.5 8.1-6.5 11.1 21.1-2.1 54-.1 73.4 8.6-15.5 1.8-39 3.7-49.1 9-29.4 15.5-42.4 51.6-34.6 95 7.7 43.2 41.8 201 52.6 253.7 10.8 52.6-23.2 86.6-44.9 95.9l23.2 1.6-7.7 17c27.8 3.1 58.8-6.2 58.8-6.2-6.2 17-48 23.2-48 23.2s20.1 6.2 52.6-6.2 52.6-20.1 52.6-20.1l15.5 40.2 29.4-29.4 12.4 30.9c0 .1 23.2-7.7 15.5-43.3"
          fill="#d5d7d8"
        />
        {/* Main white body & head */}
        <path
          d="M355.3 575.7c-7.7-35.6-52.6-116-69.6-150.1-17-34-34-82-26.3-112.9 1.4-5.6 1.5-28.6 6.1-31.7 36.1-23.6 33.5-.8 48-11.3 7.5-5.4 13.4-12 16-21.1 9.3-32.5-12.9-89.1-37.6-113.8-8.1-8.1-20.5-13.1-34.4-15.8-5.4-7.4-14-14.4-26.3-20.9-23.1-12.3-51.8-17.2-78.4-12.4 4.2.4 14 9.2 17.9 9.8-5.9 4-21.7 3.5-21.6 12.4 21.1-2.1 44.2 1.2 63.7 9.9-15.5 1.8-29.8 5.6-40 10.9-29.4 15.5-37.1 46.4-29.4 89.7 7.8 43.3 41.8 201.1 52.6 253.7s-23.2 86.6-44.8 95.9l23.2 1.5-7.7 17c27.8 3.1 58.8-6.2 58.8-6.2-6.2 17-48 23.2-48 23.2s20.1 6.2 52.6-6.2 52.6-20.1 52.6-20.1l15.5 40.2 29.4-29.4 12.4 30.9c-.1.1 23.1-7.6 15.3-43.2"
          fill="#ffffff"
        />

        {/* Eyes */}
        <path
          d="M177.4 220.5c0-9 7.3-16.2 16.2-16.2 9 0 16.2 7.3 16.2 16.2 0 9-7.3 16.2-16.2 16.2-8.9.1-16.1-7.2-16.2-16.2"
          fill="#2d4f8e"
        />
        <path
          d="M196.7 215.1c0-2.3 1.9-4.2 4.2-4.2s4.2 1.9 4.2 4.2-1.9 4.2-4.2 4.2-4.2-1.9-4.2-4.2"
          fill="#ffffff"
        />
        <path
          d="M288.3 210.9c0-7.7 6.3-13.9 14-13.9s14 6.2 14 14c0 7.7-6.2 14-14 14-7.7-.2-13.9-6.4-14-14.1"
          fill="#2d4f8e"
        />
        <path
          d="M304.9 206.2c0-2 1.6-3.6 3.6-3.6s3.6 1.6 3.6 3.6-1.6 3.6-3.5 3.6h-.1c-2 0-3.6-1.6-3.6-3.6"
          fill="#ffffff"
        />

        {/* Eyebrows */}
        <path
          d="M198.3 173.4s-12.2-5.5-24.2 1.9c-11.9 7.5-11.4 15.1-11.4 15.1s-6.3-14.1 10.5-21c16.9-6.8 25.1 4 25.1 4"
          fill="url(#ddg-eye-grad-1)"
        />
        <path
          d="M310.7 172.3s-8.8-5-15.6-4.9c-14 .2-17.9 6.4-17.9 6.4s2.4-14.8 20.3-11.8c9.8 1.5 13.2 10.3 13.2 10.3"
          fill="url(#ddg-eye-grad-2)"
        />
      </g>

      {/* Yellow Beak */}
      <path
        d="M243.4 283.2c1.6-9.8 27-28.4 45-29.6 18-1.1 23.6-.9 38.7-4.5s53.8-13.3 64.5-18.2c10.7-5 56.2 2.5 24.2 20.3-13.9 7.8-51.3 22-78 30s-42.9-7.6-51.7 5.5c-7.1 10.4-1.4 24.7 30.5 27.7 43.1 4 84.4-19.4 88.9-7 4.6 12.4-37 27.9-62.3 28.4s-76.3-16.7-83.9-22c-7.8-5.3-18-17.7-15.9-30.6"
        fill="#fdd20a"
      />

      {/* Green Bowtie */}
      <path
        d="M262.9 417.5s-60.5-32.3-61.5-19.2 0 66.5 7.1 70.6c7.1 4 57.5-26.2 57.5-26.2zm23.2-2.1s41.3-31.3 50.4-29.2 11.1 66.6 3 69.6-55.4-16.4-55.4-16.4"
        fill="#65bc46"
      />
      <path
        d="M248.3 420.9c0 21.2-3 30.2 6.1 32.3 9.1 2 26.2 0 32.3-4s1-31.2-1-36.3c-2.2-5.1-37.4-1.1-37.4 8"
        fill="#43a244"
      />
      <path
        d="M252.1 416.2c0 21.2-3 30.3 6.1 32.3 9 2 26.2 0 32.3-4s1-31.2-1-36.3c-2.1-5.1-37.4-1.1-37.4 8"
        fill="#65bc46"
      />
      <path
        d="M309.7 472.1c-18.1 4.6-36.7 6.9-55.4 6.9-20.2 0-39.8-2.7-58.5-7.8l.2 1.8c19 5.1 38.6 7.7 58.3 7.7 19.4 0 38.1-2.5 56.1-7.1z"
        fill="#ffffff"
      />
    </svg>
  ),

  // Official Microsoft Bing Logo (Transparent background, matching Bing_Logo.svg uploaded by user)
  bing: (
    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 36 56" fill="none">
      <defs>
        <linearGradient id="bing-blue-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00A4EF" />
          <stop offset="45%" stopColor="#0078D4" />
          <stop offset="100%" stopColor="#0050EF" />
        </linearGradient>
      </defs>
      {/* Faceted ribbon 'b' with triangular cutout matching Bing_Logo.svg */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5 3L16.5 9V22L18.2 19.8L32 27V39.5L16.5 53L5 47ZM18.2 19.8L24.8 33L16.5 41.5V22Z"
        fill="url(#bing-blue-grad)"
      />
    </svg>
  ),

  // Official Brave Browser Lion Logo (Transparent background, no box container)
  brave: (
    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="brave-orange-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FB542B" />
          <stop offset="100%" stopColor="#FF3B00" />
        </linearGradient>
      </defs>
      <path
        d="M15.68 0l2.096 2.38s1.84-.512 2.709.358c.868.87 1.584 1.638 1.584 1.638l-.562 1.381.715 2.047s-2.104 7.98-2.35 8.955c-.486 1.919-.818 2.66-2.198 3.633-1.38.972-3.884 2.66-4.293 2.916-.409.256-.92.692-1.38.692-.46 0-.97-.436-1.38-.692a185.796 185.796 0 01-4.293-2.916c-1.38-.973-1.712-1.714-2.197-3.633-.247-.975-2.351-8.955-2.351-8.955l.715-2.047-.562-1.381s.716-.768 1.585-1.638c.868-.87 2.708-.358 2.708-.358L8.321 0h7.36zm-3.679 14.936c-.14 0-1.038.317-1.758.69-.72.373-1.242.637-1.409.742-.167.104-.065.301.087.409.152.107 2.194 1.69 2.393 1.866.198.175.489.464.687.464.198 0 .49-.29.688-.464.198-.175 2.24-1.759 2.392-1.866.152-.108.254-.305.087-.41-.167-.104-.689-.368-1.41-.741-.72-.373-1.617-.69-1.757-.69zm0-11.278s-.409.001-1.022.206-1.278.46-1.584.46c-.307 0-2.581-.434-2.581-.434S4.119 7.152 4.119 7.849c0 .697.339.881.68 1.243l2.02 2.149c.192.203.59.511.356 1.066-.235.555-.58 1.26-.196 1.977.384.716 1.042 1.194 1.464 1.115.421-.08 1.412-.598 1.776-.834.364-.237 1.518-1.19 1.518-1.554 0-.365-1.193-1.02-1.413-1.168-.22-.15-1.226-.725-1.247-.95-.02-.227-.012-.293.284-.851.297-.559.831-1.304.742-1.8-.089-.495-.95-.753-1.565-.986-.615-.232-1.799-.671-1.947-.74-.148-.068-.11-.133.339-.175.448-.043 1.719-.212 2.292-.052.573.16 1.552.403 1.632.532.079.13.149.134.067.579-.081.445-.5 2.581-.541 2.96-.04.38-.12.63.288.724.409.094 1.097.256 1.333.256s.924-.162 1.333-.256c.408-.093.329-.344.288-.723-.04-.38-.46-2.516-.541-2.961-.082-.445-.012-.45.067-.579.08-.129 1.059-.372 1.632-.532.573-.16 1.845.009 2.292.052.449.042.487.107.339.175-.148.069-1.332.508-1.947.74-.615.233-1.476.49-1.565.986-.09.496.445 1.241.742 1.8.297.558.304.624.284.85-.02.226-1.026.802-1.247.95-.22.15-1.413.804-1.413 1.169 0 .364 1.154 1.317 1.518 1.554.364.236 1.355.755 1.776.834.422.079 1.08-.4 1.464-1.115.384-.716.039-1.422-.195-1.977-.235-.555.163-.863.355-1.066l2.02-2.149c.341-.362.68-.546.68-1.243 0-.697-2.695-3.96-2.695-3.96s-2.274.436-2.58.436c-.307 0-.972-.256-1.585-.461-.613-.205-1.022-.206-1.022-.206z"
        fill="url(#brave-orange-grad)"
      />
    </svg>
  ),

  // Official Ecosia Tree Logo (Transparent background, no green circle container)
  ecosia: (
    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="ecosia-green-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#00A87E" />
          <stop offset="100%" stopColor="#006C4F" />
        </linearGradient>
      </defs>
      {/* Tree canopy shape */}
      <path
        d="M12 2C8.1 2 5 5.1 5 9c0 2.2 1 4.2 2.6 5.5.3.3.4.6.4 1v3.5c0 .6.4 1 1 1h6c.6 0 1-.4 1-1v-3.5c0-.4.2-.8.5-1C18 13.2 19 11.2 19 9c0-3.9-3.1-7-7-7z"
        fill="url(#ecosia-green-grad)"
      />
      {/* Inner tree cutout */}
      <path
        d="M12 9.5c-1.7 0-3 1.3-3 3 0 1 .4 1.9 1.1 2.5.3.3.5.7.5 1.1v1.9h2.8V16.1c0-.4.2-.8.5-1.1.7-.6 1.1-1.5 1.1-2.5 0-1.7-1.3-3-3-3z"
        fill="#FFFFFF"
        opacity="0.9"
      />
      {/* Golden Seed */}
      <circle cx="12" cy="12" r="1.2" fill="#F7CA18" />
    </svg>
  ),

  // Official Qwant Multi-Color 'Q' Logo (Transparent background, no dark blue circle)
  qwant: (
    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="qwant-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#43B05C" />
          <stop offset="50%" stopColor="#3598FE" />
          <stop offset="100%" stopColor="#FF4636" />
        </linearGradient>
      </defs>
      <path
        d="M9.313 5.163c4.289 0 7.766 2.589 7.766 7.616 0 4.759-3.072 7.301-7.003 7.59 1.87 1.142 4.693 1.143 6.45-.348l.547.297-.615 3.074-.226.285c-3.118.918-5.947-.099-7.921-3.329-3.816-.37-6.765-2.9-6.765-7.568 0-5.03 3.477-7.617 7.766-7.617zm0 13.88c2.756 0 4.08-2.804 4.08-6.264 0-3.46-1.148-6.264-4.08-6.264-2.85 0-4.08 2.805-4.08 6.264 0 3.46 1.182 6.264 4.08 6.264zm8.719-16.319L18.734 0h.263l.703 2.725 2.754.71v.248l-2.754.71-.703 2.725h-.263l-.702-2.725-2.696-.695V3.42z"
        fill="url(#qwant-grad)"
      />
    </svg>
  ),

  // Official Startpage Privacy Logo (Transparent background, no blue circle container)
  startpage: (
    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none">
      <defs>
        <linearGradient id="startpage-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7E7BFF" />
          <stop offset="100%" stopColor="#4F46E5" />
        </linearGradient>
      </defs>
      <path
        d="m16.885 14.254.04-.06a8.723 8.723 0 0 0 1.851-4.309c-1.334 0-2.648 0-3.982.04a4.901 4.901 0 0 1-4.758 3.696 4.948 4.948 0 0 1-4.56-3.044 89.632 89.632 0 0 0-3.941.514c1.035 3.697 4.46 6.405 8.501 6.405a8.76 8.76 0 0 0 3.743-.83l.06-.02.04.04 5.455 6.603c.378.454.916.711 1.513.711.458 0 .896-.158 1.234-.435.399-.336.657-.79.697-1.304.04-.514-.1-1.009-.438-1.424zM5.118 8.56c.1-2.59 2.27-4.685 4.918-4.685a4.911 4.911 0 0 1 4.898 4.389c1.314.02 2.608.04 3.922.099C18.616 3.717 14.754 0 10.036 0c-4.858 0-8.82 3.934-8.82 8.758v.178a86.7 86.7 0 0 1 3.902-.376z"
        fill="url(#startpage-grad)"
      />
    </svg>
  ),

  // Official YouTube Logo
  youtube: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
      <path
        d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"
        fill="#FF0000"
      />
      <path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#FFFFFF" />
    </svg>
  ),

  // Official GitHub Invertocat Logo
  github: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  ),
};

export const searchEngines: SearchEngine[] = [
  {
    id: 'google',
    name: 'Google',
    searchUrl: 'https://www.google.com/search?q=',
    placeholder: 'Rechercher sur Google ou saisir une URL...',
    color: '#4285F4',
    iconType: 'svg',
  },
  {
    id: 'duckduckgo',
    name: 'DuckDuckGo',
    searchUrl: 'https://duckduckgo.com/?q=',
    placeholder: 'Recherche privée avec DuckDuckGo...',
    color: '#DE5833',
    iconType: 'svg',
  },
  {
    id: 'bing',
    name: 'Microsoft Bing',
    searchUrl: 'https://www.bing.com/search?q=',
    placeholder: 'Rechercher sur Bing...',
    color: '#008373',
    iconType: 'svg',
  },
  {
    id: 'brave',
    name: 'Brave Search',
    searchUrl: 'https://search.brave.com/search?q=',
    placeholder: 'Rechercher de manière indépendante avec Brave...',
    color: '#FB542B',
    iconType: 'svg',
  },
  {
    id: 'ecosia',
    name: 'Ecosia',
    searchUrl: 'https://www.ecosia.org/search?q=',
    placeholder: 'Rechercher et planter des arbres avec Ecosia...',
    color: '#008060',
    iconType: 'svg',
  },
  {
    id: 'qwant',
    name: 'Qwant',
    searchUrl: 'https://www.qwant.com/?q=',
    placeholder: 'Le moteur de recherche qui respecte votre vie privée...',
    color: '#55B749',
    iconType: 'svg',
  },
  {
    id: 'startpage',
    name: 'Startpage',
    searchUrl: 'https://www.startpage.com/sp/search?query=',
    placeholder: 'Rechercher anonymement avec Startpage...',
    color: '#003780',
    iconType: 'svg',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    searchUrl: 'https://www.youtube.com/results?search_query=',
    placeholder: 'Rechercher des vidéos sur YouTube...',
    color: '#FF0000',
    iconType: 'svg',
  },
  {
    id: 'github',
    name: 'GitHub',
    searchUrl: 'https://github.com/search?q=',
    placeholder: 'Rechercher du code, repos ou devs sur GitHub...',
    color: '#ffffff',
    iconType: 'svg',
  },
];
