import React, { useState } from 'react';
import { HeroForm } from './components/HeroForm';
import { ItineraryView } from './components/ItineraryView';
import { ExploreView } from './components/ExploreView';
import { ChatWidget } from './components/ChatWidget';
import { generateItinerary } from './services/gemini';
import { UserPreferences, Itinerary, AppView } from './types';

function App() {
  const [view, setView] = useState<AppView>(AppView.HOME);
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePlanTrip = async (prefs: UserPreferences) => {
    setLoading(true);
    try {
      const result = await generateItinerary(
        prefs.destination,
        prefs.duration,
        prefs.budget,
        prefs.interests
      );
      setItinerary(result);
      setView(AppView.ITINERARY);
    } catch (error) {
      alert("Failed to generate itinerary. Please check your API Key or try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setItinerary(null);
    setView(AppView.HOME);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Navigation */}
      <nav className="fixed w-full z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div 
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setView(AppView.HOME)}
            >
              <span className="text-2xl">🌍</span>
              <span className="font-bold text-xl tracking-tight text-slate-800">RoamMate</span>
            </div>
            <div className="flex gap-6">
              <button 
                onClick={() => setView(AppView.HOME)} 
                className={`text-sm font-medium transition-colors ${view === AppView.HOME ? 'text-teal-600' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Plan Trip
              </button>
              <button 
                onClick={() => setView(AppView.EXPLORE)} 
                className={`text-sm font-medium transition-colors ${view === AppView.EXPLORE ? 'text-teal-600' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Explore Places
              </button>
              {itinerary && (
                 <button 
                  onClick={() => setView(AppView.ITINERARY)} 
                  className={`text-sm font-medium transition-colors ${view === AppView.ITINERARY ? 'text-teal-600' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  Current Itinerary
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-16">
        {view === AppView.HOME && (
          <HeroForm onSubmit={handlePlanTrip} isLoading={loading} />
        )}
        
        {view === AppView.ITINERARY && itinerary && (
          <ItineraryView itinerary={itinerary} onReset={handleReset} />
        )}

        {view === AppView.EXPLORE && (
          <ExploreView />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} RoamMate. Powered by Gemini.</p>
        </div>
      </footer>

      {/* Chat Assistant */}
      <ChatWidget />
    </div>
  );
}

export default App;