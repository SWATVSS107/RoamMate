import React, { useState } from 'react';
import { getPlaceRecommendations } from '../services/gemini';
import { PlaceRecommendation } from '../types';
import { Button } from './Button';
import { SentimentChart } from './SentimentChart';

export const ExploreView: React.FC = () => {
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<'hotel' | 'restaurant' | 'attraction'>('restaurant');
  const [places, setPlaces] = useState<PlaceRecommendation[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!location) return;
    setLoading(true);
    try {
      const results = await getPlaceRecommendations(location, category);
      setPlaces(results);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 pb-24">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Explore & Discover</h2>
        <p className="text-slate-600 mt-2">Find highly-rated places with AI-powered sentiment analysis.</p>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Where are you looking? (e.g., Tokyo, Paris)"
            className="flex-1 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <select
            className="p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
            value={category}
            onChange={(e) => setCategory(e.target.value as any)}
          >
            <option value="restaurant">Restaurants</option>
            <option value="hotel">Hotels</option>
            <option value="attraction">Attractions</option>
          </select>
          <Button onClick={handleSearch} isLoading={loading}>
            Search
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {places.map((place, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
            <div className="h-32 bg-slate-200 relative overflow-hidden">
               {/* Placeholder for image since we don't have real URLs from search easily without custom search API */}
               <img src={`https://picsum.photos/seed/${place.name.replace(/\s/g, '')}/400/200`} alt={place.name} className="w-full h-full object-cover" />
               <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded text-xs font-bold shadow-sm">
                 {place.rating} ⭐
               </div>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-slate-900 leading-tight">{place.name}</h3>
              </div>
              <p className="text-xs text-slate-500 mb-3 uppercase tracking-wide">{place.type} • {place.priceLevel}</p>
              
              <p className="text-slate-600 text-sm mb-4 flex-grow">{place.description}</p>
              
              <div className="bg-slate-50 p-3 rounded-lg mt-auto">
                <div className="flex items-center justify-between mb-2">
                   <span className="text-xs font-semibold text-slate-700">Sentiment Analysis</span>
                   <SentimentChart score={place.sentimentScore} />
                </div>
                <p className="text-xs text-slate-600 italic">"{place.sentimentSummary}"</p>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <Button variant="secondary" size="sm" className="w-full" onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(place.name + ' ' + location)}`, '_blank')}>
                   Check Availability
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {!loading && places.length === 0 && (
        <div className="text-center text-slate-400 py-12">
          Search for a location to see recommendations.
        </div>
      )}
    </div>
  );
};