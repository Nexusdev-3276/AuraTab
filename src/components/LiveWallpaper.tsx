import React, { useRef, useEffect, useState } from 'react';
import { Wallpaper } from '../types';
import { Play, Pause } from 'lucide-react';

interface LiveWallpaperProps {
  wallpaper: Wallpaper;
  brightness: number; // 20 to 100
  blur: number; // 0 to 20
  speed: number; // 0.5 to 2
  isZenMode: boolean;
  onToggleZen: () => void;
}

export const LiveWallpaper: React.FC<LiveWallpaperProps> = ({
  wallpaper,
  brightness,
  blur,
  speed,
  isZenMode,
  onToggleZen,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  const isVideo = Boolean(wallpaper.videoUrl && !videoError);

  useEffect(() => {
    setIsVideoLoaded(false);
    setVideoError(false);

    if (wallpaper.videoUrl && videoRef.current) {
      const vid = videoRef.current;
      vid.muted = true;
      vid.defaultMuted = true;
      vid.playbackRate = speed;
      vid.playsInline = true;
      vid.setAttribute('playsinline', '');
      vid.setAttribute('muted', '');

      const playPromise = vid.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.warn('Video auto-play prevented, will play on interaction:', err);
            setIsPlaying(false);
            const tryPlay = () => {
              vid.play().then(() => setIsPlaying(true)).catch(() => {});
              window.removeEventListener('click', tryPlay);
              window.removeEventListener('keydown', tryPlay);
              window.removeEventListener('touchstart', tryPlay);
            };
            window.addEventListener('click', tryPlay, { once: true });
            window.addEventListener('keydown', tryPlay, { once: true });
            window.addEventListener('touchstart', tryPlay, { once: true });
          });
      }
    }
  }, [wallpaper.videoUrl, speed]);

  const togglePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleVideoError = async () => {
    if (
      videoRef.current &&
      wallpaper.videoUrl.includes('itachi-blood-moon.mp4') &&
      !videoRef.current.src.includes('motionbgs.com')
    ) {
      console.log('Falling back to remote high-res Itachi video stream');
      videoRef.current.src = 'https://motionbgs.com/media/6465/itachi-sharingan-red-moon.1920x1080.mp4';
      videoRef.current.load();
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      return;
    }

    if (wallpaper.id.startsWith('custom-')) {
      try {
        const { getWallpaperBlob } = await import('../utils/wallpaperStorage');
        const blob = await getWallpaperBlob(wallpaper.id);
        if (blob && videoRef.current) {
          const freshUrl = URL.createObjectURL(blob);
          videoRef.current.src = freshUrl;
          videoRef.current.load();
          videoRef.current
            .play()
            .then(() => {
              setIsPlaying(true);
              setIsVideoLoaded(true);
            })
            .catch(() => {});
          return;
        }
      } catch (err) {
        console.warn('Failed to reload custom video blob:', err);
      }
    }

    console.warn('Could not load video directly, falling back to static poster / image');
    setVideoError(true);
  };

  return (
    <div
      id="live-wallpaper-container"
      className="fixed inset-0 w-full h-full overflow-hidden z-0 pointer-events-auto"
      onClick={isZenMode ? onToggleZen : undefined}
      style={{ cursor: isZenMode ? 'pointer' : 'default' }}
    >
      {/* Background Image / GIF / Fallback Poster */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 scale-105"
        style={{
          backgroundImage: `url("${wallpaper.thumbnailUrl}")`,
          filter: `brightness(${brightness}%) blur(${blur}px)`,
          opacity: isVideo && isVideoLoaded ? 0 : 1,
        }}
      />

      {/* Looping HTML5 Video */}
      {wallpaper.videoUrl && !videoError && (
        <video
          ref={videoRef}
          key={wallpaper.videoUrl}
          src={wallpaper.videoUrl}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onLoadedData={() => setIsVideoLoaded(true)}
          onCanPlay={() => setIsVideoLoaded(true)}
          onPlaying={() => {
            setIsVideoLoaded(true);
            setIsPlaying(true);
          }}
          onError={handleVideoError}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 scale-105 ${
            isVideoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            filter: `brightness(${brightness}%) blur(${blur}px)`,
          }}
        />
      )}

      {/* Subtle Vignette Gradient Overlay for readability */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.55) 100%)',
        }}
      />

      {/* Minimal Video Control pill only when video is active */}
      {isVideo && (
        <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300">
          {/* Video Play/Pause button */}
          <button
            id="toggle-video-playback-btn"
            onClick={togglePlayPause}
            className="p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/80 hover:text-white hover:bg-black/60 transition-all text-xs flex items-center gap-1.5"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
        </div>
      )}
    </div>
  );
};
