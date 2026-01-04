import React, { useState } from 'react';
import { UserPreferences } from '../types';
import { Button } from './Button';

interface HeroFormProps {
  onSubmit: (prefs: UserPreferences) => void;
  isLoading: boolean;
}

export const HeroForm: React.FC<HeroFormProps> = ({ onSubmit, isLoading }) => {
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState(3);
  const [budget, setBudget] = useState('Medium');
  const [interestInput, setInterestInput] = useState('');
  const [interests, setInterests] = useState<string[]>([]);

  const handleAddInterest = () => {
    if (interestInput.trim() && !interests.includes(interestInput.trim())) {
      setInterests([...interests, interestInput.trim()]);
      setInterestInput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination) return;
    onSubmit({
      destination,
      duration,
      budget,
      interests
    });
  };

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center bg-slate-900 overflow-hidden">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 z-0 opacity-40">
        <img 
          src="https://picsum.photos/1920/1080?grayscale&blur=2" 
          alt="Travel Background" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="relative z-10 w-full max-w-4xl px-4 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 text-center md:text-left text-white">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Explore the world with <span className="text-teal-400">RoamMate</span>
          </h1>
          <p className="text-xl text-slate-200 mb-8 max-w-lg mx-auto md:mx-0">
            Your AI-powered travel companion. Planning perfect trips, analyzing reviews, and guiding you every step of the way.
          </p>
          <div className="hidden md:flex gap-4">
             <div className="flex items-center gap-2">
               <span className="bg-teal-500/20 p-2 rounded-lg">🚀</span>
               <span className="text-sm font-medium">Smart Planning</span>
             </div>
             <div className="flex items-center gap-2">
               <span className="bg-teal-500/20 p-2 rounded-lg">💖</span>
               <span className="text-sm font-medium">Sentiment Analysis</span>
             </div>
          </div>
        </div>

        <div className="flex-1 w-full max-w-md bg-white/95 backdrop-blur-sm p-6 md:p-8 rounded-3xl shadow-2xl">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Plan Your Next Trip</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Destination</label>
              <input
                type="text"
                placeholder="e.g., Kyoto, Japan"
                className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Duration (Days)</label>
                <input
                  type="number"
                  min="1"
                  max="14"
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  value={duration}
                  onChange={(e) => setDuration(parseInt(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Budget</label>
                <select
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                >
                  <option>Shoestring</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Luxury</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Interests</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="e.g., History, Food"
                  className="flex-1 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInterest())}
                />
                <button type="button" onClick={handleAddInterest} className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 font-bold">+</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {interests.map((int, i) => (
                  <span key={i} className="bg-teal-50 text-teal-700 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                    {int}
                    <button type="button" onClick={() => setInterests(interests.filter(item => item !== int))} className="hover:text-teal-900">×</button>
                  </span>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
              Generate Itinerary
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};