import React from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import Card from './Card';

const TherapyModeSelector = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleModeSelect = (mode) => {
    if (mode === 'ai') {
      navigate('/ai-therapy');
    } else {
      navigate('/therapy');
    }
    onClose();
  };

  const modalContent = (
    <>
      {/* Backdrop with blur */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-md animate-fadeIn"
        style={{ zIndex: 99998 }}
        onClick={onClose}
      />

      {/* Modal */}
      <div 
        className="fixed inset-0 flex items-center justify-center p-4 md:p-6 overflow-y-auto"
        style={{ zIndex: 99999 }}
      >
        <div className="max-w-4xl w-full my-auto animate-slideUp">
          <Card className="p-6 sm:p-8 md:p-12 relative">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 md:top-6 md:right-6 text-gray-400 hover:text-white transition-colors z-10"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Header */}
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Choose Your <span className="gradient-text">Therapy Mode</span>
              </h2>
              <p className="text-xl text-gray-400">
                Select the experience that best suits your needs today
              </p>
            </div>

            {/* Mode Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* AI Therapy */}
              <button
                onClick={() => handleModeSelect('ai')}
                className="group relative overflow-hidden rounded-2xl transition-all hover:scale-105"
              >
                <div className="glass p-8 h-full">
                  {/* Icon */}
                  <div className="w-16 h-16 mb-6 rounded-full bg-gradient-to-br from-aura-green to-aura-purple flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-white mb-3">AI Therapy Session</h3>
                  <p className="text-gray-400 mb-6">
                    Have a real-time conversation with our AI companion. Speak freely and receive empathetic, personalized responses.
                  </p>

                  {/* Features */}
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start space-x-2 text-sm text-gray-300">
                      <svg className="w-5 h-5 text-aura-green flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Live voice conversation</span>
                    </li>
                    <li className="flex items-start space-x-2 text-sm text-gray-300">
                      <svg className="w-5 h-5 text-aura-green flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Personalized responses</span>
                    </li>
                    <li className="flex items-start space-x-2 text-sm text-gray-300">
                      <svg className="w-5 h-5 text-aura-green flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Available 24/7</span>
                    </li>
                  </ul>

                  {/* CTA */}
                  <div className="flex items-center text-aura-green font-semibold group-hover:translate-x-2 transition-transform">
                    <span>Start AI Session</span>
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>

                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-aura-green/20 to-aura-purple/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-2xl" />
              </button>

              {/* Video Therapy */}
              <button
                onClick={() => handleModeSelect('video')}
                className="group relative overflow-hidden rounded-2xl transition-all hover:scale-105"
              >
                <div className="glass p-8 h-full">
                  {/* Icon */}
                  <div className="w-16 h-16 mb-6 rounded-full bg-gradient-to-br from-aura-purple to-aura-pink flex items-center justify-center group-hover:scale-110 transition-transform">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-white mb-3">Video Guided Therapy</h3>
                  <p className="text-gray-400 mb-6">
                    Experience immersive VR therapy sessions with guided meditation, breathwork, and calming environments.
                  </p>

                  {/* Features */}
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-start space-x-2 text-sm text-gray-300">
                      <svg className="w-5 h-5 text-aura-purple flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>21+ VR experiences</span>
                    </li>
                    <li className="flex items-start space-x-2 text-sm text-gray-300">
                      <svg className="w-5 h-5 text-aura-purple flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>360° immersive videos</span>
                    </li>
                    <li className="flex items-start space-x-2 text-sm text-gray-300">
                      <svg className="w-5 h-5 text-aura-purple flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Works on all VR devices</span>
                    </li>
                  </ul>

                  {/* CTA */}
                  <div className="flex items-center text-aura-purple font-semibold group-hover:translate-x-2 transition-transform">
                    <span>Browse Videos</span>
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>

                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-aura-purple/20 to-aura-pink/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-2xl" />
              </button>
            </div>

            {/* Help Text */}
            <p className="text-center text-sm text-gray-500 mt-8">
              Not sure which to choose? Try AI therapy for personalized conversations or video therapy for guided relaxation.
            </p>
          </Card>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );

  return createPortal(modalContent, document.body);
};

export default TherapyModeSelector;
