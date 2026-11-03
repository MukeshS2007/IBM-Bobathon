export type DonorType = 'kalyana_mantapa' | 'tech_park' | 'restaurant' | 'community_event';

export type FoodItem = {
  name: string;
  quantityKg: number;
  mealPortions: number;
  cookedAt: string; // ISO string
  temperatureCelsius: number;
  packagingType: 'sealed_steel_vessels' | 'foil_boxes' | 'insulated_containers' | 'loose_open';
  dietaryType: 'pure_veg' | 'non_veg' | 'jain_veg';
  perishableGrade: 'high' | 'medium' | 'low'; // high = milk/gravy based, medium = rice/roti, low = dry bread/sweets
};

export type DonationStatus = 
  | 'logged' 
  | 'evaluating_safety' 
  | 'safety_approved' 
  | 'safety_flagged'
  | 'matching_shelter' 
  | 'dispatched' 
  | 'in_transit' 
  | 'delivered_pending_verification' 
  | 'verified_complete' 
  | 'rejected_safety';

export interface Donation {
  id: string;
  donorName: string;
  donorType: DonorType;
  area: string;
  address: string;
  lat: number;
  lng: number;
  foodItems: FoodItem[];
  totalPortions: number;
  totalKg: number;
  createdAt: string;
  status: DonationStatus;
  urgencyScore: number; // 1 to 10
  matchPlan?: MatchPlan;
}

export interface Shelter {
  id: string;
  name: string;
  area: string;
  address: string;
  lat: number;
  lng: number;
  capacity: number;
  currentDeficitPortions: number;
  acceptsNonVeg: boolean;
  contactPerson: string;
  phone: string;
  verifiedByBBMP: boolean;
}

export interface Volunteer {
  id: string;
  name: string;
  phone: string;
  vehicleType: 'two_wheeler' | 'auto_rickshaw' | 'mini_truck';
  area: string;
  lat: number;
  lng: number;
  status: 'available' | 'busy' | 'offline';
  languages: ('kn' | 'en' | 'hi')[];
  rating: number;
}

export interface MatchPlan {
  donationId: string;
  shelterId: string;
  shelterName: string;
  shelterArea: string;
  volunteerId: string;
  volunteerName: string;
  volunteerVehicle: string;
  trafficRoute: string;
  normalTransitMinutes: number;
  trafficTransitMinutes: number;
  trafficDelayMinutes: number;
  safeWindowMinutes: number;
  fssaiSafetyScore: number;
  fssaiRemarks: string[];
  instructions: {
    en: string;
    kn: string;
    hi: string;
  };
  humanReviewRequired: boolean;
  humanReviewStatus: 'pending' | 'approved' | 'rejected';
  humanReviewNotes?: string;
  pickupCode: string;
  deliveryCode: string;
  temperatureAtHandover?: number;
}

export interface AgentActionLog {
  id: string;
  timestamp: string;
  agentName: 'SafetyAgent' | 'LogisticsAgent' | 'MultilingualAgent' | 'HumanReviewGate';
  level: 'info' | 'success' | 'warn' | 'decision';
  message: string;
  details?: Record<string, any>;
}

export interface ImpactStats {
  totalKgRescued: number;
  mealsServed: number;
  co2EmissionsPreventedKg: number;
  activeDonationsCount: number;
  avgDeliveryMinutes: number;
  safetyComplianceRate: number; // percentage
}

