import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AreaChart, Area, LineChart, Line, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Card from '../components/Card';
import GridBackground from '../components/GridBackground';

import { therapySessions as allTherapySessions } from './TherapySelection';
import { fitbitAPI, mockFitbitData, getToday, getDaysAgo, getWeekStart, formatDate } from '../services/fitbitService';

const useAuth = () => ({ user: { name: 'Friend' } });

const PlayIcon = React.memo(() => <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" /></svg>);
const ChevronLeftIcon = React.memo(() => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>);
const ChevronRightIcon = React.memo(() => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>);
const BrainIcon = React.memo(() => <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.5c2.761 0 5 2.239 5 5s-2.239 5-5 5-5-2.239-5-5 2.239-5 5-5zM3.5 14.5c0-2.761 2.239-5 5-5h.5m8.5 0h.5c2.761 0 5 2.239 5 5s-2.239 5-5 5h-1.5m-6 0H8.5c-2.761 0-5-2.239-5-5zM12 14.5v-5" /></svg>);
const CalendarIcon = React.memo(() => <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>);
const RightArrowIcon = React.memo(() => <svg className="w-5 h-5 text-gray-500 hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>);
const CheckCircleIcon = React.memo(() => <svg className="w-5 h-5 text-lime-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>);

// Now using the imported 'allTherapySessions'
const defaultRecommendations = [
    allTherapySessions.find(s => s.id === 'vr-waterfall-relaxation'),
    allTherapySessions.find(s => s.id === 'gentle-stream-sleep'),
    allTherapySessions.find(s => s.id === 'open-ocean-sunrise'),
    allTherapySessions.find(s => s.id === 'vr-forest-walk'), // Changed from 'forest-bathing-vr' to 'vr-forest-walk' as per TherapySelection.jsx
].filter(Boolean);

const highStressRecommendations = [
    allTherapySessions.find(s => s.id === 'chakra-healing'),
    allTherapySessions.find(s => s.id === 'deep-breathing'),
    allTherapySessions.find(s => s.id === 'immersive-guided-meditation'),
    allTherapySessions.find(s => s.id === 'vr-waterfall-relaxation'),
].filter(Boolean);

const stressChartData = [
    { day: 'Mon', score: 28 }, { day: 'Tue', score: 25 }, { day: 'Wed', score: 26 },
    { day: 'Thu', score: 22 }, { day: 'Fri', score: 12 }, { day: 'Sat', score: 20 },
    { day: 'Sun', score: 18 },
];

const thingsToDoData = [
    { time: 'Morning', title: 'Mindful Breathing', description: 'Start your day with a 5-minute deep breathing exercise.' },
    { time: 'Afternoon', title: 'VR Nature Walk', description: 'Take a 15-minute break with an immersive forest therapy session.' },
    { time: 'Evening', title: 'Gentle Sleep Scape', description: 'Prepare for restful sleep with a guided audio experience.' },
];

const getStressLevelDetails = (score) => {
    if (score === null || score === undefined) {
        return { category: 'N/A', description: 'Take an assessment to get started.', rawColor: '#A78BFA', changeColor: 'text-gray-400' };
    }
    if (score <= 13) {
        return { category: 'Low Stress', description: 'Your stress level is low. Keep up the great work maintaining your mental balance!', rawColor: '#5EEAD4', changeColor: 'text-teal-400' };
    }
    if (score <= 26) {
        return { category: 'Moderate Stress', description: 'You seem to be experiencing moderate stress. Our relaxation exercises can help you find calm.', rawColor: '#60A5FA', changeColor: 'text-blue-400' };
    }
    return { category: 'High Stress', description: 'Your results suggest high stress. We strongly recommend our guided meditations to help you de-stress.', rawColor: '#A78BFA', changeColor: 'text-violet-400' };
};

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-gray-800/80 backdrop-blur-sm border border-aura-purple/50 p-3 rounded-lg shadow-lg">
                <p className="label text-white font-bold">{`Day: ${label}`}</p>
                <p className="intro text-aura-purple">{`Stress Score: ${payload[0].value}`}</p>
            </div>
        );
    }
    return null;
};

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [stats, setStats] = useState({
        sessionsCompleted: 12,
        totalMinutes: 180,
        currentStreak: 5,
    });
    
    const [assessmentHistory, setAssessmentHistory] = useState([]);
    const [recommendations, setRecommendations] = useState(defaultRecommendations);
    const [weekOffset, setWeekOffset] = useState(0);

    const latestAssessment = useMemo(() => assessmentHistory.length > 0 ? assessmentHistory[assessmentHistory.length - 1] : null, [assessmentHistory]);
    const previousAssessment = useMemo(() => assessmentHistory.length > 1 ? assessmentHistory[assessmentHistory.length - 2] : null, [assessmentHistory]);

    useEffect(() => {
        const savedHistory = localStorage.getItem('stressAssessmentHistory');
        if (savedHistory) {
            try {
                const parsedHistory = JSON.parse(savedHistory);
                if (!parsedHistory || parsedHistory.length === 0) {
                    setAssessmentHistory([ { score: 28, date: '...'}, { score: 22, date: '...' }]);
                } else {
                    setAssessmentHistory(Array.isArray(parsedHistory) ? parsedHistory : []);
                }
            } catch (error) {
                console.error("Failed to parse stress assessment history from localStorage", error);
                localStorage.removeItem('stressAssessmentHistory');
            }
        } else {
            setAssessmentHistory([ { score: 28, date: '...'}, { score: 22, date: '...' }]);
        }
    }, []);

    useEffect(() => {
        const highStress = latestAssessment && latestAssessment.score > 26;
        setRecommendations(highStress ? highStressRecommendations : defaultRecommendations);
    }, [latestAssessment]);
    
    const handleStartAssessment = () => {
        navigate('/stress-assessment');
    };
    
    const currentMonth = new Date().toLocaleString('default', { month: 'long' });
    
    const renderAssessmentCard = () => {
        if (!latestAssessment) {
            return (
                <Card className="p-8 bg-gradient-to-r from-aura-purple/20 to-aura-pink/20 border-2 border-aura-purple/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-aura-purple/20 to-transparent rounded-full blur-3xl" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-aura-purple to-aura-pink rounded-2xl flex items-center justify-center animate-pulse flex-shrink-0">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                        </div>
                        <div className="flex-grow text-center md:text-left">
                            <h3 className="text-2xl font-bold text-white">Unlock Your Personalized Dashboard</h3>
                            <p className="text-gray-300 mt-2 mb-4 max-w-xl">Take the 2-minute PSS-10 stress assessment to understand your current mental state and get tailored VR therapy recommendations.</p>
                        </div>
                        <button onClick={handleStartAssessment} className="btn-primary flex-shrink-0 px-6 py-3">Start Assessment</button>
                    </div>
                </Card>
            );
        }

        const stressDetails = getStressLevelDetails(latestAssessment.score);
        const scoreChange = previousAssessment ? latestAssessment.score - previousAssessment.score : null;
        const radialGradient = `radial-gradient(circle at 30% 50%, ${stressDetails.rawColor}20, transparent 60%)`;

        return (
            <Card style={{ background: radialGradient }} className={`p-8 bg-gray-900 border border-white/10 overflow-hidden transition-all duration-500`}>
                <div className="grid md:grid-cols-3 gap-8 items-center">
                    <div className="md:col-span-1 flex flex-col items-center justify-center text-center">
                        <div className="w-40 h-40 rounded-full flex flex-col items-center justify-center transition-colors duration-500" style={{ backgroundColor: `${stressDetails.rawColor}25` }}>
                            <span className="text-6xl font-bold text-white tracking-tighter">{latestAssessment.score}</span>
                            <span className="text-gray-400 text-lg">/ 40</span>
                        </div>
                        <p className="font-semibold text-white mt-3 text-lg">Your PSS Score</p>
                    </div>
                    
                    <div className="md:col-span-2 text-center md:text-left">
                        <p className={`font-bold uppercase tracking-wider`} style={{ color: stressDetails.rawColor }}>
                            {stressDetails.category}
                        </p>
                        <h3 className="text-3xl font-bold text-white mt-2">Assessment Result</h3>
                        <p className="text-gray-300 mt-3 max-w-lg">{stressDetails.description}</p>
                        
                        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-6">
                            {scoreChange !== null && (
                                <div className={`flex items-center text-md font-semibold ${scoreChange > 0 ? 'text-red-400' : 'text-green-400'}`}>
                                    {scoreChange > 0 ? <span>&#9650;</span> : <span>&#9660;</span>}
                                    <span className="ml-1.5">{Math.abs(scoreChange)} point {scoreChange > 0 ? 'increase' : 'decrease'}</span>
                                </div>
                            )}
                            <button onClick={handleStartAssessment} className="font-semibold py-2 px-5 rounded-lg transition-colors bg-white/10 hover:bg-white/20 text-white">
                                Retake Assessment
                            </button>
                        </div>
                    </div>
                </div>
            </Card>
        );
    };

    return (
        <GridBackground className="min-h-screen">
            <Navbar transparent={true} />
            <main className="pt-28 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <header className="mb-8">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Welcome back, <span className="gradient-text">{user?.name || 'Friend'}</span></h1>
                        <p className="text-xl text-gray-400">Your immersive wellness journey continues here.</p>
                    </header>

                    <section className="mb-12">
                        {renderAssessmentCard()}
                    </section>

                    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                             <Card className="p-6 group relative overflow-hidden">
                                 <div className="absolute -top-1 -left-1 w-2/3 h-2/3 bg-gradient-to-br from-aura-purple to-aura-pink opacity-0 group-hover:opacity-10 transition-opacity duration-300 blur-3xl"></div>
                                 <div className="relative">
                                     <div className="flex items-center justify-between mb-2">
                                         <h3 className="text-white font-semibold">Mindful Minutes</h3>
                                         <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-400 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12">
                                             <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                         </div>
                                     </div>
                                     <span className="text-4xl font-bold text-white">{stats.totalMinutes}</span>
                                     <div className="flex items-center text-sm text-teal-400 mt-1"><span>&#9650;</span><span className="ml-1">15% vs last week</span></div>
                                 </div>
                             </Card>
                             <Card className="p-6 group relative overflow-hidden">
                                 <div className="absolute -top-1 -right-1 w-2/3 h-2/3 bg-gradient-to-bl from-aura-purple to-aura-pink opacity-0 group-hover:opacity-10 transition-opacity duration-300 blur-3xl"></div>
                                 <div className="relative">
                                     <div className="flex items-center justify-between mb-2">
                                         <h3 className="text-white font-semibold">Sessions Taken</h3>
                                         <div className="w-10 h-10 bg-gradient-to-br from-aura-purple to-aura-pink rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
                                             <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                         </div>
                                     </div>
                                     <span className="text-4xl font-bold text-white">{stats.sessionsCompleted}</span>
                                     <div className="flex items-center text-sm text-teal-400 mt-1"><span>&#9650;</span><span className="ml-1">+2 vs last week</span></div>
                                 </div>
                             </Card>
                             <Card className="p-6 group relative overflow-hidden">
                                 <div className="absolute -top-1 -left-1 w-2/3 h-2/3 bg-gradient-to-br from-green-500 to-lime-400 opacity-0 group-hover:opacity-10 transition-opacity duration-300 blur-3xl"></div>
                                 <div className="relative">
                                     <div className="flex items-center justify-between mb-2">
                                         <h3 className="text-white font-semibold">{currentMonth} Streak</h3>
                                         <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-lime-400 rounded-lg flex items-center justify-center">
                                             <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg>
                                         </div>
                                     </div>
                                     <span className="text-4xl font-bold text-white">{stats.currentStreak} <span className="text-xl font-medium text-gray-400">days</span></span>
                                      <div className="flex justify-between items-center mt-2">
                                          <button onClick={() => setWeekOffset(weekOffset - 1)} className="p-1 rounded-full hover:bg-white/10 transition-colors"><ChevronLeftIcon /></button>
                                          {Array.from({ length: 7 }).map((_, i) => {
                                              const baseDate = new Date();
                                              baseDate.setDate(baseDate.getDate() - (6 - i) + (weekOffset * 7));
                                              const dayOfMonth = baseDate.getDate();
                                              const isStreaked = weekOffset === 0 && i >= 7 - stats.currentStreak;
                                              return (<div key={i} className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${isStreaked ? 'bg-lime-400 text-black' : 'bg-white/10 text-gray-400'}`}>{dayOfMonth}</div>);
                                          })}
                                          <button onClick={() => setWeekOffset(weekOffset + 1)} disabled={weekOffset === 0} className="p-1 rounded-full hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"><ChevronRightIcon /></button>
                                      </div>
                                 </div>
                             </Card>
                    </section>

                    <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-8">
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-2xl font-bold text-white">Your Next Immersive Experience</h2>
                                    <button onClick={() => navigate('/therapy')} className="text-lime-400 hover:text-lime-300 transition-colors font-semibold">View All</button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {recommendations.map((session) => (
                                        <button key={session.id} onClick={() => navigate(`/therapy/${session.id}`, { state: { session } })} className="group block rounded-2xl overflow-hidden shadow-lg hover:shadow-aura-purple/30 transition-all duration-300 transform hover:-translate-y-1 text-left">
                                            <div className="relative h-64 w-full overflow-hidden">
                                                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110" style={{ backgroundImage: `url(${session.thumbnail})` }} />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                                                <div className="absolute top-4 left-4"><span className="px-3 py-1 bg-black/40 text-white text-xs font-bold rounded-full backdrop-blur-sm border border-white/20">{session.category}</span></div>
                                                <div className="absolute inset-0 p-5 flex flex-col justify-end">
                                                    <h3 className="text-xl font-bold text-white leading-tight">{session.title}</h3>
                                                    <div className="flex items-center justify-between text-gray-300 mt-3">
                                                        <span className="text-sm font-semibold">{session.duration}</span>
                                                        <div className="w-10 h-10 bg-lime-400 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-110"><PlayIcon /></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <div>
                                <Card className="p-6">
                                    <h2 className="text-2xl font-bold text-white mb-4">Your Progress</h2>
                                    <div className="h-80">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart
                                                data={stressChartData}
                                                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                                            >
                                                <defs>
                                                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="var(--aura-purple)" stopOpacity={0.8}/>
                                                        <stop offset="95%" stopColor="var(--aura-pink)" stopOpacity={0.1}/>
                                                    </linearGradient>
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                                                <XAxis dataKey="day" stroke="rgba(255, 255, 255, 0.5)" />
                                                <YAxis stroke="rgba(255, 255, 255, 0.5)" />
                                                <Tooltip content={<CustomTooltip />} />
                                                <Area type="monotone" dataKey="score" stroke="var(--aura-purple)" fill="url(#colorGradient)" strokeWidth={2} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </Card>
                            </div>

                        </div>
                        
                        <aside className="space-y-6">
                            <Card className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-bold text-white">Recent Activity</h3>
                                    <CalendarIcon />
                                </div>
                                <div className="space-y-2">
                                    {recommendations.slice(0, 3).map((session, index) => (
                                        <button key={index} onClick={() => navigate(`/therapy/${session.id}`, { state: { session } })} className="w-full text-left p-2 hover:bg-white/5 rounded-lg transition-colors">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-4">
                                                    <div className="p-3 bg-gray-800 rounded-xl">
                                                        <PlayIcon />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-white">{session.title}</p>
                                                        <p className="text-sm text-gray-400">{session.category} &bull; {session.duration}</p>
                                                    </div>
                                                </div>
                                                <RightArrowIcon />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </Card>
                            <Card className="p-6">
                                <h3 className="text-xl font-bold text-white mb-4">Things To Do</h3>
                                <div className="space-y-4">
                                    {thingsToDoData.map((item, index) => (
                                        <div key={index} className="flex space-x-4">
                                            <div className="flex-shrink-0 mt-1"><CheckCircleIcon /></div>
                                            <div>
                                                <p className="font-bold text-lime-400">{item.time}: <span className="text-white font-semibold">{item.title}</span></p>
                                                <p className="text-gray-400 text-sm">{item.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                             <Card className="p-6 relative overflow-hidden bg-gradient-to-br from-gray-900 to-blue-500/30 border border-blue-500/50">
                                  <div className="flex items-start justify-between">
                                      <div>
                                          <p className="text-sm font-bold text-blue-400 uppercase">VR Therapy Principle</p>
                                          <h3 className="text-2xl font-bold text-white mt-1">The Power of Presence</h3>
                                          <p className="text-gray-400 mt-2 text-sm max-w-xs">Presence is the feeling of 'being there' in a virtual world. This deep immersion makes therapeutic exercises feel real and highly effective.</p>
                                      </div>
                                      <div className="p-3 bg-blue-500/30 rounded-lg"><BrainIcon /></div>
                                  </div>
                             </Card>
                        </aside>
                    </section>

                    <section className="mt-12">
                             <Card className="p-8 bg-gradient-to-r from-aura-purple/40 to-gray-900/30">
                                  <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                                      <div className="text-center md:text-left">
                                          <h2 className="text-3xl font-bold text-white">Ready for a session?</h2>
                                          <p className="text-gray-300 mt-2 mb-6">Jump back into your favorite therapy.</p>
                                          <button onClick={() => navigate('/therapy')} className="bg-lime-400 hover:bg-lime-300 text-black font-bold py-3 px-8 rounded-full transition-colors duration-300">Start Session</button>
                                      </div>
                                      <div className="text-7xl md:text-8xl"><span>🧘‍♀️</span></div>
                                  </div>
                             </Card>
                    </section>
                </div>
            </main>
            <Footer />
            <style jsx global>{`
                :root { --aura-purple: #8B5CF6; --aura-pink: #EC4899; }
                .btn-primary {
                    background-image: linear-gradient(to right, var(--aura-purple), var(--aura-pink));
                    color: white; font-weight: bold; border-radius: 9999px;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px 0 rgba(139, 92, 246, 0.4);
                }
                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px 0 rgba(236, 72, 153, 0.5);
                }
                .gradient-text {
                    background: -webkit-linear-gradient(45deg, var(--aura-purple), var(--aura-pink));
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
            `}</style>
        </GridBackground>
    );
};

export default Dashboard;

//dashboard


