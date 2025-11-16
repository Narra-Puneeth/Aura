import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Card from '../components/Card';

const About = () => {
  const features = [
    {
      icon: '🎭',
      title: 'Immersive VR Experiences',
      description: 'Step into therapeutic environments crafted with cutting-edge VR technology for maximum immersion and effectiveness.'
    },
    {
      icon: '🧠',
      title: 'Science-Backed Methods',
      description: 'Every session is designed using evidence-based therapeutic techniques validated by mental health research.'
    },
    {
      icon: '🎯',
      title: 'Personalized Journey',
      description: 'AI-powered recommendations adapt to your unique needs and progress, ensuring optimal therapeutic outcomes.'
    },
    {
      icon: '📊',
      title: 'Progress Tracking',
      description: 'Comprehensive analytics help you visualize your mental wellness journey and celebrate your achievements.'
    },
    {
      icon: '🌍',
      title: 'Accessible Anywhere',
      description: 'Practice from home, office, or anywhere with support for all major VR headsets and browsers.'
    },
    {
      icon: '🔒',
      title: 'Privacy First',
      description: 'Your mental health data is encrypted and private. We never share your information without consent.'
    },
  ];

  const benefits = [
    { metric: '85%', label: 'Reduction in stress levels' },
    { metric: '90%', label: 'User satisfaction rate' },
    { metric: '75%', label: 'Improved sleep quality' },
    { metric: '50K+', label: 'Lives transformed' },
  ];

  const testimonials = [
    {
      name: 'Sarah M.',
      role: 'Marketing Executive',
      rating: 5,
      text: 'Aura has completely transformed how I manage stress. The VR sessions are incredibly immersive and effective.',
      avatar: '👩‍💼'
    },
    {
      name: 'David K.',
      role: 'Software Engineer',
      rating: 5,
      text: 'As someone with anxiety, Aura has been a game-changer. The guided sessions help me find calm in minutes.',
      avatar: '👨‍💻'
    },
    {
      name: 'Emily R.',
      role: 'Teacher',
      rating: 5,
      text: 'The sleep stories have improved my sleep quality dramatically. I actually look forward to bedtime now!',
      avatar: '👩‍🏫'
    },
  ];

  return (
    <div className="min-h-screen bg-aura-dark">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            About <span className="gradient-text">Aura</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12">
            We're on a mission to make mental wellness accessible, engaging, and effective through the power of immersive VR technology.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="btn-primary">Start Your Journey</button>
            <button className="btn-secondary">Learn More</button>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-20 bg-aura-gray">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl md:text-6xl font-bold gradient-text mb-2">
                  {benefit.metric}
                </div>
                <p className="text-gray-400">{benefit.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-aura-dark">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why Choose Aura?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Advanced technology meets compassionate care
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} hover={true} className="p-8">
                <div className="text-6xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-b from-aura-dark to-aura-gray">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Loved by Thousands
            </h2>
            <p className="text-xl text-gray-400">
              See what our community has to say
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-8">
                <div className="flex items-center space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center space-x-3">
                  <div className="text-4xl">{testimonial.avatar}</div>
                  <div>
                    <div className="text-white font-semibold">{testimonial.name}</div>
                    <div className="text-gray-500 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-aura-gray">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Team Mathians
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              INNOVASIA Hackathon Project - Combining AI and Full Stack Development
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <Card className="p-8 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-aura-purple to-aura-pink rounded-full mx-auto mb-4 flex items-center justify-center text-5xl">
                🤖
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Shritij</h3>
              <p className="text-aura-blue font-semibold">AI Developer</p>
            </Card>
            <Card className="p-8 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-aura-teal to-aura-blue rounded-full mx-auto mb-4 flex items-center justify-center text-5xl">
                💻
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Puneeth</h3>
              <p className="text-aura-green font-semibold">Full Stack Developer</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-aura-purple via-aura-pink to-aura-blue">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Mental Wellness?
          </h2>
          <p className="text-xl text-white/90 mb-10">
            Join thousands who have already discovered the power of VR therapy
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <button className="bg-white text-aura-purple font-semibold px-10 py-4 rounded-full hover:scale-105 transition-all duration-300">
              Start Free Trial
            </button>
            <button className="btn-secondary text-lg px-10 py-4">
              View Pricing
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
