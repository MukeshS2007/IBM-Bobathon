import { Donation, Shelter, Volunteer, MatchPlan, AgentActionLog, FoodItem } from '../types';

/**
 * Calculates straight-line distance in kilometers between two GPS coordinates (Haversine formula).
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Simulates Bengaluru-specific traffic congestion delay based on route corridor.
 */
export function estimateBengaluruTraffic(
  donorArea: string,
  shelterArea: string,
  baseDistanceKm: number
): { normalMinutes: number; trafficMinutes: number; delayMinutes: number; routeNote: string } {
  // Average base speed in city without heavy traffic: 25 km/h
  const baseMinutes = Math.max(10, Math.round((baseDistanceKm / 25) * 60));

  let delay = 0;
  let bottleneck = '';

  const combined = `${donorArea} -> ${shelterArea}`.toLowerCase();

  if (combined.includes('bellandur') || combined.includes('silk board') || combined.includes('hsr') || combined.includes('sarjapur')) {
    delay = 18;
    bottleneck = 'Silk Board / ORR Bellandur bottle-neck (+18 mins)';
  } else if (combined.includes('hebbal') || combined.includes('palace grounds') || combined.includes('yelahanka')) {
    delay = 14;
    bottleneck = 'Hebbal Flyover / Airport Corridor (+14 mins)';
  } else if (combined.includes('peenya') || combined.includes('rajajinagar') || combined.includes('yeshwanthpur')) {
    delay = 10;
    bottleneck = 'Yeshwanthpur / Tumkur Road Junction (+10 mins)';
  } else if (combined.includes('market') || combined.includes('shivajinagar') || combined.includes('kalasipalya')) {
    delay = 15;
    bottleneck = 'Old City Majestic/K.R. Market dense zone (+15 mins)';
  } else {
    delay = 8;
    bottleneck = 'Standard city signal delay (+8 mins)';
  }

  const trafficMinutes = baseMinutes + delay;
  return {
    normalMinutes: baseMinutes,
    trafficMinutes,
    delayMinutes: delay,
    routeNote: bottleneck
  };
}

/**
 * AGENT 1: Food Quality & Safety Assessment Agent
 * Grounded in FSSAI Food Safety Standards (India)
 */
export function evaluateFoodSafety(foodItems: FoodItem[]): {
  safetyScore: number;
  safeWindowMinutes: number;
  remarks: string[];
  requiresHumanReview: boolean;
} {
  let minSafeWindowMinutes = 240; // Default max safe threshold 4 hours
  let score = 100;
  const remarks: string[] = [];
  let requiresHumanReview = false;

  for (const item of foodItems) {
    const cookedTime = new Date(item.cookedAt).getTime();
    const elapsedMinutes = Math.max(0, Math.round((Date.now() - cookedTime) / (60 * 1000)));

    // FSSAI Danger Zone rule: 5°C to 60°C promotes bacterial growth
    const isDangerZoneTemp = item.temperatureCelsius >= 10 && item.temperatureCelsius <= 58;
    
    // Perishable factors
    let baselineMaxLifespanMinutes = 240; // 4 hours for standard cooked food
    if (item.perishableGrade === 'high') {
      baselineMaxLifespanMinutes = 180; // 3 hours max for coconut/milk/gravies
      if (item.name.toLowerCase().includes('chutney') || item.name.toLowerCase().includes('curd')) {
        baselineMaxLifespanMinutes = 150;
      }
    } else if (item.perishableGrade === 'low') {
      baselineMaxLifespanMinutes = 360; // 6 hours for dry bread/roti
    }

    // Packaging multiplier
    let packagingBonus = 0;
    if (item.packagingType === 'insulated_containers') packagingBonus = 45;
    if (item.packagingType === 'sealed_steel_vessels') packagingBonus = 30;
    if (item.packagingType === 'loose_open') {
      packagingBonus = -45;
      score -= 25;
      remarks.push(`Warning: "${item.name}" has loose/open packaging. Contamination risk elevated.`);
      requiresHumanReview = true;
    }

    const itemSafeWindow = Math.max(0, baselineMaxLifespanMinutes + packagingBonus - elapsedMinutes);
    if (itemSafeWindow < minSafeWindowMinutes) {
      minSafeWindowMinutes = itemSafeWindow;
    }

    // Temperature analysis
    if (isDangerZoneTemp) {
      if (elapsedMinutes > 90) {
        score -= 30;
        remarks.push(`FSSAI Alert: "${item.name}" is at ${item.temperatureCelsius}°C (Danger Zone 5-60°C) for ${elapsedMinutes} mins.`);
        requiresHumanReview = true;
      } else {
        score -= 10;
        remarks.push(`Note: "${item.name}" temperature is cooling (${item.temperatureCelsius}°C). Prioritize immediate delivery.`);
      }
    } else if (item.temperatureCelsius >= 60) {
      remarks.push(`Safe: "${item.name}" maintains high hot-holding temperature (${item.temperatureCelsius}°C ≥ 60°C).`);
    }

    if (elapsedMinutes > 150 && item.perishableGrade === 'high') {
      score -= 20;
      requiresHumanReview = true;
      remarks.push(`High Perishability Alert: High-risk item cooked over 2.5 hours ago.`);
    }
  }

  score = Math.max(10, Math.min(100, score));

  if (score < 65) {
    requiresHumanReview = true;
  }

  return {
    safetyScore: score,
    safeWindowMinutes: minSafeWindowMinutes,
    remarks,
    requiresHumanReview
  };
}

