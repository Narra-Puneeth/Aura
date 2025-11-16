import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';

const Onboarding = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [step, setStep] = useState(0); // Start with intro slides (0, 1), then goals (2)
  const [isAnimating, setIsAnimating] = useState(true);
  const [selectedGoals, setSelectedGoals] = useState([]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/signup', { replace: true });
    }
  }, [loading, user, navigate]);

  // Trigger animation on step change
  useEffect(() => {
    console.log('🎯 Step changed to:', step);
    setIsAnimating(false);
    const timer = setTimeout(() => {
      setIsAnimating(true);
      console.log('✨ Animation triggered for step:', step);
    }, 50);
    return () => clearTimeout(timer);
  }, [step]);

  if (loading) {
    return (
      <div className="min-h-screen bg-aura-dark py-12 px-6 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-aura-green mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const goals = [
    { 
      id: 'stress', 
      label: 'Reduce Stress', 
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    { 
      id: 'anxiety', 
      label: 'Manage Anxiety', 
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      )
    },
    { 
      id: 'sleep', 
      label: 'Better Sleep', 
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      )
    },
    { 
      id: 'focus', 
      label: 'Improve Focus', 
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )
    },
    { 
      id: 'mindfulness', 
      label: 'Practice Mindfulness', 
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    { 
      id: 'relaxation', 
      label: 'Deep Relaxation', 
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  const completeOnboarding = () => {
    // Save goals to localStorage
    localStorage.setItem('Aura_onboarding_goals', JSON.stringify(selectedGoals));
    // Navigate to stress assessment (first time users must complete this)
    navigate('/stress-assessment');
  };

  console.log('🔄 Rendering Onboarding - Step:', step, 'Loading:', loading, 'User:', !!user, 'IsAnimating:', isAnimating);

  return (
    <div className="min-h-screen bg-aura-dark py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Progress Dots - Show for intro slides */}
        {step < 2 && (
          <div className="flex justify-center gap-2 mb-8">
            {[0, 1, 2].map((dotStep) => (
              <div
                key={dotStep}
                className={`h-2 rounded-full transition-all ${
                  step === dotStep ? 'w-8 bg-aura-green' : 'w-2 bg-white/20'
                }`}
              />
            ))}
          </div>
        )}

        {/* Intro Slide 1: Welcome */}
        {step === 0 && (
          <div key="step-0" className={`flex flex-col items-center justify-center min-h-[70vh] transition-all duration-500 ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="text-center space-y-6 max-w-2xl">
              <div className="mb-8 flex justify-center">
                <svg className="w-24 h-24 text-aura-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-6xl font-bold text-white mb-4">
                Welcome to <span className="gradient-text">Aura</span>
              </h1>
              <p className="text-2xl text-gray-300 leading-relaxed">
                Your Personal VR Mental Wellness Platform
              </p>
              <p className="text-lg text-gray-400 leading-relaxed mt-6">
                Experience evidence-based therapy in immersive virtual reality environments designed by mental health professionals
              </p>
            </div>
            <div className="mt-12 flex gap-4">
              <Button onClick={() => setStep(1)} variant="primary" className="px-8 py-4 text-lg">
                Get Started
              </Button>
            </div>
          </div>
        )}

        {/* Intro Slide 2: How It Works */}
        {step === 1 && (
          <div key="step-1" className={`flex flex-col items-center justify-center min-h-[70vh] transition-all duration-500 ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="text-center space-y-8 max-w-3xl">
              <div className="mb-8 flex justify-center">
                <svg className="w-24 h-24 text-aura-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <h2 className="text-5xl font-bold text-white mb-6">
                How <span className="gradient-text">Aura</span> Works
              </h2>
              
              <div className="grid md:grid-cols-3 gap-6 mt-12">
                <Card className="p-6 glass">
                  <div className="flex justify-center mb-4 text-aura-green">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">1. Assessment</h3>
                  <p className="text-gray-400">
                    Complete a comprehensive stress assessment to establish your baseline
                  </p>
                </Card>
                
                <Card className="p-6 glass">
                  <div className="flex justify-center mb-4 text-aura-pink">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">2. Immersion</h3>
                  <p className="text-gray-400">
                    Enter personalized VR environments tailored to your therapeutic needs
                  </p>
                </Card>
                
                <Card className="p-6 glass">
                  <div className="flex justify-center mb-4 text-aura-blue">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">3. Progress</h3>
                  <p className="text-gray-400">
                    Track your mental wellness journey with detailed analytics
                  </p>
                </Card>
              </div>
            </div>
            
            <div className="mt-12 flex gap-4">
              <Button onClick={() => setStep(0)} variant="secondary" className="px-6 py-3">
                Back
              </Button>
              <Button onClick={() => setStep(2)} variant="primary" className="px-8 py-3 text-lg">
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Goals Selection */}
        {step === 2 && (
          <div key="step-2" className={`space-y-8 transition-all duration-500 ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="text-center mb-12">
              <h1 className="text-5xl font-bold text-white mb-4">
                Set Your <span className="gradient-text">Wellness Goals</span>
              </h1>
              <p className="text-xl text-gray-400">
                Select the goals you'd like to focus on
              </p>
            </div>

            <Card className="p-8">
              <h2 className="text-2xl font-bold text-white mb-4">What are your wellness goals?</h2>
              <p className="text-gray-400 mb-8">Select all that apply</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {goals.map((goal) => (
                  <button
                    key={goal.id}
                    onClick={() => setSelectedGoals(prev =>
                      prev.includes(goal.id)
                        ? prev.filter(g => g !== goal.id)
                        : [...prev, goal.id]
                    )}
                    className={`p-6 rounded-2xl border-2 transition-all ${
                      selectedGoals.includes(goal.id)
                        ? 'border-aura-green bg-aura-green/20'
                        : 'border-white/20 glass hover:border-white/40'
                    }`}
                  >
                    <div className="flex justify-center mb-3 text-aura-green">
                      {goal.icon}
                    </div>
                    <div className="text-white font-semibold">{goal.label}</div>
                  </button>
                ))}
              </div>
            </Card>

            <div className="flex justify-between">
              <Button onClick={() => setStep(1)} variant="secondary">
                Back
              </Button>
              <Button 
                onClick={completeOnboarding} 
                variant="primary"
                disabled={selectedGoals.length === 0}
              >
                Continue to Assessment
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
