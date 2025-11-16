import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Card from '../components/Card';
import Button from '../components/Button';
import GridBackground from '../components/GridBackground';

const Support = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const faqs = [
    {
      question: 'What VR headsets are compatible with Aura?',
      answer: 'Aura works with all major VR headsets including Meta Quest, PlayStation VR, HTC Vive, Valve Index, and PICO. You can also use it on desktop browsers for 360° experiences without a headset.'
    },
    {
      question: 'Do I need a VR headset to use Aura?',
      answer: 'No! While VR headsets provide the most immersive experience, Aura works perfectly in your web browser. You can enjoy 360° videos using mouse/touch controls on desktop or mobile devices.'
    },
    {
      question: 'How long are the therapy sessions?',
      answer: 'Our sessions range from 5 to 30 minutes, designed to fit into your schedule. Most sessions are 10-15 minutes, perfect for daily practice. You can pause and resume sessions anytime.'
    },
    {
      question: 'Is my data private and secure?',
      answer: 'Absolutely. We use bank-level encryption to protect your data. Your therapy sessions, health metrics, and personal information are never shared with third parties without your explicit consent.'
    },
    {
      question: 'Can Aura replace traditional therapy?',
      answer: 'Aura is designed as a complementary tool to support your mental wellness journey. While highly effective for stress management and relaxation, it should not replace professional medical treatment for serious mental health conditions.'
    },
    {
      question: 'How often should I use Aura?',
      answer: 'We recommend daily 10-15 minute sessions for best results. Consistency is key to building lasting mental wellness habits. You can increase frequency based on your personal needs and schedule.'
    },
    {
      question: 'What if I feel uncomfortable during a session?',
      answer: 'You can exit any session at any time by pressing the back button or removing your headset. All sessions are designed to be calming and safe. If you experience persistent discomfort, please consult a healthcare professional.'
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes! We offer a 14-day free trial with full access to all sessions and features. No credit card required to start. Cancel anytime if it\'s not right for you.'
    },
  ];

  const resources = [
    {
      title: 'Getting Started Guide',
      description: 'Learn how to set up and use Aura effectively',
      icon: (
        <svg className="w-8 h-8 text-aura-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      link: '#'
    },
    {
      title: 'VR Setup Tutorial',
      description: 'Step-by-step guide for connecting your VR headset',
      icon: (
        <svg className="w-8 h-8 text-aura-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      link: '#'
    },
    {
      title: 'Breathing Techniques',
      description: 'Master fundamental breathing exercises',
      icon: (
        <svg className="w-8 h-8 text-aura-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      link: '#'
    },
    {
      title: 'Mental Wellness Blog',
      description: 'Articles and tips from our expert team',
      icon: (
        <svg className="w-8 h-8 text-aura-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      ),
      link: '#'
    },
  ];

  const handleFaqToggle = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    alert('Thank you for reaching out! We\'ll get back to you within 24 hours.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <GridBackground className="min-h-screen">
      <Navbar transparent={true} />

      <div className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              How Can We <span className="gradient-text">Help?</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-4">
              Find answers to common questions or reach out to our support team
            </p>
            <p className="text-lg text-aura-blue font-semibold">
              INNOVASIA Hackathon - Team Mathians
            </p>
            <div className="flex items-center justify-center gap-6 mt-4 text-gray-400">
              <div className="flex items-center gap-2">
                <span>🤖</span>
                <span>Shritij - AI Dev</span>
              </div>
              <div className="flex items-center gap-2">
                <span>💻</span>
                <span>Puneeth - Full Stack</span>
              </div>
            </div>
          </div>

          {/* Quick Help Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
            <Card hover={true} className="p-8 text-center cursor-pointer">
              <div className="mb-4">
                <svg className="w-16 h-16 mx-auto text-aura-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Live Chat</h3>
              <p className="text-gray-400 text-sm mb-4">Get instant help from our support team</p>
              <span className="text-aura-green font-semibold">Start Chat →</span>
            </Card>

            <Card hover={true} className="p-8 text-center cursor-pointer">
              <div className="mb-4">
                <svg className="w-16 h-16 mx-auto text-aura-pink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Email Support</h3>
              <p className="text-gray-400 text-sm mb-4">We'll respond within 24 hours</p>
              <span className="text-aura-green font-semibold">Send Email →</span>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* FAQ Section */}
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-white mb-8">Frequently Asked Questions</h2>
              
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <Card key={index} className="overflow-hidden">
                    <button
                      onClick={() => handleFaqToggle(index)}
                      className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors"
                    >
                      <span className="text-white font-semibold pr-4">{faq.question}</span>
                      <svg
                        className={`w-6 h-6 text-aura-green flex-shrink-0 transition-transform ${
                          openFaq === index ? 'transform rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {openFaq === index && (
                      <div className="px-6 pb-6 text-gray-400 animate-fade-in-up">
                        {faq.answer}
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Resources */}
              <div>
                <h3 className="text-2xl font-bold text-white mb-6">Resources</h3>
                <div className="space-y-4">
                  {resources.map((resource, index) => (
                    <Card key={index} hover={true} className="p-4 cursor-pointer">
                      <div className="flex items-center space-x-3">
                        <div>{resource.icon}</div>
                        <div className="flex-1">
                          <h4 className="text-white font-semibold text-sm">{resource.title}</h4>
                          <p className="text-gray-500 text-xs">{resource.description}</p>
                        </div>
                        <svg className="w-5 h-5 text-aura-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Community */}
              <Card className="p-6 bg-gradient-to-br from-aura-purple/20 to-aura-pink/20">
                <h3 className="text-xl font-bold text-white mb-4">Join Our Community</h3>
                <p className="text-gray-400 text-sm mb-6">
                  Connect with other Aura users, share experiences, and get support
                </p>
                <Button variant="primary" className="w-full">
                  Join Discord
                </Button>
              </Card>

              {/* Status */}
              <Card className="p-6">
                <h3 className="text-xl font-bold text-white mb-4">System Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Platform</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-aura-green rounded-full"></div>
                      <span className="text-aura-green text-sm">Operational</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">VR Services</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-aura-green rounded-full"></div>
                      <span className="text-aura-green text-sm">Operational</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">API</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-aura-green rounded-full"></div>
                      <span className="text-aura-green text-sm">Operational</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Contact Form */}
          <div className="mt-20">
            <Card className="p-8 md:p-12 max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-3">Still Need Help?</h2>
                <p className="text-gray-400">Send us a message and we'll get back to you as soon as possible</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white mb-2 font-medium">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-aura-green transition-colors"
                      placeholder="Your name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-2 font-medium">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-aura-green transition-colors"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white mb-2 font-medium">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleFormChange}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-aura-green transition-colors"
                    placeholder="What do you need help with?"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white mb-2 font-medium">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleFormChange}
                    rows="6"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-aura-green transition-colors resize-none"
                    placeholder="Please describe your issue or question in detail..."
                    required
                  ></textarea>
                </div>

                <Button type="submit" variant="primary" className="w-full md:w-auto px-12">
                  Send Message
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </GridBackground>
  );
};

export default Support;