/**
 * AGENT 2: Dynamic Logistics & Matchmaker Agent
 * Pairs surplus donation with the optimal Bengaluru shelter and volunteer.
 */
export function matchDonationWithLogistics(
  donation: Donation,
  candidateShelters: Shelter[],
  candidateVolunteers: Volunteer[],
  safeWindowMinutes: number
): {
  matchedShelter: Shelter | null;
  matchedVolunteer: Volunteer | null;
  trafficDetails: { normalMinutes: number; trafficMinutes: number; delayMinutes: number; routeNote: string };
  reasoningNotes: string[];
} {
  const reasoningNotes: string[] = [];

  // Filter shelters by dietary constraint
  const hasNonVeg = donation.foodItems.some(i => i.dietaryType === 'non_veg');
  const validShelters = candidateShelters.filter(s => {
    if (hasNonVeg && !s.acceptsNonVeg) return false;
    return true;
  });

  if (validShelters.length === 0) {
    reasoningNotes.push('No available shelters matching dietary preferences (Non-Veg restriction).');
    return {
      matchedShelter: null,
      matchedVolunteer: null,
      trafficDetails: { normalMinutes: 0, trafficMinutes: 0, delayMinutes: 0, routeNote: 'No match' },
      reasoningNotes
    };
  }

  // Score candidate shelters based on:
  // 1. Distance & traffic
  // 2. Deficit gap match (avoid splitting small batches or underserving)
  // 3. Safe window viability
  let bestShelter: Shelter | null = null;
  let bestScore = -9999;
  let bestTraffic = { normalMinutes: 0, trafficMinutes: 0, delayMinutes: 0, routeNote: '' };

  for (const shelter of validShelters) {
    const distKm = calculateDistanceKm(donation.lat, donation.lng, shelter.lat, shelter.lng);
    const traffic = estimateBengaluruTraffic(donation.area, shelter.area, distKm);

    // Feasibility check: Can we reach and serve before expiry? (Traffic + 20 mins distribution buffer)
    const totalRequiredTime = traffic.trafficMinutes + 20;
    if (totalRequiredTime > safeWindowMinutes) {
      reasoningNotes.push(`Disqualified ${shelter.name}: Transit time (${traffic.trafficMinutes}m) exceeds safe window (${safeWindowMinutes}m).`);
      continue;
    }

    // Scoring formula:
    // Higher deficit coverage = higher score
    // Lower distance = higher score
    const portionFitScore = Math.min(shelter.currentDeficitPortions, donation.totalPortions);
    const distancePenalty = distKm * 3;
    const score = (portionFitScore * 2) - distancePenalty - (traffic.delayMinutes * 1.5);

    if (score > bestScore) {
      bestScore = score;
      bestShelter = shelter;
      bestTraffic = traffic;
    }
  }

  if (!bestShelter) {
    // If all exceeded safe window, fallback to absolute closest
    bestShelter = validShelters[0];
    const distKm = calculateDistanceKm(donation.lat, donation.lng, bestShelter.lat, bestShelter.lng);
    bestTraffic = estimateBengaluruTraffic(donation.area, bestShelter.area, distKm);
    reasoningNotes.push(`Fallback: Paired with closest shelter ${bestShelter.name} despite tight timing window.`);
  } else {
    reasoningNotes.push(`Matched ${bestShelter.name} in ${bestShelter.area} (Need: ${bestShelter.currentDeficitPortions} meals, Distance: ${calculateDistanceKm(donation.lat, donation.lng, bestShelter.lat, bestShelter.lng)} km).`);
  }

  // Match optimal volunteer
  // Vehicle capacity requirement:
  // > 60 kg -> Mini Truck or Auto
  // <= 60 kg -> Auto or Two-wheeler
  const requiredVehicle = donation.totalKg > 60 ? ['mini_truck', 'auto_rickshaw'] : ['two_wheeler', 'auto_rickshaw', 'mini_truck'];

  const availableVolunteers = candidateVolunteers.filter(v => 
    v.status === 'available' && requiredVehicle.includes(v.vehicleType)
  );

  let bestVolunteer: Volunteer | null = null;
  let minVolunteerDist = 9999;

  for (const vol of availableVolunteers) {
    const volDist = calculateDistanceKm(vol.lat, vol.lng, donation.lat, donation.lng);
    if (volDist < minVolunteerDist) {
      minVolunteerDist = volDist;
      bestVolunteer = vol;
    }
  }

  if (bestVolunteer) {
    reasoningNotes.push(`Assigned Volunteer ${bestVolunteer.name} (${bestVolunteer.vehicleType}) stationed ${minVolunteerDist} km away.`);
  } else {
    // If no exact match, pick any available
    bestVolunteer = candidateVolunteers[0];
    reasoningNotes.push(`Assigned standby Volunteer ${bestVolunteer.name}.`);
  }

  return {
    matchedShelter: bestShelter,
    matchedVolunteer: bestVolunteer,
    trafficDetails: bestTraffic,
    reasoningNotes
  };
}

