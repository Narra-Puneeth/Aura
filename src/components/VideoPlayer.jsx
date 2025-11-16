import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

const VideoPlayer = forwardRef(({ videoId, onEnterVR, onVideoEnd }, ref) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [availableQualities, setAvailableQualities] = useState([]);
  const [currentQuality, setCurrentQuality] = useState('auto');
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Load YouTube IFrame API if not already loaded
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        setIsReady(true);
      };
    } else {
      setIsReady(true);
    }
  }, []);

  useEffect(() => {
    if (!isReady) return;

    // Destroy existing player if it exists
    if (playerRef.current) {
      playerRef.current.destroy();
    }

    // Create new player with the current videoId
    playerRef.current = new window.YT.Player(`player-${videoId}`, {
      videoId: videoId,
      playerVars: {
        autoplay: 1,
        controls: 0,
        disablekb: 1,
        fs: 1,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        iv_load_policy: 3,
        playsinline: 0, // Allow fullscreen VR
        cc_load_policy: 0,
        loop: 0,
        // Force highest quality
        vq: 'hd2160', // Request 4K quality
        hd: 1,
        // Enable 360/VR features
        enablejsapi: 1,
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
      },
    });

    // Wait for iframe to be created, then add VR attributes
    setTimeout(() => {
      const iframe = document.querySelector(`#player-${videoId} iframe`);
      if (iframe) {
        iframe.setAttribute('allowfullscreen', 'true');
        iframe.setAttribute('webkitallowfullscreen', 'true');
        iframe.setAttribute('mozallowfullscreen', 'true');
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; xr-spatial-tracking; fullscreen');
      }
    }, 100);

    return () => {
      // Cleanup on unmount or videoId change
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (playerRef.current && playerRef.current.destroy) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [videoId, isReady]);

  const onPlayerReady = (event) => {
    setDuration(event.target.getDuration());
    
    // Get and store available quality levels
    const availableQualityLevels = event.target.getAvailableQualityLevels();
    console.log('Available quality levels:', availableQualityLevels);
    setAvailableQualities(availableQualityLevels);
    
    if (availableQualityLevels.length > 0) {
      // Set to highest quality by default
      const highestQuality = availableQualityLevels[0];
      event.target.setPlaybackQuality(highestQuality);
      setCurrentQuality(highestQuality);
      console.log('Setting initial quality to:', highestQuality);
      
      // Double check after a delay
      setTimeout(() => {
        const actualQuality = event.target.getPlaybackQuality();
        setCurrentQuality(actualQuality);
        console.log('Actual quality after setting:', actualQuality);
      }, 1500);
    }
    
    // Try to play the video
    event.target.playVideo();
    setIsBuffering(false);
  };

  // Function to change video quality
  const changeQuality = (quality) => {
    if (playerRef.current && playerRef.current.setPlaybackQuality) {
      console.log('Changing quality to:', quality);
      playerRef.current.setPlaybackQuality(quality);
      setCurrentQuality(quality);
      setShowQualityMenu(false);
      
      // Verify after change
      setTimeout(() => {
        const actualQuality = playerRef.current.getPlaybackQuality();
        setCurrentQuality(actualQuality);
        console.log('Quality changed to:', actualQuality);
      }, 1000);
    }
  };

  // Get quality label for display
  const getQualityLabel = (quality) => {
    const labels = {
      'hd2160': '4K (2160p)',
      'hd1440': '1440p',
      'hd1080': '1080p',
      'hd720': '720p',
      'large': '480p',
      'medium': '360p',
      'small': '240p',
      'tiny': '144p',
      'auto': 'Auto'
    };
    return labels[quality] || quality;
  };

  const onPlayerStateChange = (event) => {
    if (event.data === window.YT.PlayerState.PLAYING) {
      setIsPlaying(true);
      startProgressTracking();
      
      // Force highest quality when playing starts
      const availableQualityLevels = playerRef.current.getAvailableQualityLevels();
      if (availableQualityLevels.includes('hd2160')) {
        playerRef.current.setPlaybackQuality('hd2160');
        setCurrentQuality('hd2160');
        console.log('✅ Playing at 4K (2160p) quality');
      } else if (availableQualityLevels.includes('hd1440')) {
        playerRef.current.setPlaybackQuality('hd1440');
        setCurrentQuality('hd1440');
        console.log('✅ Playing at 1440p quality');
      } else if (availableQualityLevels.includes('hd1080')) {
        playerRef.current.setPlaybackQuality('hd1080');
        setCurrentQuality('hd1080');
        console.log('✅ Playing at 1080p quality');
      } else {
        const quality = playerRef.current.getPlaybackQuality();
        setCurrentQuality(quality);
        console.log('Playing at quality:', quality);
      }
    } else if (event.data === window.YT.PlayerState.ENDED) {
      setIsPlaying(false);
      if (onVideoEnd) {
        onVideoEnd();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    } else {
      setIsPlaying(false);
    }
  };

  useImperativeHandle(ref, () => ({
    play: () => {
      if (playerRef.current && playerRef.current.playVideo) {
        playerRef.current.playVideo();
      }
    },
    pause: () => {
      if (playerRef.current && playerRef.current.pauseVideo) {
        playerRef.current.pauseVideo();
      }
    },
    getPlayer: () => playerRef.current
  }));

  const startProgressTracking = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      if (playerRef.current && playerRef.current.getCurrentTime) {
        setCurrentTime(playerRef.current.getCurrentTime());
      }
    }, 1000);
  };

  const togglePlay = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (playerRef.current) {
      playerRef.current.setVolume(newVolume * 100);
    }
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (playerRef.current) {
      playerRef.current.seekTo(newTime);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full bg-black youtube-container"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {/* YouTube Player with branding hidden */}
      <div 
        id={`player-${videoId}`} 
        className="absolute inset-0"
        style={{
          pointerEvents: showControls ? 'none' : 'auto',
        }}
      ></div>

      <style>{`
        /* YouTube container styling */
        .youtube-container iframe {
          position: absolute;
          top: -80px !important;
          left: 0;
          width: 100%;
          height: calc(100% + 160px) !important;
          pointer-events: auto;
        }
        
        /* Fullscreen VR mode styling */
        .youtube-container iframe:-webkit-full-screen,
        .youtube-container iframe:-moz-full-screen,
        .youtube-container iframe:-ms-fullscreen,
        .youtube-container iframe:fullscreen {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          z-index: 999999 !important;
        }
        
        /* COMPLETE YouTube branding removal - ALL elements */
        .ytp-large-play-button,
        .ytp-watermark,
        .ytp-chrome-top,
        .ytp-show-cards-title,
        .ytp-pause-overlay,
        .ytp-chrome-bottom,
        .ytp-gradient-bottom,
        .ytp-gradient-top,
        .ytp-title,
        .ytp-title-text,
        .ytp-title-link,
        .ytp-share-button,
        .ytp-share-panel,
        .ytp-channel-button,
        .ytp-watch-later-button,
        .ytp-cards-button,
        .ytp-cards-teaser,
        .ytp-endscreen-content,
        .ytp-ce-element,
        .ytp-player-content,
        .ytp-show-cards-title,
        .ytp-info-panel-button,
        .ytp-youtube-button,
        .ytp-context-menu-button,
        .ytp-settings-button,
        .ytp-miniplayer-button,
        .ytp-size-button,
        .ytp-subtitles-button,
        .ytp-overflow-button,
        .iv-branding,
        .ytp-impression-link,
        .ytp-cued-thumbnail-overlay,
        .ytp-ce-covering-overlay,
        .ytp-ce-element-shadow,
        .ytp-ce-top-left-quad,
        .ytp-ce-top-right-quad,
        .ytp-ce-bottom-left-quad,
        .ytp-ce-bottom-right-quad,
        .ytp-spinner,
        .ytp-paid-content-overlay,
        .ytp-muted-autoplay-endscreen-overlay {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }
        
        /* Hide YouTube logo and branding in VR mode */
        .youtube-container iframe:-webkit-full-screen .ytp-watermark,
        .youtube-container iframe:-moz-full-screen .ytp-watermark,
        .youtube-container iframe:fullscreen .ytp-watermark,
        .youtube-container iframe:-webkit-full-screen .ytp-chrome-top,
        .youtube-container iframe:-moz-full-screen .ytp-chrome-top,
        .youtube-container iframe:fullscreen .ytp-chrome-top {
          display: none !important;
          visibility: hidden !important;
        }
        
        /* Ensure overlay bars appear in fullscreen */
        :-webkit-full-screen-ancestor .fixed {
          position: fixed !important;
          z-index: 2147483647 !important;
        }
        
        /* Safari fullscreen support */
        :-webkit-full-screen .fixed {
          position: fixed !important;
        }
      `}</style>

      {/* Custom Controls Overlay */}
      <div
        className={`custom-controls absolute inset-0 flex flex-col justify-between p-6 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)' }}
      >
        {/* Top Controls */}
        <div className="flex justify-between items-start">
          <button
            onClick={() => window.history.back()}
            className="glass p-3 rounded-full hover:bg-white/20 transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <button
            onClick={onEnterVR}
            className="btn-primary flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span>Enter VR Mode</span>
          </button>
        </div>

        {/* Bottom Controls */}
        <div className="space-y-4">
          {/* Progress Bar */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-white">{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={handleSeek}
              className="flex-1 h-1 bg-white/20 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #BFFF00 0%, #BFFF00 ${(currentTime / duration) * 100}%, rgba(255,255,255,0.2) ${(currentTime / duration) * 100}%, rgba(255,255,255,0.2) 100%)`
              }}
            />
            <span className="text-sm text-white">{formatTime(duration)}</span>
          </div>

          {/* Play/Pause and Volume */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Play/Pause Button */}
              <button
                onClick={togglePlay}
                className="w-12 h-12 flex items-center justify-center glass rounded-full hover:bg-white/20 transition-all"
              >
                {isPlaying ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              {/* Volume Control */}
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                </svg>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-24 h-1 bg-white/20 rounded-full appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* Quality Selector */}
            <div className="relative">
              <button
                onClick={() => setShowQualityMenu(!showQualityMenu)}
                className="glass px-4 py-2 rounded-full hover:bg-white/20 transition-all flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm font-medium">{getQualityLabel(currentQuality)}</span>
              </button>

              {/* Quality Menu */}
              {showQualityMenu && (
                <div className="absolute bottom-full right-0 mb-2 glass rounded-xl p-2 min-w-[140px] shadow-2xl">
                  <div className="text-xs text-gray-400 px-3 py-1 mb-1">Video Quality</div>
                  {availableQualities.map((quality) => (
                    <button
                      key={quality}
                      onClick={() => changeQuality(quality)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-all flex items-center justify-between ${
                        currentQuality === quality
                          ? 'bg-aura-green text-black font-semibold'
                          : 'text-white hover:bg-white/10'
                      }`}
                    >
                      <span>{getQualityLabel(quality)}</span>
                      {currentQuality === quality && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;
