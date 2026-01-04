import React from 'react';
import { Itinerary, Activity } from '../types';
import { Button } from './Button';

interface ItineraryViewProps {
  itinerary: Itinerary;
  onReset: () => void;
}

const ActivityIcon = ({ type }: { type: Activity['type'] }) => {
  switch (type) {
    case 'food': return <span className="text-orange-500">🍽️</span>;
    case 'transport': return <span className="text-blue-500">🚌</span>;
    case 'sightseeing': return <span className="text-teal-500">📸</span>;
    case 'relaxation': return <span className="text-indigo-500">🧘</span>;
    case 'accommodation': return <span className="text-purple-500">🏨</span>;
    default: return <span>📍</span>;
  }
};

export const ItineraryView: React.FC<ItineraryViewProps> = ({ itinerary, onReset }) => {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 pb-24">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">Trip to {itinerary.destination}</h2>
          <p className="text-slate-600 mt-2">{itinerary.summary}</p>
        </div>
        <Button variant="outline" onClick={onReset}>New Trip</Button>
      </div>

      <div className="space-y-8">
        {itinerary.days.map((day) => (
          <div key={day.day} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="bg-teal-50 px-6 py-4 border-b border-teal-100">
              <h3 className="text-xl font-bold text-teal-800">Day {day.day}: {day.theme}</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {day.activities.map((act, idx) => (
                <div key={idx} className="p-6 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row gap-4">
                  <div className="sm:w-24 flex-shrink-0 flex sm:flex-col items-center sm:items-start text-sm font-semibold text-slate-500 gap-2 sm:gap-0">
                     <span>{act.time}</span>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-1">
                      <ActivityIcon type={act.type} />
                      <h4 className="text-lg font-semibold text-slate-900">{act.activity}</h4>
                    </div>
                    <p className="text-slate-600 text-sm mb-2">{act.description}</p>
                    <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                      {act.location && <span className="bg-slate-100 px-2 py-1 rounded">📍 {act.location}</span>}
                      {act.estimatedCost && <span className="bg-green-50 px-2 py-1 rounded text-green-700">💲 {act.estimatedCost}</span>}
                      <span className="bg-slate-100 px-2 py-1 rounded capitalize">{act.type}</span>
                    </div>
                    
                    {/* Mock Action Buttons */}
                    <div className="mt-3 flex gap-2">
                       {act.type === 'transport' && (
                         <button className="text-xs bg-black text-white px-3 py-1 rounded hover:bg-gray-800 transition">Book Ride</button>
                       )}
                       {(act.type === 'food' || act.type === 'accommodation') && (
                         <button className="text-xs border border-blue-600 text-blue-600 px-3 py-1 rounded hover:bg-blue-50 transition">Reserve Table/Room</button>
                       )}
                       <button className="text-xs text-teal-600 hover:underline">View on Map</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};