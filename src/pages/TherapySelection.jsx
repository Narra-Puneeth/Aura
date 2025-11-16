import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Card from '../components/Card';
import SpotlightCard from '../components/SpotlightCard';
import GridBackground from '../components/GridBackground';

export const therapySessions = [ 
  {
    id: 'open-ocean-sunrise',
    title: 'Open Ocean Sunrise',
    description: 'Experience the serenity of sunrise over the open ocean',
    duration: '20 min',
    difficulty: 'Beginner',
    category: 'nature',
    videoId: 'TMZFkUyFU70',
    thumbnail: 'https://img.youtube.com/vi/TMZFkUyFU70/maxresdefault.jpg',
    rating: 4.9,
    sessions: 1850
  },
  {
    id: 'beach-gentle-waves',
    title: 'Beach with Gentle Waves',
    description: 'Relax on a peaceful beach with soothing wave sounds',
    duration: '18 min',
    difficulty: 'Beginner',
    category: 'nature',
    videoId: 'ip4lZ_v7fU0',
    thumbnail: 'https://img.youtube.com/vi/ip4lZ_v7fU0/maxresdefault.jpg',
    rating: 4.8,
    sessions: 1720
  },
  {
    id: 'grass-fields',
    title: 'Peaceful Grass Fields',
    description: 'Find tranquility in vast, serene grass fields',
    duration: '16 min',
    difficulty: 'Beginner',
    category: 'nature',
    videoId: 'm3woKDCPxYE',
    thumbnail: 'https://img.youtube.com/vi/m3woKDCPxYE/maxresdefault.jpg',
    rating: 4.7,
    sessions: 1540
  },
  {
    id: 'swallows-flying',
    title: 'Swallows Flying',
    description: 'Watch graceful swallows in flight for meditation',
    duration: '15 min',
    difficulty: 'Beginner',
    category: 'nature',
    videoId: '6KjtLUUlS44',
    thumbnail: 'https://img.youtube.com/vi/6KjtLUUlS44/maxresdefault.jpg',
    rating: 4.8,
    sessions: 1380
  },
  {
    id: 'vr-forest-walk',
    title: 'VR Forest Walk',
    description: 'Take a peaceful stroll through tranquil forest environments',
    duration: '18 min',
    difficulty: 'Beginner',
    category: 'nature',
    videoId: 'G_gmoSejUxU',
    thumbnail: 'https://img.youtube.com/vi/G_gmoSejUxU/maxresdefault.jpg',
    rating: 4.9,
    sessions: 1690
  },
  {
    id: 'animals-up-close',
    title: 'Animals Up Close Relaxation',
    description: 'Connect with nature through peaceful animal encounters',
    duration: '14 min',
    difficulty: 'Beginner',
    category: 'nature',
    videoId: 'rS3_-3XpDg4',
    thumbnail: 'https://img.youtube.com/vi/rS3_-3XpDg4/maxresdefault.jpg',
    rating: 4.7,
    sessions: 1120
  },
  {
    id: 'vr-zoo-stress-relief',
    title: 'VR Zoo Stress Relief',
    description: 'Visit exotic animals in immersive VR for stress reduction',
    duration: '17 min',
    difficulty: 'Beginner',
    category: 'nature',
    videoId: 'NCZfq5KRrkE',
    thumbnail: 'https://img.youtube.com/vi/NCZfq5KRrkE/maxresdefault.jpg',
    rating: 4.7,
    sessions: 890
  },
  {
    id: 'underwater-meditation',
    title: 'Underwater Meditation Experience',
    description: 'Dive deep into tranquility with immersive underwater environments',
    duration: '19 min',
    difficulty: 'Intermediate',
    category: 'nature',
    videoId: 'aePXpV8Z10Y',
    thumbnail: 'https://img.youtube.com/vi/aePXpV8Z10Y/maxresdefault.jpg',
    rating: 4.8,
    sessions: 1150
  },
  {
    id: 'mountain-sunrise',
    title: 'Mountain Sunrise Meditation',
    description: 'Witness breathtaking mountain sunrises for spiritual awakening',
    duration: '21 min',
    difficulty: 'Beginner',
    category: 'nature',
    videoId: 'Gly33EsAROY',
    thumbnail: 'https://img.youtube.com/vi/Gly33EsAROY/maxresdefault.jpg',
    rating: 4.9,
    sessions: 1320
  },
  {
    id: 'zen-garden',
    title: 'Zen Garden Mindfulness',
    description: 'Experience tranquility in traditional Japanese zen gardens',
    duration: '17 min',
    difficulty: 'Beginner',
    category: 'nature',
    videoId: 'UUqGeb5-PdM',
    thumbnail: 'https://img.youtube.com/vi/UUqGeb5-PdM/maxresdefault.jpg',
    rating: 4.7,
    sessions: 980
  },
  {
    id: 'tropical-rain',
    title: 'Tropical Rain Sounds',
    description: 'Let tropical rain sounds wash away your stress',
    duration: '26 min',
    difficulty: 'Beginner',
    category: 'nature',
    videoId: 'iPwlNh48eYk',
    thumbnail: 'https://img.youtube.com/vi/iPwlNh48eYk/maxresdefault.jpg',
    rating: 4.9,
    sessions: 1560
  },
  {
    id: 'desert-sunset',
    title: 'Desert Sunset Meditation',
    description: 'Find inner peace with stunning desert sunset views',
    duration: '18 min',
    difficulty: 'Beginner',
    category: 'nature',
    videoId: 'ELQh3z4KrXk',
    thumbnail: 'https://img.youtube.com/vi/ELQh3z4KrXk/maxresdefault.jpg',
    rating: 4.7,
    sessions: 890
  },
  {
    id: 'crystal-cave',
    title: 'Crystal Cave Meditation',
    description: 'Meditate in mystical crystal caverns for energy healing',
    duration: '20 min',
    difficulty: 'Advanced',
    category: 'nature',
    videoId: 'GrrJ349SGXY',
    thumbnail: 'https://img.youtube.com/vi/GrrJ349SGXY/maxresdefault.jpg',
    rating: 4.9,
    sessions: 1100
  },
  
  // Guided Meditation
  {
    id: 'immersive-guided-meditation',
    title: 'Immersive Guided Meditation',
    description: 'Deep meditation experience with professional voice guidance',
    duration: '22 min',
    difficulty: 'Intermediate',
    category: 'guided-meditation',
    videoId: 'xsTpur1pIuk',
    thumbnail: 'https://img.youtube.com/vi/xsTpur1pIuk/maxresdefault.jpg',
    rating: 4.8,
    sessions: 1340
  },
  {
    id: 'guided-meditation-lake',
    title: 'Guided Meditation Near Lake',
    description: 'Find peace beside serene lakeside environments',
    duration: '16 min',
    difficulty: 'Beginner',
    category: 'guided-meditation',
    videoId: '3G57zlHB8Zs',
    thumbnail: 'https://img.youtube.com/vi/3G57zlHB8Zs/maxresdefault.jpg',
    rating: 4.7,
    sessions: 1250
  },
  {
    id: 'meditation-ocean-view',
    title: 'Meditation Ocean View',
    description: 'Meditate with stunning ocean vistas and calming waves',
    duration: '18 min',
    difficulty: 'Intermediate',
    category: 'guided-meditation',
    videoId: 'QfvgLu7ZlXc',
    thumbnail: 'https://img.youtube.com/vi/QfvgLu7ZlXc/maxresdefault.jpg',
    rating: 4.8,
    sessions: 1470
  },
  {
    id: 'guided-meditation-sea',
    title: 'Guided Meditation By Sea',
    description: 'Seaside meditation for ultimate relaxation and peace',
    duration: '20 min',
    difficulty: 'Intermediate',
    category: 'guided-meditation',
    videoId: 'mC0W7P2STqg',
    thumbnail: 'https://img.youtube.com/vi/mC0W7P2STqg/maxresdefault.jpg',
    rating: 4.8,
    sessions: 1380
  },
  
  // Relaxation
  {
    id: 'vr-waterfall-relaxation',
    title: 'VR Waterfall Relaxation',
    description: 'Immerse yourself in peaceful waterfall scenery for deep relaxation',
    duration: '15 min',
    difficulty: 'Beginner',
    category: 'relaxation',
    videoId: '7AkbUfZjS5k',
    thumbnail: 'https://img.youtube.com/vi/7AkbUfZjS5k/maxresdefault.jpg',
    rating: 4.9,
    sessions: 1580
  },
  {
    id: 'calming-guided-relaxation',
    title: 'Calming Guided Relaxation',
    description: 'Gentle guidance to help you achieve complete mental calmness',
    duration: '20 min',
    difficulty: 'Beginner',
    category: 'relaxation',
    videoId: 'c5ktpqERTrQ',
    thumbnail: 'https://img.youtube.com/vi/c5ktpqERTrQ/maxresdefault.jpg',
    rating: 4.8,
    sessions: 1420
  },
  {
    id: 'chakra-healing',
    title: 'Chakra Healing Balance Cleanse',
    description: 'Align and balance your chakras for complete energy harmony',
    duration: '30 min',
    difficulty: 'Advanced',
    category: 'relaxation',
    videoId: 'TU2a3jIrOls',
    thumbnail: 'https://img.youtube.com/vi/TU2a3jIrOls/maxresdefault.jpg',
    rating: 4.9,
    sessions: 980
  },
  {
    id: 'deep-breathing',
    title: 'Deep Breathing Therapy',
    description: 'Master breathing techniques for anxiety relief',
    duration: '15 min',
    difficulty: 'Beginner',
    category: 'relaxation',
    videoId: 'hsFueS6PN3k',
    thumbnail: 'https://img.youtube.com/vi/hsFueS6PN3k/maxresdefault.jpg',
    rating: 4.8,
    sessions: 1420
  },
  
  // Sleep
  {
    id: 'gentle-stream-sleep',
    title: 'Gentle Stream for Sleep',
    description: 'Drift off to peaceful sleep with flowing stream sounds',
    duration: '30 min',
    difficulty: 'Beginner',
    category: 'sleep',
    videoId: 'KwlFkPFa1RU',
    thumbnail: 'https://img.youtube.com/vi/KwlFkPFa1RU/maxresdefault.jpg',
    rating: 4.9,
    sessions: 2340
  },
  {
    id: 'vr-calming-sleep',
    title: 'VR Calming Sleep Relaxation',
    description: 'Drift into peaceful sleep with soothing VR environments',
    duration: '25 min',
    difficulty: 'Beginner',
    category: 'sleep',
    videoId: 'XucTpkjQQLc',
    thumbnail: 'https://img.youtube.com/vi/XucTpkjQQLc/maxresdefault.jpg',
    rating: 4.9,
    sessions: 2130
  },
  {
    id: 'aurora-lights',
    title: 'Aurora Lights Therapy',
    description: 'Heal your mind under the magical northern lights',
    duration: '23 min',
    difficulty: 'Intermediate',
    category: 'sleep',
    videoId: 'GZMJlvMiASc',
    thumbnail: 'https://img.youtube.com/vi/GZMJlvMiASc/maxresdefault.jpg',
    rating: 4.8,
    sessions: 1240
  },
  {
    id: 'peaceful-countryside',
    title: 'Peaceful Countryside Retreat',
    description: 'Escape to serene countryside landscapes for deep relaxation',
    duration: '22 min',
    difficulty: 'Beginner',
    category: 'sleep',
    videoId: 'kUNQlH8TyoY',
    thumbnail: 'https://img.youtube.com/vi/kUNQlH8TyoY/maxresdefault.jpg',
    rating: 4.8,
    sessions: 1380
  },
  {
    id: 'cosmic-journey',
    title: 'Cosmic Journey Relaxation',
    description: 'Explore the cosmos and find peace in the vastness of space',
    duration: '24 min',
    difficulty: 'Advanced',
    category: 'sleep',
    videoId: '3offgJ5kSM0',
    thumbnail: 'https://img.youtube.com/vi/3offgJ5kSM0/maxresdefault.jpg',
    rating: 4.9,
    sessions: 1050
  },
];

