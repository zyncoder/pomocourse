import React, { useState } from 'react';
import { NavigationIcon } from './Icons';

interface LandingPageProps {
  onLogin: (email: string, pass: string) => void;
}

const FeatureCard: React.FC<{ icon: string; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div className="bg-gray-800/50 p-6 rounded-lg">
    <div className="flex items-center space-x-4 mb-3">
      <div className="bg-red-600/20 p-2 rounded-lg">
        <NavigationIcon icon={icon} />
      </div>
      <h3 className="text-xl font-bold">{title}</h3>
    </div>
    <p className="text-gray-400">{children}</p>
  </div>
);

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <header className="p-4 flex justify-between items-center max-w-6xl mx-auto">
        <div className="flex items-center space-x-3">
           <svg className="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"></path>
          </svg>
          <h1 className="text-xl font-bold tracking-tighter">PomoCourse</h1>
        </div>
        <a href="#login" className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg transition-colors">
          Login
        </a>
      </header>
      
      <main className="max-w-6xl mx-auto px-4 py-16 sm:py-24 text-center">
        <section id="hero">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter mb-4">
            Master Your Courses, One Pomodoro at a Time.
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            PomoCourse transforms your study schedule into a gamified, focused journey. Stop procrastinating and start achieving with a smart timer that keeps you on track.
          </p>
          <a href="#login" className="bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors">
            Get Started
          </a>
        </section>

        <section id="features" className="py-24">
            <h2 className="text-3xl font-bold mb-12">Why You'll Love PomoCourse</h2>
            <div className="grid md:grid-cols-3 gap-8 text-left">
                <FeatureCard icon="dashboard" title="Smart Scheduling">
                    Automatically generates a daily study plan based on your course timeline. Miss a day? It smartly redistributes your work.
                </FeatureCard>
                <FeatureCard icon="stats" title="Gamified Progress">
                    Earn points, level up, and unlock badges. Turn studying into a rewarding game to stay motivated every single day.
                </FeatureCard>
                <FeatureCard icon="calendar" title="Visualize Your Journey">
                    A clear calendar view shows your entire schedule, tracks your progress, and highlights your accomplishments.
                </FeatureCard>
            </div>
        </section>
        
        <section id="login" className="py-16">
            <div className="max-w-md mx-auto bg-gray-800/50 p-8 rounded-2xl">
                <h2 className="text-3xl font-bold mb-6">Login to Your Dashboard</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 text-left mb-1">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 text-lg p-3"
                        />
                    </div>
                     <div>
                        <label htmlFor="password"  className="block text-sm font-medium text-gray-300 text-left mb-1">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-gray-700 border-gray-600 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500 text-lg p-3"
                        />
                    </div>
                    <button type="submit" className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-4 rounded-lg text-lg transition-colors">
                        Access Your Plan
                    </button>
                </form>
            </div>
        </section>

      </main>
      <footer className="text-center p-6 border-t border-gray-800">
        <p className="text-gray-500">&copy; {new Date().getFullYear()} PomoCourse. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
