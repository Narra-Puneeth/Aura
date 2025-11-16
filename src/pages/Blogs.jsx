import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Card from '../components/Card';
import GridBackground from '../components/GridBackground';

const Blogs = () => {
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  const blogs = [
    // Latest VR Therapy News
    {
      id: 1,
      title: 'How VR Therapy is Revolutionizing Mental Health Treatment',
      excerpt: 'Virtual reality is transforming the way we approach anxiety, PTSD, and depression treatment with immersive therapeutic experiences.',
      category: 'research',
      source: 'Psychology Today',
      date: '2025-01-15',
      image: 'https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=800',
      readTime: '8 min read',
      author: 'Dr. Sarah Chen'
    },
    {
      id: 2,
      title: 'Meta Quest 3 for Therapy: A Comprehensive Guide',
      excerpt: 'Discover how the latest VR headsets are being used in clinical settings to treat various mental health conditions with proven results.',
      category: 'technology',
      source: 'TechCrunch',
      date: '2025-01-12',
      image: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800',
      readTime: '6 min read',
      author: 'Alex Johnson'
    },
    {
      id: 3,
      title: 'The Science Behind VR Meditation and Mindfulness',
      excerpt: 'New research shows how immersive VR environments can enhance meditation practices and improve mental well-being more effectively than traditional methods.',
      category: 'wellness',
      source: 'Mindful Magazine',
      date: '2025-01-10',
      image: 'https://images.unsplash.com/photo-1545389336-cf090694435e?w=800',
      readTime: '10 min read',
      author: 'Dr. Michael Torres'
    },
    {
      id: 4,
      title: 'Treating PTSD with Virtual Reality Exposure Therapy',
      excerpt: 'Veterans and trauma survivors are finding relief through VR-based exposure therapy, offering a safe space to process difficult experiences.',
      category: 'research',
      source: 'Journal of Mental Health',
      date: '2025-01-08',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
      readTime: '12 min read',
      author: 'Dr. Emily Rodriguez'
    },
    {
      id: 5,
      title: 'Apple Vision Pro in Healthcare: The Future of Therapy?',
      excerpt: 'Healthcare providers are exploring how Apple\'s spatial computing device can create next-generation therapeutic experiences.',
      category: 'technology',
      source: 'Healthcare IT News',
      date: '2025-01-05',
      image: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=800',
      readTime: '7 min read',
      author: 'Jennifer Lee'
    },
    {
      id: 6,
      title: 'Anxiety Relief Through Immersive Nature Experiences',
      excerpt: 'Studies reveal that VR nature experiences can significantly reduce anxiety and stress levels, offering a digital escape into tranquility.',
      category: 'wellness',
      source: 'Calm Insights',
      date: '2025-01-03',
      image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
      readTime: '5 min read',
      author: 'Rachel Green'
    },
    {
      id: 7,
      title: 'VR Therapy for Social Anxiety: Real-World Results',
      excerpt: 'Patients with social anxiety are practicing real-world scenarios in safe VR environments, leading to measurable improvements in confidence.',
      category: 'research',
      source: 'Clinical Psychology Review',
      date: '2024-12-28',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800',
      readTime: '9 min read',
      author: 'Dr. James Wilson'
    },
    {
      id: 8,
      title: 'The Rise of AI-Powered VR Therapy Companions',
      excerpt: 'Artificial intelligence is enhancing VR therapy sessions with personalized responses and adaptive treatment plans.',
      category: 'technology',
      source: 'AI Weekly',
      date: '2024-12-25',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
      readTime: '8 min read',
      author: 'Sophie Martinez'
    },
    {
      id: 9,
      title: 'Mindfulness in the Metaverse: A New Frontier',
      excerpt: 'Explore how virtual worlds are creating dedicated spaces for meditation, breathwork, and mindfulness practices.',
      category: 'wellness',
      source: 'Metaverse Health',
      date: '2024-12-20',
      image: 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=800',
      readTime: '6 min read',
      author: 'David Park'
    },
    {
      id: 10,
      title: 'How VR is Making Therapy More Accessible Worldwide',
      excerpt: 'Virtual reality technology is breaking down barriers to mental health care, especially in underserved communities.',
      category: 'research',
      source: 'Global Health Journal',
      date: '2024-12-18',
      image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=800',
      readTime: '11 min read',
      author: 'Dr. Priya Sharma'
    },
    {
      id: 11,
      title: 'Biofeedback Integration in VR Therapy Sessions',
      excerpt: 'New VR headsets with biometric sensors are providing real-time feedback on stress levels during therapy sessions.',
      category: 'technology',
      source: 'Wearable Tech Weekly',
      date: '2024-12-15',
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800',
      readTime: '7 min read',
      author: 'Chris Anderson'
    },
    {
      id: 12,
      title: 'The Economics of VR Mental Health: Cost vs. Benefit',
      excerpt: 'Analyzing whether VR therapy provides a cost-effective alternative to traditional mental health treatments.',
      category: 'research',
      source: 'Health Economics Today',
      date: '2024-12-12',
      image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800',
      readTime: '10 min read',
      author: 'Dr. Robert Chang'
    }
  ];

  const categories = [
    { id: 'all', label: 'All Articles', icon: '📰' },
    { id: 'research', label: 'Research', icon: '🔬' },
    { id: 'technology', label: 'Technology', icon: '💻' },
    { id: 'wellness', label: 'Wellness', icon: '🧘' }
  ];

  const filteredBlogs = filter === 'all' 
    ? blogs 
    : blogs.filter(blog => blog.category === filter);

  return (
    <GridBackground className="min-h-screen">
      <Navbar transparent={true} />

      <div className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              <span className="gradient-text">VR Therapy</span> News
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
              Stay updated with the latest research, technology, and insights in virtual reality therapy and mental wellness.
            </p>
            
            {/* Update Badge */}
            <div className="inline-flex items-center space-x-2 glass px-6 py-3 rounded-full">
              <div className="w-2 h-2 bg-aura-green rounded-full animate-pulse"></div>
              <span className="text-white font-medium">Updated Daily with Latest VR Mental Health News</span>
            </div>
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
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Featured Article */}
          {filteredBlogs.length > 0 && (
            <Card hover={true} className="mb-12 overflow-hidden cursor-pointer" onClick={() => navigate(`/blogs/${filteredBlogs[0].id}`)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                <div className="h-96 md:h-auto relative">
                  <img 
                    src={filteredBlogs[0].image}
                    alt={filteredBlogs[0].title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-aura-green text-black px-4 py-2 rounded-full text-sm font-bold">
                      FEATURED
                    </span>
                  </div>
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <div className="flex items-center space-x-4 mb-4">
                    <span className="text-aura-purple font-semibold">{filteredBlogs[0].source}</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-400">{filteredBlogs[0].date}</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-400">{filteredBlogs[0].readTime}</span>
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-4">{filteredBlogs[0].title}</h2>
                  <p className="text-gray-400 mb-6 text-lg">{filteredBlogs[0].excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">By {filteredBlogs[0].author}</span>
                    <button className="btn-primary" onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/blogs/${filteredBlogs[0].id}`);
                    }}>
                      Read Article
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.slice(1).map((blog) => (
              <Card 
                key={blog.id} 
                hover={true} 
                className="p-0 overflow-hidden flex flex-col cursor-pointer"
                onClick={() => navigate(`/blogs/${blog.id}`)}
              >
                {/* Image */}
                <div className="h-48 relative overflow-hidden">
                  <img 
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="glass px-3 py-1 rounded-full text-xs font-semibold text-white">
                      {blog.category.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  {/* Meta Info */}
                  <div className="flex items-center space-x-2 mb-3 text-xs text-gray-400">
                    <span>{blog.source}</span>
                    <span>•</span>
                    <span>{blog.date}</span>
                    <span>•</span>
                    <span>{blog.readTime}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
                    {blog.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-1">
                    {blog.excerpt}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                    <span className="text-gray-300 text-sm">By {blog.author}</span>
                    <button 
                      className="text-aura-purple hover:text-aura-pink transition-colors font-semibold text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/blogs/${blog.id}`);
                      }}
                    >
                      Read More →
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Newsletter Signup */}
          <Card className="mt-16 p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
            <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
              Subscribe to receive weekly updates on VR therapy research, technology breakthroughs, and mental wellness insights.
            </p>
            <form className="max-w-md mx-auto flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 bg-aura-gray text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-aura-purple"
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </Card>

          {/* Sources Section */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-white text-center mb-8">Our Sources</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {['Psychology Today', 'TechCrunch', 'Mindful Magazine', 'Clinical Psychology Review'].map((source) => (
                <div key={source} className="glass p-4 rounded-xl text-center">
                  <p className="text-gray-300 font-medium">{source}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </GridBackground>
  );
};

export default Blogs;
