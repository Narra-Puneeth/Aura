import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (!formData.agreeToTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }

    setLoading(true);
    try {
      await signUp(formData.email, formData.password, formData.name);
      console.log('✅ Signup successful, navigating...');
      navigate('/onboarding', { replace: true });
    } catch (error) {
      console.error('Signup error:', error);
      setError(getErrorMessage(error.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError('');
    setLoading(true);
    
    try {
      await signInWithGoogle();
      console.log('✅ Google sign-in successful, navigating...');
      // Navigate immediately after successful sign-in
      navigate('/onboarding', { replace: true });
    } catch (error) {
      console.error('Google sign-up error:', error);
      setError(getErrorMessage(error.code));
      setLoading(false);
    }
  };

  const getErrorMessage = (errorCode) => {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        return 'An account with this email already exists. Please try logging in.';
      case 'auth/invalid-email':
        return 'Invalid email address format.';
      case 'auth/weak-password':
        return 'Password is too weak. Please choose a stronger password.';
      case 'auth/popup-closed-by-user':
        return 'Sign-up cancelled. Please try again.';
      default:
        return 'Sign-up failed. Please try again.';
    }
  };

  return (
    <div className="min-h-screen bg-aura-dark flex items-center justify-center px-6 py-8">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-12 items-center">
        {/* Left Side - Branding */}
        <div className="hidden md:block">
          <div className="relative">
            <div className="absolute inset-0 bg-purple-pink opacity-20 blur-3xl rounded-full"></div>
            <div className="relative z-10">
              <h1 className="text-6xl font-bold gradient-text mb-6">
                Join Aura
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Begin your transformative journey to mental wellness
              </p>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-aura-purple to-aura-pink rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Immersive VR Therapy</h3>
                    <p className="text-gray-400 text-sm">Experience therapeutic sessions in stunning virtual reality</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-aura-blue to-aura-teal rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Progress Tracking</h3>
                    <p className="text-gray-400 text-sm">Monitor your mental wellness journey with detailed analytics</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-aura-pink to-aura-purple rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Expert-Guided Sessions</h3>
                    <p className="text-gray-400 text-sm">Content designed by certified mental health professionals</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Signup Form */}
        <div className="glass rounded-3xl p-8 flex flex-col h-[90vh]">
          <div className="mb-6">
            <Link to="/" className="text-3xl font-bold gradient-text">
              Aura
            </Link>
          </div>

          <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-gray-400 mb-6">Start your wellness journey today</p>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
            {/* Scrollable Input Fields Container - Shows 2 fields, scroll for more */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar mb-6 max-h-[280px]">
              <div className="space-y-5">
                <div>
                  <label className="block text-white mb-2 font-medium">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-aura-green transition-colors"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2 font-medium">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-aura-green transition-colors"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2 font-medium">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-aura-green transition-colors"
                    placeholder="••••••••"
                  />
                  <p className="text-gray-500 text-xs mt-1">Must be at least 8 characters</p>
                </div>

                <div>
                  <label className="block text-white mb-2 font-medium">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-aura-green transition-colors"
                    placeholder="••••••••"
                  />
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className="w-5 h-5 mt-0.5 rounded border-gray-600 bg-gray-700"
                  />
                  <label className="text-gray-400 text-sm">
                    I agree to the{' '}
                    <a href="#" className="text-aura-green hover:text-aura-lime transition-colors">
                      Terms and Conditions
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-aura-green hover:text-aura-lime transition-colors">
                      Privacy Policy
                    </a>
                  </label>
                </div>
              </div>
            </div>

            {/* Fixed Buttons Container */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>

              <div className="text-center">
                <p className="text-gray-400 text-sm">
                  Already have an account?{' '}
                  <Link to="/login" className="text-aura-green hover:text-aura-lime font-semibold transition-colors">
                    Log In
                  </Link>
                </p>
              </div>

              <div className="pt-2">
                <p className="text-center text-gray-500 text-sm mb-3">Or sign up with</p>
                <button 
                  type="button" 
                  onClick={handleGoogleSignUp}
                  disabled={loading}
                  className="w-full glass border border-white/20 rounded-xl px-4 py-3 flex items-center justify-center space-x-2 hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span className="text-white">
                    {loading ? 'Signing up...' : 'Continue with Google'}
                  </span>
                </button>
                <p className="text-center text-xs text-gray-500 mt-2">
                  By continuing with Google, you agree to our Terms & Conditions and Privacy Policy
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
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
      `}</style>
    </div>
  );
};

export default Signup;