const TherapySelection = () => {
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  const categories = [
    { id: 'all', label: 'All Sessions' },
    { id: 'guided-meditation', label: 'Guided Meditation' },
    { id: 'relaxation', label: 'Relaxation' },
    { id: 'nature', label: 'Nature' },
    { id: 'sleep', label: 'Sleep' },
  ];

  const filteredSessions = filter === 'all' 
    ? therapySessions 
    : therapySessions.filter(s => s.category === filter);

  return (
    <GridBackground className="min-h-screen">
      <Navbar transparent={true} />

      <div className="pt-28 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">
              Choose Your <span className="gradient-text">Guided Therapy Session</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Immerse yourself in professionally crafted VR experiences designed to transform your mental wellness
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`px-6 py-3 rounded-full font-semibold transition-all flex items-center space-x-2 ${
                  filter === cat.id
                    ? 'bg-aura-green text-black'
                    : 'glass text-white hover:bg-white/20'
                }`}
              >
                {/* Icon SVGs */}
                {cat.id === 'all' && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                )}
                {cat.id === 'guided-meditation' && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                )}
                {cat.id === 'relaxation' && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                )}
                {cat.id === 'nature' && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {cat.id === 'sleep' && (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Sessions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSessions.map((session) => (
              <SpotlightCard 
                key={session.id} 
                className="p-0 overflow-hidden cursor-pointer"
                spotlightColor="rgba(139, 92, 246, 0.3)"
              >
                <Card hover={true} className="p-0 overflow-hidden border-0 bg-transparent">
                  {/* Thumbnail Image */}
                  <div className="h-48 bg-aura-gray relative overflow-hidden">
                    <img 
                      src={session.thumbnail}
                      alt={session.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback gradient if image fails
                        e.target.style.display = 'none';
                        e.target.parentElement.style.background = 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)';
                      }}
                    />
                    {/* Duration Badge */}
                    <div className="absolute top-4 right-4 bg-aura-green text-black px-3 py-1 rounded-full font-bold text-sm">
                      {session.duration}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-white">{session.title}</h3>
                      <div className="flex items-center space-x-1">
                        <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-white font-semibold">{session.rating}</span>
                      </div>
                    </div>

                    <p className="text-gray-400 text-sm mb-4">{session.description}</p>

                    {/* Metadata */}
                    <div className="flex items-center justify-between text-sm mb-4">
                      <span className="text-gray-500 capitalize">{session.difficulty}</span>
                      <span className="text-xs text-gray-500">
                        {session.sessions.toLocaleString()} sessions
                      </span>
                    </div>

                    <button 
                      onClick={() => navigate(`/therapy/${session.id}`, { state: { session } })}
                      className="w-full btn-primary"
                    >
                      Start Session
                    </button>
                  </div>
                </Card>
              </SpotlightCard>
            ))}
          </div>

          {/* Empty State */}
          {filteredSessions.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-400 text-xl">No sessions found in this category</p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </GridBackground>
  );
};

export default TherapySelection;
//therapypage
