import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';
import Loading from '../components/Loading';

const TherapySession = () => {
  const { sessionId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [isVRMode, setIsVRMode] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [rating, setRating] = useState(0);
  const [isVRSupported, setIsVRSupported] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const videoPlayerRef = useRef(null);

  useEffect(() => {
    // Get session data from location state or fetch it
    if (location.state?.session) {
      setSession(location.state.session);
    } else {
      // Fallback session data
      setSession({
        id: sessionId,
        title: 'Therapy Session',
        description: 'Immersive VR therapy experience',
        duration: '15 min',
        videoId: '7AkbUfZjS5k', // Default VR video
        thumbnail: '💧'
      });
    }

    // Check VR support on mount
    checkVRSupport();
  }, [sessionId, location]);

  const checkVRSupport = async () => {
    if (navigator.xr) {
      try {
        const supported = await navigator.xr.isSessionSupported('immersive-vr');
        setIsVRSupported(supported);
      } catch (error) {
        console.log('VR check failed:', error);
        setIsVRSupported(false);
      }
    } else {
      setIsVRSupported(false);
    }
  };

  const handleEnterVR = async () => {
    try {
      setIsVRMode(true);
      
      // Get the iframe element
      const iframe = document.querySelector('iframe');
      if (!iframe) {
        console.error('YouTube iframe not found');
        alert('Video player not ready. Please try again.');
        setIsVRMode(false);
        return;
      }

      // For Quest browsers, request fullscreen which enables VR mode for 360 videos
      const requestFullscreen = iframe.requestFullscreen || 
                                iframe.webkitRequestFullscreen || 
                                iframe.mozRequestFullScreen || 
                                iframe.msRequestFullscreen;

      if (requestFullscreen) {
        try {
          await requestFullscreen.call(iframe);
          
          // YouTube automatically detects VR headset in fullscreen mode for 360 videos
          // The Quest browser will show the VR toggle button
          console.log('Entered fullscreen VR mode');
        } catch (fsError) {
          console.error('Fullscreen error:', fsError);
          
          // Fallback: Try to trigger VR mode through YouTube API
          if (videoPlayerRef.current?.getPlayer) {
            const player = videoPlayerRef.current.getPlayer();
            if (player && player.playVideo) {
              player.playVideo();
            }
          }
        }
      } else {
        // Fallback for browsers without fullscreen API
        console.log('Fullscreen not supported, playing in 360 mode');
      }
      
      // Listen for fullscreen exit
      const onFullscreenChange = () => {
        if (!document.fullscreenElement && 
            !document.webkitFullscreenElement && 
            !document.mozFullScreenElement && 
            !document.msFullscreenElement) {
          setIsVRMode(false);
          document.removeEventListener('fullscreenchange', onFullscreenChange);
          document.removeEventListener('webkitfullscreenchange', onFullscreenChange);
          document.removeEventListener('mozfullscreenchange', onFullscreenChange);
          document.removeEventListener('MSFullscreenChange', onFullscreenChange);
        }
      };
      
      document.addEventListener('fullscreenchange', onFullscreenChange);
      document.addEventListener('webkitfullscreenchange', onFullscreenChange);
      document.addEventListener('mozfullscreenchange', onFullscreenChange);
      document.addEventListener('MSFullscreenChange', onFullscreenChange);
      
    } catch (error) {
      console.error('Error entering VR:', error);
      setIsVRMode(false);
    }
  };

  const handleBeginSession = async () => {
    setShowOverlay(false);
    
    // Wait for overlay to fade out
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Auto-play video after overlay is removed
    const iframe = document.querySelector('iframe');
    if (iframe) {
      iframe.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
    }
    
    // Auto-enter VR mode if VR headset is detected
    if (isVRSupported) {
      console.log('VR headset detected - auto-entering VR mode');
      // Wait a bit for video to start playing
      setTimeout(() => {
        handleEnterVR();
      }, 1000);
    } else {
      console.log('No VR headset detected - playing in normal 360° mode');
    }
  };

  const handleSessionComplete = () => {
    setShowFeedback(true);
  };

  const handleFeedbackSubmit = () => {
    // Save session completion and rating
    const completedSessions = JSON.parse(localStorage.getItem('completed_sessions') || '[]');
    completedSessions.push({
      sessionId: session.id,
      title: session.title,
      rating: rating,
      completedAt: new Date().toISOString()
    });
    localStorage.setItem('completed_sessions', JSON.stringify(completedSessions));
    
    // Navigate to dashboard
    navigate('/dashboard');
  };

  if (!session) {
    return <Loading fullScreen message="Loading session..." />;
  }

  if (showFeedback) {
    return (
      <div className="fixed inset-0 bg-aura-dark flex items-center justify-center z-50 px-6">
        <div className="max-w-md w-full glass rounded-3xl p-8 text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-3xl font-bold text-white mb-4">Session Complete!</h2>
          <p className="text-gray-400 mb-8">How was your experience?</p>
          
          <div className="flex justify-center space-x-2 mb-8">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="transition-transform hover:scale-110"
              >
                <svg 
                  className={`w-10 h-10 ${star <= rating ? 'text-yellow-400' : 'text-gray-600'}`}
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
          </div>

          <button
            onClick={handleFeedbackSubmit}
            disabled={rating === 0}
            className="btn-primary w-full mb-4"
          >
            Continue
          </button>
          <button
            onClick={() => navigate('/therapy')}
            className="text-gray-400 hover:text-white transition-colors"
          >
            Choose another session
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black">
      {/* Session Info Overlay (appears before video starts) */}
      {showOverlay && (
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/60 to-black/90 z-20 flex items-center justify-center">
          <div className="text-center px-6 max-w-2xl">
            <div className="mb-6">
              <img 
                src={`https://img.youtube.com/vi/${session.videoId}/maxresdefault.jpg`}
                alt={session.title}
                className="w-32 h-32 rounded-2xl mx-auto object-cover shadow-2xl"
                onError={(e) => {
                  e.target.src = `https://img.youtube.com/vi/${session.videoId}/hqdefault.jpg`;
                }}
              />
            </div>
            <h1 className="text-5xl font-bold text-white mb-4 text-shadow-strong">
              {session.title}
            </h1>
            <p className="text-xl text-gray-300 mb-8 text-shadow">
              {session.description}
            </p>
            <div className="flex items-center justify-center space-x-6 mb-10 text-gray-300">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{session.duration}</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-aura-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>{isVRSupported ? 'VR Ready' : '360° Mode'}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-gray-400 text-sm mb-6 space-y-2">
                <p className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5 text-aura-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                  <span>Use headphones for the best experience</span>
                </p>
                <p className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5 text-aura-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>Find a comfortable position</span>
                </p>
                <p className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5 text-aura-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Allow yourself to fully immerse</span>
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={handleBeginSession}
                  className="btn-primary text-lg px-12 py-4"
                >
                  Begin Session
                </button>
                
                <button
                  onClick={() => navigate('/therapy')}
                  className="btn-secondary text-lg px-12 py-4"
                >
                  Choose Different Session
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Player */}
      <div className="w-full h-full">
        <VideoPlayer 
          ref={videoPlayerRef}
          videoId={session.videoId} 
          onEnterVR={handleEnterVR}
          onVideoEnd={handleSessionComplete}
        />
      </div>

      {/* Breathing Guide Overlay (optional) */}
      {!showFeedback && !showOverlay && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30">
          <div className="glass px-6 py-3 rounded-full flex items-center space-x-3">
            <div className="w-3 h-3 bg-aura-green rounded-full animate-pulse"></div>
            <span className="text-white text-sm">Focus on your breath</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TherapySession;
