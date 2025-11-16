import React, { useState } from 'react';
import VideoPlayer from './VideoPlayer';

const DemoVideoModal = ({ isOpen, onClose }) => {
  const [showOverlay, setShowOverlay] = useState(true);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
      setShowOverlay(true); // Reset overlay when closing
    }
  };

  const handleBeginDemo = () => {
    setShowOverlay(false);
  };

  const handleClose = () => {
    onClose();
    setShowOverlay(true); // Reset overlay for next time
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black animate-fade-in"
      onClick={handleBackdropClick}
    >
      {/* Session Info Overlay (appears before video starts) */}
      {showOverlay && (
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/60 to-black/90 z-20 flex items-center justify-center">
          <div className="text-center px-6 max-w-2xl">
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-8 right-8 text-white hover:text-aura-green transition-colors z-30"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="mb-6">
              <img 
                src="https://img.youtube.com/vi/f24CfKvZ4Lc/maxresdefault.jpg"
                alt="Aura VR Demo"
                className="w-32 h-32 rounded-2xl mx-auto object-cover shadow-2xl"
                onError={(e) => {
                  e.target.src = "https://img.youtube.com/vi/f24CfKvZ4Lc/hqdefault.jpg";
                }}
              />
            </div>
            <h1 className="text-5xl font-bold text-white mb-4 text-shadow-strong">
              <span className="gradient-text">Aura VR Demo</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 text-shadow">
              Experience Sunset Ocean in VR - Full immersive therapy experience
            </p>
            <div className="flex items-center justify-center space-x-6 mb-10 text-gray-300">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>3 min</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-aura-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>360° VR Mode</span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-gray-400 text-sm mb-6 space-y-2">
                <p className="flex items-center justify-center space-x-2">
                  <div className="text-3xl">🥽</div>
                  <span>Put on your VR headset for the best experience</span>
                </p>
                <p className="flex items-center justify-center space-x-2">
                  <div className="text-3xl">🎬</div>
                  <span>Click fullscreen for complete immersion</span>
                </p>
                <p className="flex items-center justify-center space-x-2">
                  <div className="text-3xl">🎯</div>
                  <span>4K quality for crystal clear visuals</span>
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={handleBeginDemo}
                  className="btn-primary text-lg px-12 py-4"
                >
                  Watch Demo
                </button>
                
                <button
                  onClick={handleClose}
                  className="btn-secondary text-lg px-12 py-4"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Player */}
      <div className="w-full h-full">
        <VideoPlayer 
          videoId="f24CfKvZ4Lc"
        />
      </div>

      {/* Close button when video is playing */}
      {!showOverlay && (
        <button
          onClick={handleClose}
          className="absolute top-8 right-8 text-white hover:text-aura-green transition-colors z-30 glass px-4 py-2 rounded-full"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default DemoVideoModal;
