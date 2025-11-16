import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Card from '../components/Card';
import GridBackground from '../components/GridBackground';
import DemoVideoModal from '../components/DemoVideoModal';
import backgroundVideo from '../assets/background.webm';
import stopScrollingVideo from '../assets/stopscrolling.webm';

const Landing = () => {
  const [scrollY, setScrollY] = useState(0);
  const [videoError, setVideoError] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Force video play on mount
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
      video.play().catch(err => {
        console.log('Autoplay prevented, trying interaction-based play:', err);
        setVideoError(true);
      });
    });

    // Add click listener to play videos if autoplay is blocked
    const handleFirstInteraction = () => {
      videos.forEach(video => {
        if (video.paused) {
          video.play().catch(err => console.log('Play failed:', err));
        }
      });
      document.removeEventListener('click', handleFirstInteraction);
    };

    if (videoError) {
      document.addEventListener('click', handleFirstInteraction);
    }

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
    };
  }, [videoError]);

  return (
    <div className="min-h-screen bg-black">
      <Navbar transparent={true} />

      {/* Hero Section */}
      <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video
            key="hero-video"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
            onCanPlay={(e) => {
              console.log('Hero video can play');
              e.target.play().catch(err => console.log('Video autoplay prevented:', err));
            }}
            onError={(e) => {
              console.error('Hero video error:', e);
              setVideoError(true);
            }}
            onLoadedMetadata={(e) => {
              console.log('Hero video metadata loaded');
            }}
          >
            <source src={backgroundVideo} type="video/webm" />
          </video>
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
          <div className="absolute inset-0 bg-dark-radial"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto mt-16">
          {/* Main Headline */}
          <h1 
            className="text-7xl md:text-8xl lg:text-9xl font-extrabold text-white mb-6 text-shadow-strong animate-fade-in-up"
            style={{ 
              animationDelay: '0.2s',
              animationFillMode: 'both',
              lineHeight: '1.1',
              letterSpacing: '-0.02em'
            }}
          >
            Your Mind.<br />Elevated.
          </h1>

          {/* Subheadline */}
          <p 
            className="text-xl md:text-2xl text-white/90 mb-10 text-shadow animate-fade-in-up"
            style={{ 
              animationDelay: '0.4s',
              animationFillMode: 'both',
              fontWeight: '400',
              letterSpacing: '0.01em'
            }}
          >
            Aura: VR-Powered Therapy for Anxiety & Stress
          </p>

          {/* CTA Buttons */}
          <div 
            className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-20 animate-fade-in-up"
            style={{ 
              animationDelay: '0.6s',
              animationFillMode: 'both'
            }}
          >
            <Link to="/signup" className="btn-secondary text-lg px-10 py-4">
              Get Started
            </Link>
            <button 
              onClick={() => setIsDemoModalOpen(true)}
              className="btn-primary text-lg px-10 py-4"
            >
              Watch Demo
            </button>
          </div>

          {/* Platform Availability */}
          <div 
            className="animate-fade-in-up"
            style={{ 
              animationDelay: '0.8s',
              animationFillMode: 'both'
            }}
          >
            <p className="text-sm md:text-base text-gray-300 mb-6 font-medium">
              Supported on all VR devices
            </p>
            
            {/* VR Headset Names */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs md:text-sm text-gray-400 font-medium">
              <span className="hover:text-aura-green transition-colors">Meta Quest</span>
              <span className="text-gray-600">•</span>
              <span className="hover:text-aura-green transition-colors">PICO</span>
              <span className="text-gray-600">•</span>
              <span className="hover:text-aura-green transition-colors">PlayStation VR</span>
              <span className="text-gray-600">•</span>
              <span className="hover:text-aura-green transition-colors">Android XR</span>
              <span className="text-gray-600">•</span>
              <span className="hover:text-aura-green transition-colors">Vision Pro</span>
              <span className="text-gray-600">•</span>
              <span className="hover:text-aura-green transition-colors">Jio VR</span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Impact Metrics Section - Grid Background */}
      <GridBackground>
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Metric 1 */}
            <div className="text-center">
              <div className="mb-4">
                <svg className="w-16 h-16 mx-auto text-aura-green wave-line" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-4xl font-bold text-white mb-2">26+</h3>
              <p className="text-gray-400">Curated VR Sessions</p>
            </div>

            {/* Metric 2 */}
            <div className="text-center">
              <div className="mb-4">
                <svg className="w-16 h-16 mx-auto text-aura-pink wave-line" style={{ animationDelay: '0.2s' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-4xl font-bold text-white mb-2">520+</h3>
              <p className="text-gray-400">Minutes of Therapy Content</p>
            </div>

            {/* Metric 3 */}
            <div className="text-center">
              <div className="mb-4">
                <svg className="w-16 h-16 mx-auto text-aura-purple wave-line" style={{ animationDelay: '0.4s' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-4xl font-bold text-white mb-2">100%</h3>
              <p className="text-gray-400">WebXR Compatible</p>
            </div>
          </div>
          </div>
        </section>
      </GridBackground>

      {/* Features Section - Grid Background */}
      <GridBackground>
        <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-4">
              Why Choose <span className="gradient-text">Aura</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Experience transformative VR therapy sessions designed by mental health experts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 - Manage Stress */}
            <Card hover={true} className="relative overflow-hidden">
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-20" 
                style={{ backgroundImage: 'url(https://creativelyunited.org/wp-content/uploads/2018/08/beautiful-bright-countryside-675949-1080x675.jpg)' }}
              />
              <div className="relative z-10">
                <div className="mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-aura-purple to-aura-pink rounded-2xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Manage Stress</h3>
                <p className="text-gray-400">
                  Immerse yourself in calming environments designed to reduce anxiety and promote relaxation
                </p>
              </div>
            </Card>

            {/* Feature 2 - Increase Focus */}
            <Card hover={true} className="relative overflow-hidden">
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-20" 
                style={{ backgroundImage: 'url(https://images.stockcake.com/public/7/e/c/7eccaeb1-9d8d-4b1f-a08e-0d9cea534390_large/sunset-yoga-meditation-stockcake.jpg)' }}
              />
              <div className="relative z-10">
                <div className="mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-aura-blue to-aura-teal rounded-2xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Increase Focus</h3>
                <p className="text-gray-400">
                  Guided meditation sessions to enhance concentration and mental clarity
                </p>
              </div>
            </Card>

            {/* Feature 3 - Better Sleep */}
            <Card hover={true} className="relative overflow-hidden">
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-20" 
                style={{ backgroundImage: 'url(https://cdn.prod.website-files.com/620d4ceb8e6d5239fed3395e/620d4ceb8e6d5282cbd339b6_ABCs%20of%20Sleep.png)' }}
              />
              <div className="relative z-10">
                <div className="mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-aura-pink to-aura-purple rounded-2xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Better Sleep</h3>
                <p className="text-gray-400">
                  Relaxing bedtime stories and soundscapes to improve sleep quality
                </p>
              </div>
            </Card>
          </div>
          </div>
        </section>
      </GridBackground>

      {/* Our Mission Section - Grid Background */}
      <GridBackground>
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-6">
          <Card className="p-12 text-center bg-gradient-to-br from-aura-purple/20 to-aura-pink/20">
            <h2 className="text-4xl font-bold text-white mb-6">Our Mission</h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              At Aura, we believe everyone deserves access to effective mental wellness tools. 
              By combining immersive VR technology with evidence-based therapeutic practices, 
              we're creating a new standard for accessible, engaging, and transformative mental health care. 
              Our platform empowers you to take control of your mental wellness journey, 
              one immersive session at a time.
            </p>
          </Card>
          </div>
        </section>
      </GridBackground>

      {/* Pause & Breathe Section */}
      <section className="relative py-0 bg-black overflow-hidden">
        {/* Full Width Video Background */}
        <div className="relative w-full h-[600px]">
          {/* Stop Scrolling Video Background */}
          <video
            key="breathing-video"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
            onCanPlay={(e) => {
              console.log('Breathing video can play');
              e.target.play().catch(err => console.log('Video autoplay prevented:', err));
            }}
            onError={(e) => {
              console.error('Breathing video error:', e);
            }}
            onLoadedMetadata={(e) => {
              console.log('Breathing video metadata loaded');
            }}
          >
            <source src={stopScrollingVideo} type="video/webm" />
          </video>
          
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/50"></div>
          
          {/* Text Overlay - Adjusted Position */}
          <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center justify-center z-10 px-6">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white text-shadow-strong text-center">
              Stop scrolling and take a deep breath with us
            </h2>
            <p className="text-xl md:text-2xl text-white/90 text-shadow text-center max-w-3xl">
              Aura provides a pause to help you reset your day.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section - Grid Background */}
      <GridBackground>
        <section id="therapy-section" className="py-20 relative">
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-aura-purple/30 via-aura-pink/30 to-aura-blue/30 z-0"></div>
          <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-5xl font-bold text-white mb-6">
            Ready to Transform Your Mind?
          </h2>
          <p className="text-xl text-white/90 mb-4">
            Built by Team Mathians for INNOVASIA Hackathon
          </p>
          <p className="text-lg text-white/80 mb-2">
            🤖 Shritij - AI Dev | 💻 Puneeth - Full Stack
          </p>
          <p className="text-lg text-white/80 mb-10">
            Experience the power of VR therapy
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link to="/signup" className="bg-white text-aura-purple font-semibold px-10 py-4 rounded-full hover:scale-105 transition-all duration-300">
              Join Now
            </Link>
            <Link to="/therapy" className="btn-secondary text-lg px-10 py-4">
              Explore Sessions
            </Link>
          </div>
          </div>
        </section>
      </GridBackground>

      <Footer />
      
      {/* Demo Video Modal */}
      <DemoVideoModal 
        isOpen={isDemoModalOpen} 
        onClose={() => setIsDemoModalOpen(false)} 
      />
    </div>
  );
};

export default Landing;
