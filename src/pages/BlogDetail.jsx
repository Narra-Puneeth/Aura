import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Card from '../components/Card';
import GridBackground from '../components/GridBackground';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Blog data (same as in Blogs.jsx)
  const blogs = [
    {
      id: 1,
      title: 'How VR Therapy is Revolutionizing Mental Health Treatment',
      excerpt: 'Virtual reality is transforming the way we approach anxiety, PTSD, and depression treatment with immersive therapeutic experiences.',
      category: 'research',
      source: 'Psychology Today',
      date: '2025-01-15',
      image: 'https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=800',
      readTime: '8 min read',
      author: 'Dr. Sarah Chen',
      content: `
        <h2>The Rise of VR in Mental Health</h2>
        <p>Virtual Reality (VR) technology has emerged as a groundbreaking tool in mental health treatment, offering immersive therapeutic experiences that were once unimaginable. Recent studies show that VR therapy can be as effective as traditional therapy for treating various mental health conditions.</p>
        
        <h2>Key Benefits of VR Therapy</h2>
        <ul>
          <li><strong>Immersive Exposure Therapy:</strong> Patients can safely confront their fears in controlled virtual environments.</li>
          <li><strong>Accessibility:</strong> VR therapy can be conducted from home, making mental health care more accessible.</li>
          <li><strong>Engagement:</strong> The immersive nature of VR keeps patients more engaged in their treatment.</li>
          <li><strong>Measurable Progress:</strong> VR systems can track patient responses and progress in real-time.</li>
        </ul>
        
        <h2>Clinical Applications</h2>
        <p>VR therapy has shown remarkable success in treating:</p>
        <ul>
          <li>Post-Traumatic Stress Disorder (PTSD)</li>
          <li>Anxiety Disorders</li>
          <li>Phobias</li>
          <li>Depression</li>
          <li>Chronic Pain Management</li>
        </ul>
        
        <h2>The Future of VR Therapy</h2>
        <p>As technology advances, VR therapy is becoming more sophisticated and accessible. With improvements in headset technology, haptic feedback, and AI-powered personalization, the future of mental health treatment looks increasingly immersive and effective.</p>
        
        <p>Healthcare providers worldwide are integrating VR therapy into their practices, and insurance companies are beginning to recognize its value. This growing acceptance signals a new era in mental health care where technology and therapy converge to provide better outcomes for patients.</p>
      `
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
      author: 'Alex Johnson',
      content: `
        <h2>Meta Quest 3: A Game Changer for Therapy</h2>
        <p>The Meta Quest 3 has revolutionized the accessibility of VR therapy. With its advanced features and affordable price point, it's becoming the go-to device for mental health professionals worldwide.</p>
        
        <h2>Key Features for Therapeutic Use</h2>
        <ul>
          <li><strong>High Resolution Display:</strong> Crystal clear visuals enhance immersion and reduce eye strain.</li>
          <li><strong>Standalone Operation:</strong> No PC required, making it perfect for therapy sessions.</li>
          <li><strong>Mixed Reality Capabilities:</strong> Blend real and virtual environments for gradual exposure therapy.</li>
          <li><strong>Comfortable Design:</strong> Extended wear comfort for longer therapy sessions.</li>
        </ul>
        
        <h2>Clinical Success Stories</h2>
        <p>Therapists using the Meta Quest 3 report significant improvements in patient outcomes, particularly in treating anxiety disorders and phobias. The device's ease of use allows patients to continue therapy at home between sessions.</p>
        
        <h2>Getting Started</h2>
        <p>For healthcare providers interested in incorporating Meta Quest 3 into their practice, numerous therapeutic applications are available, ranging from guided meditation to exposure therapy environments.</p>
      `
    },
    // Add more blog content as needed
  ];

  const blog = blogs.find(b => b.id === parseInt(id));

  if (!blog) {
    return (
      <GridBackground className="min-h-screen">
        <Navbar />
        <div className="pt-32 pb-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-white mb-6">Blog Not Found</h1>
            <button onClick={() => navigate('/blogs')} className="btn-primary">
              Back to Blogs
            </button>
          </div>
        </div>
        <Footer />
      </GridBackground>
    );
  }

  return (
    <GridBackground className="min-h-screen">
      <Navbar transparent={true} />

      <div className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button 
            onClick={() => navigate('/blogs')}
            className="mb-8 flex items-center space-x-2 text-gray-400 hover:text-aura-green transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Blogs</span>
          </button>

          {/* Featured Image */}
          <Card className="mb-8 overflow-hidden">
            <img 
              src={blog.image}
              alt={blog.title}
              className="w-full h-96 object-cover"
            />
          </Card>

          {/* Article Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4 text-gray-400 text-sm">
              <span className="text-aura-purple font-semibold">{blog.source}</span>
              <span>•</span>
              <span>{blog.date}</span>
              <span>•</span>
              <span>{blog.readTime}</span>
            </div>

            <h1 className="text-5xl font-bold text-white mb-4">{blog.title}</h1>
            
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-aura-purple to-aura-pink rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">{blog.author.split(' ').map(n => n[0]).join('')}</span>
              </div>
              <div>
                <p className="text-white font-semibold">{blog.author}</p>
                <p className="text-gray-400 text-sm">Contributing Writer</p>
              </div>
            </div>

            <div className="inline-block bg-aura-purple/20 text-aura-purple px-4 py-2 rounded-full text-sm font-semibold mb-6">
              {blog.category.toUpperCase()}
            </div>
          </div>

          {/* Article Content */}
          <Card className="p-8 md:p-12">
            <div 
              className="prose prose-invert prose-lg max-w-none
                prose-headings:text-white prose-headings:font-bold prose-headings:mb-4 prose-headings:mt-8
                prose-h2:text-3xl prose-h3:text-2xl
                prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6
                prose-ul:text-gray-300 prose-ul:mb-6
                prose-li:mb-2
                prose-strong:text-aura-green
                first:prose-p:text-xl first:prose-p:text-gray-200"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </Card>

          {/* Share Section */}
          <Card className="mt-8 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Share this article</h3>
                <p className="text-gray-400">Help others discover VR therapy insights</p>
              </div>
              <div className="flex space-x-4">
                <button className="w-10 h-10 bg-aura-purple rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </button>
                <button className="w-10 h-10 bg-aura-blue rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                  </svg>
                </button>
                <button className="w-10 h-10 bg-aura-pink rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </button>
              </div>
            </div>
          </Card>

          {/* Related Articles */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-white mb-6">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blogs.filter(b => b.id !== blog.id && b.category === blog.category).slice(0, 2).map((relatedBlog) => (
                <Card 
                  key={relatedBlog.id} 
                  hover={true} 
                  className="cursor-pointer"
                  onClick={() => navigate(`/blogs/${relatedBlog.id}`)}
                >
                  <img 
                    src={relatedBlog.image}
                    alt={relatedBlog.title}
                    className="w-full h-48 object-cover rounded-t-xl"
                  />
                  <div className="p-4">
                    <h4 className="text-lg font-bold text-white mb-2 line-clamp-2">{relatedBlog.title}</h4>
                    <p className="text-gray-400 text-sm">{relatedBlog.readTime}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </GridBackground>
  );
};

export default BlogDetail;
