"use client";

import { useState, useRef, useEffect } from "react";
import type { RadioTrack, RadioPlaylist } from "@/types/academy";

type Props = {
  tracks: RadioTrack[];
  playlists?: RadioPlaylist[];
  compact?: boolean;
  /** Minimal: just player + track name (max 2 lines), no header, no track list */
  minimal?: boolean;
};

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export function RadioPlayer({ tracks, playlists = [], compact = false, minimal = false }: Props) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showMorePlaylists, setShowMorePlaylists] = useState(false);
  const [showMoreTracks, setShowMoreTracks] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const playerRef = useRef<any>(null);
  const playerDivRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentTrack = tracks[currentTrackIndex] || tracks[0];
  const displayTracks = showMoreTracks ? tracks : tracks.slice(0, 5);

  // Load YouTube iframe API
  useEffect(() => {
    if (typeof window === 'undefined' || !currentTrack?.youtubeId) return;

    // Check if API is already loaded
    if (window.YT && window.YT.Player) {
      initializePlayer();
      return;
    }

    // Load the API script
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Set up callback
    window.onYouTubeIframeAPIReady = () => {
      initializePlayer();
    };

    return () => {
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch (e) {
          // Ignore errors
        }
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Initialize player when track changes
  useEffect(() => {
    if (isPlayerReady && playerRef.current && currentTrack?.youtubeId) {
      // Check if player has the method before calling it
      if (typeof playerRef.current.loadVideoById === 'function') {
        try {
          playerRef.current.loadVideoById(currentTrack.youtubeId);
          setIsPlaying(false);
          setCurrentTime(0);
        } catch (e) {
          console.error("Error loading video:", e);
        }
      }
    }
  }, [currentTrackIndex, currentTrack?.youtubeId, isPlayerReady]);

  const initializePlayer = () => {
    if (!playerDivRef.current || !currentTrack?.youtubeId || !window.YT) return;

    playerRef.current = new window.YT.Player(playerDivRef.current, {
      videoId: currentTrack.youtubeId,
      playerVars: {
        autoplay: 0, // Never autoplay
        controls: 0,
        modestbranding: 1,
        rel: 0,
        mute: 1, // Start muted to prevent any sound
      },
      events: {
        onReady: (event: any) => {
          try {
            const dur = event.target.getDuration();
            setDuration(dur);
            setIsPlayerReady(true);
          } catch (e) {
            console.error("Error getting duration:", e);
          }
        },
        onStateChange: (event: any) => {
          // 0 = ended, 1 = playing, 2 = paused, 3 = buffering, 5 = cued
          if (event.data === 1) {
            setIsPlaying(true);
            startTimeUpdate();
          } else if (event.data === 2 || event.data === 0) {
            setIsPlaying(false);
            stopTimeUpdate();
          }
        },
      },
    });
  };

  const startTimeUpdate = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (playerRef.current) {
        try {
          const time = playerRef.current.getCurrentTime();
          setCurrentTime(time);
        } catch (e) {
          // Ignore errors
        }
      }
    }, 100);
  };

  const stopTimeUpdate = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handlePlayPause = () => {
    if (!playerRef.current || !isPlayerReady) return;
    try {
      if (isPlaying) {
        if (typeof playerRef.current.pauseVideo === 'function') {
          playerRef.current.pauseVideo();
        }
      } else {
        // Unmute and play when user clicks
        if (typeof playerRef.current.unMute === 'function') {
          playerRef.current.unMute();
        }
        if (typeof playerRef.current.playVideo === 'function') {
          playerRef.current.playVideo();
        }
      }
    } catch (e) {
      console.error("Error playing/pausing video:", e);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!playerRef.current || !duration || !isPlayerReady) return;
    if (typeof playerRef.current.seekTo !== 'function') return;
    try {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = x / rect.width;
      const newTime = percentage * duration;
      playerRef.current.seekTo(newTime, true);
      setCurrentTime(newTime);
    } catch (e) {
      console.error("Error seeking video:", e);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (minimal) {
    return (
      <div>
        <div ref={playerDivRef} className="hidden" />
        <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handlePlayPause}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#70FF88] text-black transition-all hover:bg-[#5bee72]"
            >
              <span className="material-symbols-rounded text-[20px]" style={{ fontVariationSettings: '"FILL" 1' }}>
                {isPlaying ? "pause" : "play_arrow"}
              </span>
            </button>
            <div className="min-w-0 flex-1">
              <div
                className="h-1 w-full cursor-pointer rounded-full bg-[#e8e8e8] dark:bg-[#2a3039]"
                onClick={handleSeek}
              >
                <div
                  className="h-full rounded-full bg-[#70FF88] transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              {currentTrack && (
                <p className="mt-2 line-clamp-1 text-[13px] text-black/80 dark:text-white/80">
                  {currentTrack.title}
                </p>
              )}
            </div>
          </div>
      </div>
    );
  }

  if (compact) {
    // Compact version for two-column layout - styled according to screenshot
    return (
      <div>
        {/* Hidden YouTube player */}
        <div ref={playerDivRef} className="hidden" />
        
        <h2 className="mb-4 font-serif text-[22px] font-bold text-black dark:text-[#f2f4f6]">
          Radio & Playlists
        </h2>
        
        <div className="rounded-[12px] border border-[#e0e0e0] bg-[#f0f0f0] p-4 dark:border-[#303640] dark:bg-[#1a1f27]">
          {/* Live-Stream Radio Section */}
          <div className="mb-6">
            <h3 className="mb-3 text-[14px] font-bold text-black dark:text-[#f2f4f6]">
              Live-Stream Radio with Podcast and Music
            </h3>
            
            <div className="flex items-center gap-3">
              {/* Play Button */}
              <button
                type="button"
                onClick={handlePlayPause}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#70FF88] text-black transition-all hover:bg-[#5bee72]"
              >
                <span 
                  className="material-symbols-rounded text-[24px]"
                  style={{
                    fontVariationSettings: '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24'
                  }}
                >
                  {isPlaying ? "pause" : "play_arrow"}
                </span>
              </button>
              
              {/* Progress Bar */}
              <div className="flex-1">
                <div 
                  className="h-1 w-full rounded-full bg-[#e8e8e8] dark:bg-[#2a3039] cursor-pointer"
                  onClick={handleSeek}
                >
                  <div
                    className="h-full rounded-full bg-[#70FF88] transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                {currentTrack && (
                  <p className="mt-2 text-[13px] text-[#616161] dark:text-[#a7b0bd]">
                    {currentTrack.duration || "14:55"} – {currentTrack.title}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {/* Tracks List - show first 5 with expand option */}
          {tracks.length > 0 && (
            <div className="mb-6">
              <div className="space-y-2">
                {displayTracks.map((track, index) => (
                  <button
                    key={track.id}
                    type="button"
                    onClick={() => {
                      setCurrentTrackIndex(index);
                      if (isPlayerReady && playerRef.current && tracks[index]?.youtubeId) {
                        if (typeof playerRef.current.loadVideoById === 'function') {
                          try {
                            playerRef.current.loadVideoById(tracks[index].youtubeId);
                            setIsPlaying(false);
                          } catch (e) {
                            console.error("Error loading video:", e);
                          }
                        }
                      }
                    }}
                    className={`flex w-full items-center gap-3 rounded-[8px] border p-3 text-left transition-colors ${
                      index === currentTrackIndex
                        ? "border-[#70FF88] bg-[#70FF88]/10 dark:bg-[#70FF88]/20"
                        : "border-[#e0e0e0] bg-white hover:bg-[#f5f5f5] dark:border-[#303640] dark:bg-[#181d25] dark:hover:bg-[#1f252d]"
                    }`}
                  >
                    <span 
                      className="material-symbols-rounded text-[18px] text-[#616161] dark:text-[#a7b0bd]"
                      style={{
                        fontVariationSettings: '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24'
                      }}
                    >
                      {index === currentTrackIndex && isPlaying ? "pause" : "play_arrow"}
                    </span>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-[14px] font-semibold text-black dark:text-[#f2f4f6]">
                        {track.title}
                      </h4>
                      {track.speaker && (
                        <p className="text-[12px] text-[#616161] dark:text-[#a7b0bd]">
                          {track.speaker}
                        </p>
                      )}
                    </div>
                    {track.duration && (
                      <span className="text-[12px] text-[#616161] dark:text-[#a7b0bd]">
                        {track.duration}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              {tracks.length > 5 && (
                <button
                  type="button"
                  onClick={() => setShowMoreTracks(!showMoreTracks)}
                  className="mt-2 flex w-full items-center justify-center gap-1 rounded-[8px] border border-[#e0e0e0] bg-white p-3 text-center text-[12px] font-semibold text-[#616161] transition-colors hover:bg-[#f5f5f5] dark:border-[#303640] dark:bg-[#181d25] dark:text-[#a7b0bd] dark:hover:bg-[#1f252d]"
                >
                  {showMoreTracks ? "Show less" : "Show more"}
                  <span 
                    className="material-symbols-rounded text-[16px]"
                    style={{
                      fontVariationSettings: '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24'
                    }}
                  >
                    {showMoreTracks ? "expand_less" : "expand_more"}
                  </span>
                </button>
              )}
            </div>
          )}
          
          {/* Playlists Section */}
          {playlists.length > 0 && (
            <div>
              <h3 className="mb-3 text-[14px] font-semibold text-[#616161] dark:text-[#a7b0bd]">
                Playlists
              </h3>
              <div className="space-y-2">
                {(showMorePlaylists ? playlists : playlists.slice(0, 4)).map((playlist) => (
                  <a
                    key={playlist.id}
                    href={playlist.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-[8px] border border-[#e0e0e0] bg-white p-3 text-left transition-colors hover:bg-[#f5f5f5] dark:border-[#303640] dark:bg-[#181d25] dark:hover:bg-[#1f252d]"
                  >
                    <span 
                      className="material-symbols-rounded text-[18px] text-[#616161] dark:text-[#a7b0bd]"
                      style={{
                        fontVariationSettings: '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24'
                      }}
                    >
                      play_arrow
                    </span>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-[14px] font-semibold text-black dark:text-[#f2f4f6]">
                        {playlist.title}
                      </h4>
                      <p className="text-[12px] text-[#616161] dark:text-[#a7b0bd]">
                        {playlist.tracksCount} Tracks • {playlist.duration}
                      </p>
                    </div>
                  </a>
                ))}
                {playlists.length > 4 && (
                  <button
                    type="button"
                    onClick={() => setShowMorePlaylists(!showMorePlaylists)}
                    className="flex w-full items-center justify-center gap-1 rounded-[8px] border border-[#e0e0e0] bg-white p-3 text-center text-[12px] font-semibold text-[#616161] transition-colors hover:bg-[#f5f5f5] dark:border-[#303640] dark:bg-[#181d25] dark:text-[#a7b0bd] dark:hover:bg-[#1f252d]"
                  >
                    Show more
                    <span 
                      className="material-symbols-rounded text-[16px]"
                      style={{
                        fontVariationSettings: '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24'
                      }}
                    >
                      {showMorePlaylists ? "expand_less" : "expand_more"}
                    </span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Full version (original)
  return (
    <div className="mb-12">
      <h2 className="mb-4 font-serif text-[22px] font-bold text-black dark:text-[#f2f4f6]">
        Radio & Playlists
      </h2>
      
      {/* Main Player */}
      <div className="mb-6 rounded-[12px] border border-[#e0e0e0] bg-white p-4 dark:border-[#303640] dark:bg-[#181d25]">
        <div className="flex items-center gap-4">
          {/* Thumbnail */}
          {currentTrack?.thumbnailUrl && (
            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[8px] bg-[#f5f5f5] dark:bg-[#252b35]">
              <img
                src={currentTrack.thumbnailUrl}
                alt={currentTrack.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          
          {/* Controls and Info */}
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#70FF88]">
                Live-Stream Radio
              </span>
              {currentTime > 0 && (
                <span className="text-[12px] text-[#616161] dark:text-[#a7b0bd]">
                  {formatTime(currentTime)}
                </span>
              )}
            </div>
            <p className="mb-1 text-[14px] font-medium text-black dark:text-[#f2f4f6]">
              {currentTrack?.title}
            </p>
            {currentTrack?.speaker && (
              <p className="text-[12px] text-[#616161] dark:text-[#a7b0bd]">
                {currentTrack.speaker}
              </p>
            )}
            
            {/* Progress Bar */}
            <div 
              className="mt-3 h-1 w-full rounded-full bg-[#e8e8e8] dark:bg-[#2a3039] cursor-pointer"
              onClick={handleSeek}
            >
              <div
                className="h-full rounded-full bg-[#70FF88] transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            {/* Controls */}
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={handlePlayPause}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-[#70FF88] text-black transition-all hover:bg-[#5bee72]"
              >
                <span 
                  className="material-symbols-rounded text-[24px]"
                  style={{
                    fontVariationSettings: '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24'
                  }}
                >
                  {isPlaying ? "pause" : "play_arrow"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Track List */}
      {tracks.length > 0 && (
        <div className="space-y-2">
          {tracks.map((track, index) => (
            <button
              key={track.id}
              type="button"
              onClick={() => {
                setCurrentTrackIndex(index);
                if (isPlayerReady && playerRef.current && tracks[index]?.youtubeId) {
                  if (typeof playerRef.current.loadVideoById === 'function') {
                    try {
                      playerRef.current.loadVideoById(tracks[index].youtubeId);
                      setIsPlaying(false);
                    } catch (e) {
                      console.error("Error loading video:", e);
                    }
                  }
                }
              }}
              className={`flex w-full items-center gap-3 rounded-[8px] border p-3 text-left transition-colors ${
                index === currentTrackIndex
                  ? "border-[#70FF88] bg-[#70FF88]/10 dark:bg-[#70FF88]/20"
                  : "border-[#e0e0e0] bg-white hover:bg-[#f5f5f5] dark:border-[#303640] dark:bg-[#181d25] dark:hover:bg-[#1f252d]"
              }`}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f0f0f0] text-black transition-colors hover:bg-[#e0e0e0] dark:bg-[#2a3039] dark:text-[#f2f4f6] dark:hover:bg-[#3a4048]">
                <span 
                  className="material-symbols-rounded text-[20px]"
                  style={{
                    fontVariationSettings: '"FILL" 1, "wght" 400, "GRAD" 0, "opsz" 24'
                  }}
                >
                  {index === currentTrackIndex && isPlaying ? "pause" : "play_arrow"}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-[14px] font-semibold text-black dark:text-[#f2f4f6]">
                  {track.title}
                </h3>
                {track.speaker && (
                  <p className="text-[12px] text-[#616161] dark:text-[#a7b0bd]">
                    {track.speaker}
                  </p>
                )}
              </div>
              {track.duration && (
                <span className="text-[12px] text-[#616161] dark:text-[#a7b0bd]">
                  {track.duration}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
