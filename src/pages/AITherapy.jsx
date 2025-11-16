import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import GridBackground from '../components/GridBackground';

const AITherapy = () => {
  const [mode, setMode] = useState('voice'); // 'voice' or 'chat'
  const [isFlipping, setIsFlipping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [conversation, setConversation] = useState([
    { role: 'ai', text: 'Hello! I\'m Aura, your AI therapy companion. I\'m here to listen and support you. How are you feeling today?' }
  ]);
  const [waveAnimation, setWaveAnimation] = useState(0);
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);
  const intervalRef = useRef(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  // Wave animation for voice mode
  useEffect(() => {
    if (isListening && mode === 'voice') {
      intervalRef.current = setInterval(() => {
        setWaveAnimation(prev => (prev + 1) % 100);
      }, 50);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setWaveAnimation(0);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isListening, mode]);

  // Speech Recognition Setup
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setTranscript(transcript);

        if (event.results[current].isFinal) {
          handleUserMessage(transcript);
          setTranscript('');
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleModeSwitch = () => {
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    setIsFlipping(true);
    setTimeout(() => {
      setMode(mode === 'voice' ? 'chat' : 'voice');
      setIsFlipping(false);
    }, 300);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleUserMessage = async (message) => {
    if (!message.trim()) return;
    
    // Add user message
    const newConversation = [...conversation, { role: 'user', text: message }];
    setConversation(newConversation);

    // Simulate AI response (in production, this would call an AI API)
    setTimeout(() => {
      const responses = [
        "I hear you. That sounds like it's been really challenging. Can you tell me more about what you're experiencing?",
        "Thank you for sharing that with me. It takes courage to open up. How long have you been feeling this way?",
        "I understand. Those feelings are completely valid. What do you think might help you feel better right now?",
        "That's a lot to process. Remember, it's okay to take things one step at a time. What's one small thing you could do today to care for yourself?",
        "I'm here with you through this. Would you like to try a breathing exercise together, or would you prefer to keep talking?"
      ];
      
      const aiResponse = responses[Math.floor(Math.random() * responses.length)];
      setConversation(prev => [...prev, { role: 'ai', text: aiResponse }]);
      
      // Speak the response in voice mode
      if (mode === 'voice' && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(aiResponse);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
      }
    }, 1500);
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (transcript.trim()) {
      handleUserMessage(transcript);
      setTranscript('');
    }
  };

  return (
    <GridBackground className="min-h-screen">
      <Navbar transparent={true} />

      <div className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              <span className="gradient-text">AI Therapy</span> Companion
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
              Experience compassionate AI therapy through voice or text. I'm here to listen, understand, and support you.
            </p>

            {/* Mode Toggle */}
            <div className="inline-flex items-center glass rounded-full p-2">
              <button
                onClick={handleModeSwitch}
                disabled={isFlipping}
                className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                  mode === 'voice'
                    ? 'bg-gradient-to-r from-aura-purple to-aura-pink text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                  <span>Voice Therapy</span>
                </span>
              </button>
              <button
                onClick={handleModeSwitch}
                disabled={isFlipping}
                className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                  mode === 'chat'
                    ? 'bg-gradient-to-r from-aura-green to-aura-blue text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <span className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>Chat Therapy</span>
                </span>
              </button>
            </div>
          </div>

          {/* Main Therapy Interface */}
          <div className="max-w-5xl mx-auto perspective-1000">
            <div
              className={`relative transition-all duration-700 transform-style-3d ${
                isFlipping ? 'rotate-y-180' : ''
              }`}
              style={{
                transformStyle: 'preserve-3d',
                transform: isFlipping ? 'rotateY(180deg)' : 'rotateY(0deg)'
              }}
            >
              {/* Voice Mode Interface */}
              {mode === 'voice' && (
                <div className="backface-hidden">
                  <div className="glass rounded-3xl p-12 backdrop-blur-2xl border border-white/10 shadow-2xl">
                    {/* Voice Visualizer */}
                    <div className="relative h-96 flex items-center justify-center mb-8">
                      {/* Animated Circles */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`absolute rounded-full border-2 transition-all duration-1000 ${
                              isListening
                                ? 'border-aura-green animate-ping'
                                : 'border-aura-purple/30'
                            }`}
                            style={{
                              width: `${120 + i * 60}px`,
                              height: `${120 + i * 60}px`,
                              animationDelay: `${i * 0.2}s`,
                              opacity: isListening ? 0.3 - i * 0.05 : 0.2
                            }}
                          />
                        ))}
                      </div>

                      {/* Center Microphone Button - Simple Professional Style */}
                      <button
                        onClick={toggleListening}
                        className={`relative z-10 w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isListening
                            ? 'scale-110'
                            : 'hover:scale-105'
                        }`}
                      >
                        {/* Simple pulsing ring when listening */}
                        {isListening && (
                          <>
                            <div className="absolute inset-0 rounded-full bg-aura-green/30 animate-ping" />
                            <div className="absolute inset-0 rounded-full bg-aura-green/20 animate-pulse" />
                          </>
                        )}
                        
                        {/* Main button */}
                        <div className={`relative w-full h-full rounded-full flex items-center justify-center transition-all duration-300 ${
                          isListening
                            ? 'bg-aura-green shadow-xl shadow-aura-green/50'
                            : 'glass shadow-xl hover:bg-white/10'
                        }`}>
                          {isListening ? (
                            <div className="flex flex-col items-center justify-center">
                              {/* Simple waveform */}
                              <div className="flex items-end space-x-1 mb-1">
                                {[...Array(4)].map((_, i) => (
                                  <div
                                    key={i}
                                    className="w-1 bg-black rounded-full animate-wave"
                                    style={{
                                      height: `${16 + (i % 2) * 8}px`,
                                      animationDelay: `${i * 0.15}s`
                                    }}
                                  />
                                ))}
                              </div>
                              <span className="text-black text-xs font-semibold mt-1">Listening</span>
                            </div>
                          ) : (
                            <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                            </svg>
                          )}
                        </div>
                      </button>
                    </div>

                    {/* Status and Transcript */}
                    <div className="text-center space-y-4">
                      <div className={`text-2xl font-bold transition-colors duration-300 ${
                        isListening ? 'text-aura-green' : 'text-white'
                      }`}>
                        {isListening ? '🎙️ Listening...' : '👆 Tap to speak'}
                      </div>
                      
                      {transcript && (
                        <div className="glass rounded-2xl p-6 min-h-[80px] animate-fade-in">
                          <p className="text-white text-lg">{transcript}</p>
                        </div>
                      )}

                      {!transcript && !isListening && (
                        <p className="text-gray-400 text-sm">
                          Press the microphone and start speaking. I'll listen carefully and respond with empathy.
                        </p>
                      )}
                    </div>

                    {/* Recent Conversation Summary */}
                    {conversation.length > 1 && (
                      <div className="mt-8 space-y-3 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                        {conversation.slice(-4).map((msg, idx) => (
                          <div
                            key={idx}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm ${
                                msg.role === 'user'
                                  ? 'bg-gradient-to-r from-aura-purple to-aura-pink text-white'
                                  : 'glass text-gray-200'
                              }`}
                            >
                              {msg.text}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Chat Mode Interface */}
              {mode === 'chat' && (
                <div className="backface-hidden">
                  <div className="glass rounded-3xl backdrop-blur-2xl border border-white/10 shadow-2xl overflow-hidden">
                    {/* Chat Header */}
                    <div className="bg-gradient-to-r from-aura-green/20 to-aura-blue/20 border-b border-white/10 p-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-aura-green to-aura-blue flex items-center justify-center">
                          <svg className="w-8 h-8 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-white">Aura AI</h3>
                          <p className="text-sm text-aura-green flex items-center space-x-1">
                            <span className="w-2 h-2 bg-aura-green rounded-full animate-pulse" />
                            <span>Online & Ready to Help</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Messages Container */}
                    <div className="h-[500px] overflow-y-auto p-6 space-y-4 custom-scrollbar bg-black/20">
                      {conversation.map((message, idx) => (
                        <div
                          key={idx}
                          className={`flex items-start space-x-3 animate-fade-in ${
                            message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                          }`}
                        >
                          {/* Avatar */}
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                              message.role === 'user'
                                ? 'bg-gradient-to-br from-aura-purple to-aura-pink'
                                : 'bg-gradient-to-br from-aura-green to-aura-blue'
                            }`}
                          >
                            {message.role === 'user' ? (
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            ) : (
                              <svg className="w-6 h-6 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                              </svg>
                            )}
                          </div>

                          {/* Message Bubble */}
                          <div
                            className={`max-w-[70%] px-5 py-3 rounded-2xl shadow-lg ${
                              message.role === 'user'
                                ? 'bg-gradient-to-br from-aura-purple to-aura-pink text-white rounded-tr-none'
                                : 'glass text-white rounded-tl-none border border-white/10'
                            }`}
                          >
                            <p className="text-sm leading-relaxed">{message.text}</p>
                            <span className="text-xs opacity-60 mt-1 block">
                              {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="border-t border-white/10 p-6 bg-black/30">
                      <form onSubmit={handleTextSubmit} className="flex items-center space-x-3">
                        <div className="flex-1 relative">
                          <input
                            type="text"
                            value={transcript}
                            onChange={(e) => setTranscript(e.target.value)}
                            placeholder="Type your message here..."
                            className="w-full px-6 py-4 bg-aura-gray/50 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-aura-green border border-white/5 placeholder-gray-500"
                          />
                          <button
                            type="button"
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-aura-green transition-colors"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                        </div>
                        <button
                          type="submit"
                          disabled={!transcript.trim()}
                          className="w-14 h-14 rounded-full bg-gradient-to-r from-aura-green to-aura-blue text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                        </button>
                      </form>
                      
                      <p className="text-xs text-gray-500 mt-3 text-center">
                        Press Enter to send • Your conversation is private and confidential
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16 max-w-6xl mx-auto">
            <div className="glass p-6 rounded-2xl text-center hover:scale-105 transition-transform">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-aura-purple to-aura-pink flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">100% Private</h3>
              <p className="text-sm text-gray-400">End-to-end encrypted conversations</p>
            </div>

            <div className="glass p-6 rounded-2xl text-center hover:scale-105 transition-transform">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-aura-green to-aura-blue flex items-center justify-center">
                <svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">24/7 Available</h3>
              <p className="text-sm text-gray-400">Always here when you need support</p>
            </div>

            <div className="glass p-6 rounded-2xl text-center hover:scale-105 transition-transform">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-aura-pink to-aura-purple flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Empathetic AI</h3>
              <p className="text-sm text-gray-400">Trained to understand and care</p>
            </div>

            <div className="glass p-6 rounded-2xl text-center hover:scale-105 transition-transform">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-aura-blue to-aura-green flex items-center justify-center">
                <svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Voice & Text</h3>
              <p className="text-sm text-gray-400">Choose your preferred method</p>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-16 glass p-8 rounded-2xl max-w-4xl mx-auto border border-white/10">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <svg className="w-8 h-8 text-aura-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Important Notice</h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Aura AI is designed to provide emotional support and guidance, but it is not a substitute for professional mental health care. 
                  If you're experiencing a mental health crisis or emergency, please contact a licensed therapist or call your local emergency services immediately. 
                  Crisis resources: National Suicide Prevention Lifeline (988) • Crisis Text Line (text HOME to 741741)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(191, 255, 0, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(191, 255, 0, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(191, 255, 0, 0.5);
        }

        .perspective-1000 {
          perspective: 1000px;
        }

        .transform-style-3d {
          transform-style: preserve-3d;
        }

        .backface-hidden {
          backface-visibility: hidden;
        }

        .rotate-y-180 {
          transform: rotateY(180deg);
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) translateX(20px);
            opacity: 0;
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }

        .animate-spin-reverse {
          animation: spin-reverse 6s linear infinite;
        }

        @keyframes gradient-xy {
          0%, 100% {
            background-position: 0% 50%;
            background-size: 400% 400%;
          }
          50% {
            background-position: 100% 50%;
            background-size: 400% 400%;
          }
        }

        .animate-gradient-xy {
          animation: gradient-xy 3s ease infinite;
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }

        @keyframes wave {
          0%, 100% {
            transform: scaleY(1);
          }
          50% {
            transform: scaleY(1.5);
          }
        }

        .animate-wave {
          animation: wave 0.6s ease-in-out infinite;
        }
      `}</style>
    </GridBackground>
  );
};

export default AITherapy;