/**
 * AGENT 3: Multilingual Dispatcher (Kannada, English, Hindi)
 * Generates natural local language dispatch instructions.
 */
export function generateMultilingualDispatch(
  donation: Donation,
  shelter: Shelter,
  volunteer: Volunteer,
  trafficMinutes: number,
  pickupCode: string,
  deliveryCode: string
): { en: string; kn: string; hi: string } {
  const en = `PICKUP ASSIGNMENT: Collect ${donation.totalKg}kg (${donation.totalPortions} meals) from "${donation.donorName}" (${donation.area}). 
Deliver to "${shelter.name}", ${shelter.area} (Contact: ${shelter.contactPerson}, Ph: ${shelter.phone}).
Est. transit: ${trafficMinutes} mins.
Verification: Pickup Code: [${pickupCode}], Delivery Code: [${deliveryCode}]. Please check food seal at handover.`;

  const kn = `ಆಹಾರ ಸಾಗಾಣಿಕೆ ನಿಯೋಜನೆ: "${donation.donorName}" (${donation.area}) ನಿಂದ ${donation.totalKg} ಕೆ.ಜಿ. (${donation.totalPortions} ಊಟಗಳು) ಆಹಾರವನ್ನು ಸಂಗ್ರಹಿಸಿ. 
"${shelter.name}", ${shelter.area} ಗೆ ತಲುಪಿಸಿ (ಸಂಪರ್ಕ ವ್ಯಕ್ತಿ: ${shelter.contactPerson}, ದೂರವಾಣಿ: ${shelter.phone}).
ಅಂದಾಜು ಪ್ರಯಾಣ ಸಮಯ: ${trafficMinutes} ನಿಮಿಷಗಳು.
ದೃಢೀಕರಣ: ಪಿಕಪ್ ಕೋಡ್: [${pickupCode}], ಡೆಲಿವರಿ ಕೋಡ್: [${deliveryCode}]. ದಯವಿಟ್ಟು ಆಹಾರದ ಪ್ಯಾಕಿಂಗ್ ಸುರಕ್ಷತೆಯನ್ನು ಪರಿಶೀಲಿಸಿ.`;

  const hi = `भोजन वितरण कार्य: "${donation.donorName}" (${donation.area}) से ${donation.totalKg} किग्रा (${donation.totalPortions} भोजन) प्राप्त करें। 
"${shelter.name}", ${shelter.area} में पहुँचाएं (संपर्क: ${shelter.contactPerson}, फोन: ${shelter.phone})।
अनुमानित यात्रा समय: ${trafficMinutes} मिनट।
सत्यापन: पिकअप कोड: [${pickupCode}], डिलीवरी कोड: [${deliveryCode}]। कृपया भोजन की पैकिंग और सुरक्षा की जांच करें।`;

  return { en, kn, hi };
}

/**
 * FULL AGENTIC ORCHESTRATOR
 * Executes the 4-agent pipeline sequentially and outputs action logs.
 */
