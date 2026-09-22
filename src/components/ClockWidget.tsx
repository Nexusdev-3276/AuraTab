import React, { useState, useEffect } from 'react';
import { AppLanguage, AppTheme } from '../types';

interface ClockWidgetProps {
  is24Hour: boolean;
  showSeconds: boolean;
  showGreeting: boolean;
  language?: AppLanguage;
  timezone?: string;
  theme?: AppTheme;
  className?: string;
}

export const ClockWidget: React.FC<ClockWidgetProps> = ({
  is24Hour,
  showSeconds,
  showGreeting,
  language = 'fr',
  timezone = 'local',
  theme = 'dark',
  className = '',
}) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute time based on chosen timezone
  let time = now;
  if (timezone && timezone !== 'local') {
    try {
      const invDate = new Date(
        now.toLocaleString('en-US', { timeZone: timezone })
      );
      if (!isNaN(invDate.getTime())) {
        time = invDate;
      }
    } catch (e) {
      console.warn('Invalid timezone:', timezone, e);
    }
  }

  // Format hours and minutes
  const hoursRaw = time.getHours();
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  let hoursDisplay = hoursRaw.toString().padStart(2, '0');
  let period = '';

  if (!is24Hour) {
    const h = hoursRaw % 12 || 12;
    hoursDisplay = h.toString();
    period = hoursRaw >= 12 ? 'PM' : 'AM';
  }

  // Format date according to language and timezone
  const locale = language === 'en' ? 'en-US' : 'fr-FR';
  let formattedDate = '';
  try {
    formattedDate = new Intl.DateTimeFormat(locale, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      timeZone: timezone !== 'local' ? timezone : undefined,
    }).format(time);
  } catch {
    formattedDate = time.toDateString();
  }

  const capitalizedDate =
    formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  // Greeting based on time of day and language
  const getGreeting = () => {
    if (language === 'en') {
      if (hoursRaw >= 5 && hoursRaw < 12) return 'Good morning';
      if (hoursRaw >= 12 && hoursRaw < 18) return 'Good afternoon';
      if (hoursRaw >= 18 && hoursRaw < 23) return 'Good evening';
      return 'Good night';
    }
    if (hoursRaw >= 5 && hoursRaw < 12) return 'Bonjour';
    if (hoursRaw >= 12 && hoursRaw < 18) return 'Bon après-midi';
    if (hoursRaw >= 18 && hoursRaw < 23) return 'Bonsoir';
    return 'Douce nuit';
  };

  const isLight = theme === 'light';

  return (
    <div
      id="clock-widget"
      className={`flex flex-col items-center justify-center text-center transition-all select-none ${className}`}
    >
      {showGreeting && (
        <span
          id="greeting-text"
          className={`text-sm md:text-base font-medium tracking-wide mb-1 ${
            isLight
              ? 'text-slate-900 drop-shadow-[0_1px_4px_rgba(255,255,255,0.8)]'
              : 'text-white/80 drop-shadow-md'
          }`}
        >
          {getGreeting()}
        </span>
      )}

      {/* Main Clock */}
      <div className="flex items-baseline justify-center tracking-tight font-light drop-shadow-2xl">
        <span
          className={`text-6xl md:text-8xl lg:text-9xl font-['Outfit',sans-serif] font-light leading-none ${
            isLight
              ? 'text-slate-900 drop-shadow-[0_2px_12px_rgba(255,255,255,0.9)]'
              : 'text-white'
          }`}
        >
          {hoursDisplay}:{minutes}
        </span>
        {showSeconds && (
          <span
            className={`text-2xl md:text-3xl font-light ml-2 font-['Outfit',sans-serif] ${
              isLight ? 'text-slate-700' : 'text-white/70'
            }`}
          >
            {seconds}
          </span>
        )}
        {!is24Hour && (
          <span
            className={`text-lg md:text-xl font-medium ml-3 tracking-widest uppercase ${
              isLight ? 'text-slate-700' : 'text-white/60'
            }`}
          >
            {period}
          </span>
        )}
      </div>

      {/* Date */}
      <div
        id="date-display"
        className={`text-base md:text-lg font-normal tracking-wider mt-2 ${
          isLight
            ? 'text-slate-800 drop-shadow-[0_1px_4px_rgba(255,255,255,0.8)]'
            : 'text-white/85 drop-shadow-md'
        }`}
      >
        {capitalizedDate}
      </div>
    </div>
  );
};
