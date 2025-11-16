import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import GridBackground from '../components/GridBackground';

const StressAssessment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [stressLevel, setStressLevel] = useState(null);
  const [isRetake, setIsRetake] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setIsRetake(params.get('retake') === 'true');
    
    const isFirstTime = !localStorage.getItem('stressAssessment');
    
    if (isFirstTime || params.get('retake') === 'true') {
      enterFullscreen();
    }
  }, [location]);

  const enterFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().then(() => setIsFullscreen(true)).catch(err => {
        console.log('Fullscreen request failed:', err);
      });
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
      setIsFullscreen(true);
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
      setIsFullscreen(true);
    }
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
      setIsFullscreen(false);
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  const baseQuestions = [
    {
      id: 1,
      text: "How often have you been upset because of something that happened unexpectedly?",
      reverse: false
    },
    {
      id: 2,
      text: "How often have you felt that you were unable to control the important things in your life?",
      reverse: false
    },
    {
      id: 3,
      text: "How often have you felt nervous and \"stressed\"?",
      reverse: false
    },
    {
      id: 4,
      text: "How often have you felt confident about your ability to handle your personal problems?",
      reverse: true
    },
    {
      id: 5,
      text: "How often have you felt that things were going your way?",
      reverse: true
    },
    {
      id: 6,
      text: "How often have you found that you could not cope with all the things you had to do?",
      reverse: false
    },
    {
      id: 7,
      text: "How often have you been able to control irritations in your life?",
      reverse: true
    },
    {
      id: 8,
      text: "How often have you felt that you were on top of things?",
      reverse: true
    },
    {
      id: 9,
      text: "How often have you been angered because of things that were outside of your control?",
      reverse: false
    },
    {
      id: 10,
      text: "How often have you felt difficulties were piling up so high that you could not overcome them?",
      reverse: false
    }
  ];

  const shuffledQuestions = useMemo(() => {
    const shuffled = [...baseQuestions];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  const options = [
    { 
      value: 0, 
      label: 'Never',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      value: 1, 
      label: 'Almost Never',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      value: 2, 
      label: 'Sometimes',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      value: 3, 
      label: 'Fairly Often',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    { 
      value: 4, 
      label: 'Very Often',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  const handleExit = () => {
    const isFirstTime = !localStorage.getItem('stressAssessment');
    
    if (isFirstTime) {
      alert('Please complete the stress assessment before continuing. This helps us personalize your therapy experience.');
      return;
    }
    
    if (window.confirm('Are you sure you want to exit the assessment? Your progress will be lost.')) {
      exitFullscreen();
      navigate('/dashboard');
    }
  };

  const handleAnswer = (value) => {
    const newAnswers = { ...answers, [currentQuestion]: value };
    setAnswers(newAnswers);

    if (currentQuestion < shuffledQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
      }, 300);
    } else {
      calculateResults(newAnswers);
    }
  };

  const calculateResults = (finalAnswers) => {
    let totalScore = 0;

    shuffledQuestions.forEach((question, index) => {
      const answer = finalAnswers[index];
      if (question.reverse) {
        totalScore += (4 - answer);
      } else {
        totalScore += answer;
      }
    });

    let level, color, description, recommendations, stressPercentage, recommendedVideos;

    if (totalScore <= 13) {
      level = 'Low';
      color = 'from-green-500 to-emerald-600';
      stressPercentage = 25;
      description = 'Your stress levels are well-managed. You\'re handling life\'s challenges effectively and maintaining good mental balance.';
      recommendations = [
        'Continue your current wellness practices',
        'Maintain regular exercise and sleep routines',
        'Practice daily gratitude and mindfulness',
        'Keep engaging in activities you enjoy'
      ];
      recommendedVideos = [
        { id: 'morning-meditation', title: 'Morning Meditation', duration: '8 min', thumbnail: '🌅', description: 'Start your day with mindful awareness' },
        { id: 'focus-boost', title: 'Focus Enhancement', duration: '10 min', thumbnail: '🎯', description: 'Improve concentration and clarity' },
        { id: 'gratitude-practice', title: 'Gratitude Practice', duration: '7 min', thumbnail: '🙏', description: 'Cultivate thankfulness and positivity' }
      ];
    } else if (totalScore <= 26) {
      level = 'Moderate';
      color = 'from-yellow-500 to-orange-600';
      stressPercentage = 55;
      description = 'You\'re experiencing moderate stress levels. Some areas of your life may feel challenging, and it\'s important to focus on stress management.';
      recommendations = [
        'Regular VR therapy sessions recommended (3-4 times per week)',
        'Focus on stress management techniques',
        'Consider talking to a mental health professional',
        'Prioritize self-care and relaxation activities',
        'Practice deep breathing exercises daily',
        'Ensure adequate sleep (7-9 hours)'
      ];
      recommendedVideos = [
        { id: 'stress-relief', title: 'Deep Stress Relief', duration: '12 min', thumbnail: '🌊', description: 'Immersive ocean environment for relaxation' },
        { id: 'breathing-exercises', title: 'Breathing Techniques', duration: '9 min', thumbnail: '💨', description: 'Master calming breath patterns' },
        { id: 'anxiety-relief', title: 'Anxiety Relief', duration: '10 min', thumbnail: '🌿', description: 'Gentle anxiety reduction session' }
      ];
    } else {
      level = 'High';
      color = 'from-red-500 to-pink-600';
      stressPercentage = 85;
      description = 'You\'re experiencing high levels of perceived stress. This is significant and requires immediate attention. Please prioritize your mental health and consider seeking professional support.';
      recommendations = [
        'Immediate stress management intervention recommended',
        'Daily VR therapy sessions highly beneficial',
        'Strongly consider professional counseling or therapy',
        'Implement stress-reduction activities throughout the day',
        'Reach out to your support network (family, friends)',
        'Practice relaxation techniques multiple times daily',
        'Consider a temporary reduction in stressors if possible',
        'Monitor physical symptoms and consult a doctor if needed'
      ];
      recommendedVideos = [
        { id: 'stress-relief', title: 'Deep Stress Relief', duration: '12 min', thumbnail: '🌊', description: 'Intensive relaxation therapy' },
        { id: 'panic-relief', title: 'Panic Attack Relief', duration: '8 min', thumbnail: '🛡️', description: 'Emergency calming protocol' },
        { id: 'sleep-therapy', title: 'Deep Sleep Therapy', duration: '20 min', thumbnail: '🌙', description: 'Restorative sleep induction' }
      ];
    }

    const result = {
      score: totalScore,
      level,
      color,
      description,
      recommendations,
      stressPercentage,
      maxScore: 40,
      category: level === 'Low' ? '0-13' : level === 'Moderate' ? '14-26' : '27-40',
      recommendedVideos
    };

    setStressLevel(result);
    
    localStorage.setItem('stressAssessment', JSON.stringify({
      ...result,
      date: new Date().toISOString()
    }));

    setTimeout(() => {
      setShowResults(true);
    }, 800);
  };

  const handleComplete = () => {
    exitFullscreen();
    navigate('/dashboard');
  };

  const progress = ((currentQuestion + 1) / shuffledQuestions.length) * 100;

  if (showResults && stressLevel) {
    return (
      <GridBackground className="min-h-screen overflow-y-auto">
        <div className="min-h-screen flex items-center justify-center px-4 py-8">
          <div className="max-w-6xl w-full">
            <div className="glass rounded-3xl p-6 md:p-10 results-fade-in">
              <div className="flex justify-end mb-4">
                <button
                  onClick={handleComplete}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="text-center mb-8 scale-in">
                <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br ${stressLevel.color} mb-6 pulse-animation`}>
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-3">Assessment Complete</h2>
                <p className="text-gray-400 text-lg">Your personalized mental health insights</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="glass p-6 rounded-2xl slide-up" style={{ animationDelay: '0.1s' }}>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-gray-400 font-medium">Your Stress Score</span>
                    <span className="text-4xl font-bold gradient-text score-pop">{stressLevel.score}</span>
                  </div>
                  <div className="text-gray-500 text-sm mb-3">Out of {stressLevel.maxScore} points (Range: {stressLevel.category})</div>
                  <div className="h-3 bg-black/40 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${stressLevel.color} transition-all duration-2000 bar-fill`}
                      style={{ width: `${(stressLevel.score / 40) * 100}%` }}
                    />
                  </div>
                </div>

                <div className={`p-6 rounded-2xl bg-gradient-to-br ${stressLevel.color} slide-up`} style={{ animationDelay: '0.2s' }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white/90 font-medium">Stress Level</span>
                    <div className="px-4 py-1 rounded-full bg-white/20 text-white font-bold text-sm">
                      {stressLevel.level}
                    </div>
                  </div>
                  <p className="text-white text-lg font-semibold">{stressLevel.description}</p>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                <div className="slide-up" style={{ animationDelay: '0.3s' }}>
                  <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                    <svg className="w-6 h-6 mr-2 text-aura-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                    Personalized Recommendations
                  </h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                    {stressLevel.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start space-x-3 glass p-4 rounded-xl hover:bg-white/10 transition-colors rec-slide" style={{ animationDelay: `${0.4 + index * 0.1}s` }}>
                        <svg className="w-5 h-5 text-aura-green flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-300 text-sm">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="slide-up" style={{ animationDelay: '0.4s' }}>
                  <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                    <svg className="w-6 h-6 mr-2 text-aura-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Recommended VR Sessions
                  </h3>
                  <div className="space-y-4">
                    {stressLevel.recommendedVideos.map((video, index) => (
                      <button
                        key={video.id}
                        onClick={() => navigate(`/therapy/${video.id}`)}
                        className="w-full glass p-4 rounded-xl hover:bg-white/10 transition-all hover:scale-105 transform text-left group rec-slide"
                        style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="text-4xl">{video.thumbnail}</div>
                          <div className="flex-1">
                            <h4 className="text-white font-semibold mb-1 group-hover:text-aura-green transition-colors">{video.title}</h4>
                            <p className="text-gray-400 text-xs mb-2">{video.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-aura-green text-sm font-medium">{video.duration}</span>
                              <svg className="w-5 h-5 text-aura-green opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-8 slide-up" style={{ animationDelay: '0.8s' }}>
                <button
                  onClick={handleComplete}
                  className="btn-primary flex-1"
                >
                  Continue to Dashboard
                </button>
                <button
                  onClick={() => navigate('/therapy')}
                  className="btn-secondary flex-1"
                >
                  Explore All Therapy Sessions
                </button>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes results-fade-in {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes scale-in {
            from { opacity: 0; transform: scale(0.8); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes slide-up {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          @keyframes score-pop {
            0% { transform: scale(0); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
          }
          @keyframes bar-fill {
            from { width: 0%; }
          }
          @keyframes rec-slide {
            from { opacity: 0; transform: translateX(-20px); }
            to { opacity: 1; transform: translateX(0); }
          }
          .results-fade-in { animation: results-fade-in 0.6s ease-out; }
          .scale-in { animation: scale-in 0.8s ease-out; }
          .slide-up { animation: slide-up 0.6s ease-out both; }
          .pulse-animation { animation: pulse 2s ease-in-out infinite; }
          .score-pop { animation: score-pop 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
          .bar-fill { animation: bar-fill 2s ease-out; }
          .rec-slide { animation: rec-slide 0.5s ease-out both; }
          .custom-scrollbar::-webkit-scrollbar { width: 6px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: rgba(191, 255, 0, 0.05); border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(191, 255, 0, 0.3); border-radius: 10px; }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(191, 255, 0, 0.5); }
        `}</style>
      </GridBackground>
    );
  }

  return (
    <GridBackground className="h-screen flex items-center justify-center px-4 py-6 overflow-hidden">
      <div className="max-w-4xl w-full">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Stress Assessment <span className="gradient-text">(PSS-10)</span>
            </h1>
            <span className="text-gray-400 text-sm bg-white/5 px-3 py-1 rounded-full">
              {currentQuestion + 1} / {shuffledQuestions.length}
            </span>
            {isFullscreen && (
              <span className="text-green-400 text-xs bg-green-500/20 px-2 py-1 rounded-full flex items-center space-x-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
                <span>Fullscreen</span>
              </span>
            )}
          </div>
          <button
            onClick={handleExit}
            className="text-gray-400 hover:text-red-400 transition-colors p-2 hover:bg-white/5 rounded-lg"
            title="Exit Assessment"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="h-2 bg-black/30 rounded-full overflow-hidden mb-4">
          <div 
            className="h-full bg-gradient-to-r from-aura-purple via-aura-pink to-aura-green transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <p className="text-gray-400 text-sm mb-6 text-center">
          In the last month, how often have you felt or thought the following?
        </p>

        <div className="glass rounded-2xl p-6 md:p-8 animate-slide-up">
          <div className="mb-6">
            <div className="inline-block px-3 py-1 bg-aura-purple/20 rounded-full text-aura-purple text-xs font-semibold mb-4">
              Question {currentQuestion + 1}
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white leading-relaxed">
              {shuffledQuestions[currentQuestion].text}
            </h2>
          </div>

          <div className="space-y-2.5">
            {options.map((option, index) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value)}
                className={`w-full p-3.5 md:p-4 rounded-xl border-2 transition-all duration-300 text-left
                  ${answers[currentQuestion] === option.value 
                    ? 'border-aura-green bg-aura-green/10 shadow-lg shadow-aura-green/20' 
                    : 'border-white/10 hover:border-aura-green/50 glass'
                  }
                  transform hover:scale-[1.02] active:scale-[0.98]
                `}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all
                      ${answers[currentQuestion] === option.value 
                        ? 'bg-aura-green text-black scale-110' 
                        : 'bg-white/10 text-white'
                      }
                    `}>
                      {option.icon}
                    </div>
                    <div>
                      <span className="text-base md:text-lg text-white font-medium">{option.label}</span>
                      <div className="text-xs text-gray-500 mt-0.5">Score: {option.value}</div>
                    </div>
                  </div>
                  {answers[currentQuestion] === option.value && (
                    <svg className="w-6 h-6 text-aura-green animate-check" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
            <button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                currentQuestion === 0 
                  ? 'text-gray-600 cursor-not-allowed' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-sm font-medium">Previous</span>
            </button>
            
            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">Assessment Progress</div>
              <div className="flex items-center space-x-1">
                {shuffledQuestions.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index < currentQuestion ? 'w-3 bg-aura-green' :
                      index === currentQuestion ? 'w-6 bg-aura-purple' :
                      'w-2 bg-white/20'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="text-sm text-gray-400 font-medium">
              {answers[currentQuestion] !== undefined ? 'Answered' : 'Select option'}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes check {
          from { opacity: 0; transform: scale(0); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-slide-up { animation: slide-up 0.4s ease-out; }
        .animate-check { animation: check 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
      `}</style>
    </GridBackground>
  );
};

export default StressAssessment;