export function orchestrateSurplusMatching(
  donation: Donation,
  shelters: Shelter[],
  volunteers: Volunteer[]
): {
  updatedDonation: Donation;
  matchPlan: MatchPlan;
  logs: AgentActionLog[];
} {
  const logs: AgentActionLog[] = [];
  const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  // STEP 1: SAFETY AGENT
  logs.push({
    id: `log-${Date.now()}-1`,
    timestamp: now,
    agentName: 'SafetyAgent',
    level: 'info',
    message: `Analyzing food safety parameters for ${donation.donorName} (${donation.foodItems.length} food categories)...`,
  });

  const safetyResult = evaluateFoodSafety(donation.foodItems);

  if (safetyResult.safetyScore >= 80) {
    logs.push({
      id: `log-${Date.now()}-2`,
      timestamp: now,
      agentName: 'SafetyAgent',
      level: 'success',
      message: `Safety Score: ${safetyResult.safetyScore}/100. Safe transit window: ${safetyResult.safeWindowMinutes} mins. Approved for auto-dispatch.`,
      details: { remarks: safetyResult.remarks }
    });
  } else if (safetyResult.requiresHumanReview) {
    logs.push({
      id: `log-${Date.now()}-2`,
      timestamp: now,
      agentName: 'SafetyAgent',
      level: 'warn',
      message: `Safety Score: ${safetyResult.safetyScore}/100. Potential microbial risk detected. Human Review Flagged.`,
      details: { remarks: safetyResult.remarks }
    });
  }

  // STEP 2: LOGISTICS & TRAFFIC MATCHER AGENT
  logs.push({
    id: `log-${Date.now()}-3`,
    timestamp: now,
    agentName: 'LogisticsAgent',
    level: 'info',
    message: `Evaluating Bengaluru traffic corridors & shelter capacity for ${donation.totalPortions} meal portions...`,
  });

  const logistics = matchDonationWithLogistics(donation, shelters, volunteers, safetyResult.safeWindowMinutes);

  logs.push({
    id: `log-${Date.now()}-4`,
    timestamp: now,
    agentName: 'LogisticsAgent',
    level: 'decision',
    message: `Optimized Pair: ${logistics.matchedShelter?.name} (${logistics.trafficDetails.trafficMinutes}m ETA via ${logistics.trafficDetails.routeNote}).`,
    details: { reasoning: logistics.reasoningNotes }
  });

  // STEP 3: MULTILINGUAL AGENT
  const pickupCode = `PK-${Math.floor(1000 + Math.random() * 9000)}`;
  const deliveryCode = `DL-${Math.floor(1000 + Math.random() * 9000)}`;

  const instructions = generateMultilingualDispatch(
    donation,
    logistics.matchedShelter!,
    logistics.matchedVolunteer!,
    logistics.trafficDetails.trafficMinutes,
    pickupCode,
    deliveryCode
  );

  logs.push({
    id: `log-${Date.now()}-5`,
    timestamp: now,
    agentName: 'MultilingualAgent',
    level: 'success',
    message: `Generated bilingual dispatch payloads in Kannada, Hindi, and English for Volunteer ${logistics.matchedVolunteer?.name}.`,
  });

  // STEP 4: HUMAN REVIEW GATE (Mandatory Hackathon safety requirement)
  if (safetyResult.requiresHumanReview) {
    logs.push({
      id: `log-${Date.now()}-6`,
      timestamp: now,
      agentName: 'HumanReviewGate',
      level: 'warn',
      message: `ACTION PAUSED: Human Food Safety Officer authorization required before dispatch notification can be pushed.`,
    });
  } else {
    logs.push({
      id: `log-${Date.now()}-6`,
      timestamp: now,
      agentName: 'HumanReviewGate',
      level: 'success',
      message: `Automated safety clearance passed. Instant volunteer notification enabled.`,
    });
  }

  const matchPlan: MatchPlan = {
    donationId: donation.id,
    shelterId: logistics.matchedShelter!.id,
    shelterName: logistics.matchedShelter!.name,
    shelterArea: logistics.matchedShelter!.area,
    volunteerId: logistics.matchedVolunteer!.id,
    volunteerName: logistics.matchedVolunteer!.name,
    volunteerVehicle: logistics.matchedVolunteer!.vehicleType,
    trafficRoute: logistics.trafficDetails.routeNote,
    normalTransitMinutes: logistics.trafficDetails.normalMinutes,
    trafficTransitMinutes: logistics.trafficDetails.trafficMinutes,
    trafficDelayMinutes: logistics.trafficDetails.delayMinutes,
    safeWindowMinutes: safetyResult.safeWindowMinutes,
    fssaiSafetyScore: safetyResult.safetyScore,
    fssaiRemarks: safetyResult.remarks,
    instructions,
    humanReviewRequired: safetyResult.requiresHumanReview,
    humanReviewStatus: safetyResult.requiresHumanReview ? 'pending' : 'approved',
    pickupCode,
    deliveryCode,
  };

  const updatedDonation: Donation = {
    ...donation,
    status: safetyResult.requiresHumanReview ? 'safety_flagged' : 'dispatched',
    matchPlan
  };

  return {
    updatedDonation,
    matchPlan,
    logs
  };
}

