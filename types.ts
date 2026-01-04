export interface UserPreferences {
  destination: string;
  duration: number;
  budget: string;
  interests: string[];
}

export interface Activity {
  time: string;
  activity: string;
  description: string;
  location: string;
  type: 'food' | 'transport' | 'sightseeing' | 'relaxation' | 'accommodation';
  estimatedCost?: string;
}

export interface DayPlan {
  day: number;
  theme: string;
  activities: Activity[];
}

export interface Itinerary {
  destination: string;
  summary: string;
  days: DayPlan[];
}

export interface PlaceRecommendation {
  name: string;
  type: string;
  rating: number; // 0-5
  sentimentScore: number; // 0-100
  sentimentSummary: string;
  priceLevel: 'Cheap' | 'Moderate' | 'Expensive' | 'Luxury';
  description: string;
  bookingLink?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum AppView {
  HOME = 'HOME',
  ITINERARY = 'ITINERARY',
  EXPLORE = 'EXPLORE'
}