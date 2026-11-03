import React, { useState } from 'react';
import { Donation, Shelter, Volunteer } from '../types';
import { BENGALURU_TRAFFIC_HOTSPOTS } from '../data/mockData';
import { 
  MapPin, 
  Clock, 
  Thermometer, 
  Truck, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  Info,
  Navigation
} from 'lucide-react';

interface CityGridMapProps {
  donations: Donation[];
  shelters: Shelter[];
  volunteers: Volunteer[];
  onSelectDonation: (id: string) => void;
}

export const CityGridMap: React.FC<CityGridMapProps> = ({
  donations,
  shelters,
  volunteers,
  onSelectDonation,
}) => {
  const [selectedEntity, setSelectedEntity] = useState<{
    type: 'donation' | 'shelter' | 'volunteer' | 'traffic';
    data: any;
  } | null>(null);

  // Map coordinates projection helper (transforms Lat/Lng of Bengaluru [12.85 to 13.12, 77.48 to 77.78] to SVG viewBox 0..800, 0..600)
  const minLat = 12.88;
  const maxLat = 13.12;
  const minLng = 77.50;
  const maxLng = 77.76;

  const project = (lat: number, lng: number) => {
    const x = ((lng - minLng) / (maxLng - minLng)) * 740 + 30;
    // Invert Y for SVG coordinates
    const y = ((maxLat - lat) / (maxLat - minLat)) * 520 + 30;
    return { x: Math.max(40, Math.min(760, x)), y: Math.max(40, Math.min(550, y)) };
  };

  return (
    <div className="space-y-6">
      {/* City Status Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Bengaluru Active Corridors</p>
            <p className="text-xl font-bold text-white mt-1">6 Monitored</p>
          </div>
          <div className="p-2.5 bg-blue-500/10 rounded-lg text-blue-400">
            <Navigation className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Active Surplus Batches</p>
            <p className="text-xl font-bold text-amber-400 mt-1">{donations.length} Active</p>
          </div>
          <div className="p-2.5 bg-amber-500/10 rounded-lg text-amber-400">
            <span className="text-lg">🍲</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Verified Partner Shelters</p>
            <p className="text-xl font-bold text-emerald-400 mt-1">{shelters.length} Shelters</p>
          </div>
          <div className="p-2.5 bg-emerald-500/10 rounded-lg text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Active Volunteer Fleet</p>
            <p className="text-xl font-bold text-purple-400 mt-1">{volunteers.length} Ready</p>
          </div>
          <div className="p-2.5 bg-purple-500/10 rounded-lg text-purple-400">
            <Truck className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Map Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Interactive SVG Map */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 overflow-hidden shadow-2xl relative">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Bengaluru Live Autonomous Matching Grid
              </h2>
              <p className="text-xs text-slate-400">
                Real-time spatial visualization: Donors, Shelters, Congestion Corridors & Active Dispatches
              </p>
            </div>
            
            <div className="flex items-center gap-2 text-[11px] bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <span className="flex items-center gap-1 text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span> Surplus
              </span>
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Shelter
              </span>
              <span className="flex items-center gap-1 text-red-400">
                <span className="w-2 h-2 rounded-full bg-red-400"></span> Bottleneck
              </span>
            </div>
          </div>

          <div className="relative w-full aspect-[4/3] bg-slate-950 rounded-xl border border-slate-800/80 overflow-hidden">
            
            {/* SVG Visual Grid & Nodes */}
            <svg viewBox="0 0 800 580" className="w-full h-full select-none">
              <defs>
                {/* Radial Glows */}
                <radialGradient id="surplusGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="shelterGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </radialGradient>
                {/* Dashed line animation pattern */}
                <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>

              {/* Background Bengaluru Zone Regions */}
              <rect x="0" y="0" width="800" height="580" fill="#030712" />
              
              {/* Subtle Map Grid lines */}
              {Array.from({ length: 9 }).map((_, i) => (
                <line 
                  key={`h-${i}`} 
                  x1="0" 
                  y1={i * 65 + 30} 
                  x2="800" 
                  y2={i * 65 + 30} 
                  stroke="#1e293b" 
                  strokeDasharray="4 4" 
                  strokeWidth="0.8" 
                />
              ))}
              {Array.from({ length: 12 }).map((_, i) => (
                <line 
                  key={`v-${i}`} 
                  x1={i * 70 + 20} 
                  y1="0" 
                  x2={i * 70 + 20} 
                  y2="580" 
                  stroke="#1e293b" 
                  strokeDasharray="4 4" 
                  strokeWidth="0.8" 
                />
              ))}

              {/* Major Ring Roads Representation */}
              {/* Outer Ring Road (ORR) curve */}
              <path 
                d="M 120 180 Q 400 90, 680 230 Q 720 380, 520 480 Q 250 510, 150 350 Z" 
                fill="none" 
                stroke="#334155" 
                strokeWidth="2" 
                strokeDasharray="8 6" 
              />
              <text x="590" y="320" fill="#64748b" fontSize="10" fontWeight="600">Outer Ring Road (ORR)</text>
              <text x="210" y="140" fill="#64748b" fontSize="10" fontWeight="600">Hebbal - Bellary Rd Corridor</text>
              <text x="430" y="470" fill="#64748b" fontSize="10" fontWeight="600">Hosur Rd - Silk Board Corridor</text>

              {/* Bengaluru Landmark Labels */}
              <text x="360" y="270" fill="#475569" fontSize="12" fontWeight="700">Central Bengaluru (MG Rd / Majestic)</text>
              <text x="630" y="240" fill="#475569" fontSize="11" fontWeight="600">Whitefield Tech Corridor</text>
              <text x="480" y="520" fill="#475569" fontSize="11" fontWeight="600">Electronic City Phase 1 & 2</text>
              <text x="140" y="440" fill="#475569" fontSize="11" fontWeight="600">Rajarajeshwari Nagar</text>
              <text x="100" y="190" fill="#475569" fontSize="11" fontWeight="600">Peenya Industrial Zone</text>
              <text x="450" y="80" fill="#475569" fontSize="11" fontWeight="600">Yelahanka Satellite Town</text>

              {/* Active Dispatch Connection Lines between Matched Donor & Shelter */}
              {donations.map((d) => {
                if (!d.matchPlan) return null;
                const shelter = shelters.find(s => s.id === d.matchPlan?.shelterId);
                if (!shelter) return null;
                const p1 = project(d.lat, d.lng);
                const p2 = project(shelter.lat, shelter.lng);

                return (
                  <g key={`route-${d.id}`} className="cursor-pointer" onClick={() => onSelectDonation(d.id)}>
                    {/* Pulsing route line */}
                    <line 
                      x1={p1.x} 
                      y1={p1.y} 
                      x2={p2.x} 
                      y2={p2.y} 
                      stroke="url(#routeGradient)" 
                      strokeWidth="3.5" 
                      strokeLinecap="round"
                      strokeDasharray="6 4"
                      className="animate-pulse"
                    />
                    {/* Animated moving courier node */}
                    <circle 
                      cx={(p1.x + p2.x) / 2} 
                      cy={(p1.y + p2.y) / 2} 
                      r="6" 
                      fill="#38bdf8" 
                      stroke="#ffffff" 
                      strokeWidth="2" 
                    />
                  </g>
                );
              })}

              {/* Shelters (Emerald Nodes) */}
              {shelters.map((s) => {
                const { x, y } = project(s.lat, s.lng);
                const isSelected = selectedEntity?.data?.id === s.id;
                return (
                  <g 
                    key={s.id} 
                    transform={`translate(${x}, ${y})`} 
                    className="cursor-pointer transition-transform hover:scale-125"
                    onClick={() => setSelectedEntity({ type: 'shelter', data: s })}
                  >
                    <circle r="22" fill="url(#shelterGlow)" />
                    <circle 
                      r="10" 
                      fill="#059669" 
                      stroke={isSelected ? "#ffffff" : "#34d399"} 
                      strokeWidth={isSelected ? "3" : "1.5"} 
                    />
                    <text y="3" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">🏠</text>
                    <text y="22" textAnchor="middle" fill="#a7f3d0" fontSize="9" fontWeight="600" className="pointer-events-none drop-shadow">
                      {s.name.split(' ')[0]}
                    </text>
                  </g>
                );
              })}

              {/* Donations (Amber Nodes) */}
              {donations.map((d) => {
                const { x, y } = project(d.lat, d.lng);
                const isSelected = selectedEntity?.data?.id === d.id;
                const isDanger = d.status === 'safety_flagged';
                const fillColor = isDanger ? '#ef4444' : '#f59e0b';

                return (
                  <g 
                    key={d.id} 
                    transform={`translate(${x}, ${y})`} 
                    className="cursor-pointer transition-transform hover:scale-125"
                    onClick={() => {
                      setSelectedEntity({ type: 'donation', data: d });
                      onSelectDonation(d.id);
                    }}
                  >
                    <circle r="24" fill="url(#surplusGlow)" />
                    <circle 
                      r="12" 
                      fill={fillColor} 
                      stroke={isSelected ? "#ffffff" : "#fbbf24"} 
                      strokeWidth={isSelected ? "3" : "2"} 
                      className={isDanger ? "animate-bounce" : ""}
                    />
                    <text y="4" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">🍲</text>
                    <text y="24" textAnchor="middle" fill="#fde68a" fontSize="9" fontWeight="700" className="pointer-events-none drop-shadow">
                      {d.donorType === 'kalyana_mantapa' ? 'Wedding' : d.donorType === 'tech_park' ? 'TechPark' : 'Restaurant'}
                    </text>
                  </g>
                );
              })}

              {/* Volunteers (Vehicle Icons) */}
              {volunteers.map((v) => {
                const { x, y } = project(v.lat, v.lng);
                return (
                  <g 
                    key={v.id} 
                    transform={`translate(${x}, ${y})`} 
                    className="cursor-pointer hover:scale-125 transition-transform"
                    onClick={() => setSelectedEntity({ type: 'volunteer', data: v })}
                  >
                    <circle r="8" fill="#6366f1" stroke="#a5b4fc" strokeWidth="1.5" />
                    <text y="3" textAnchor="middle" fill="#ffffff" fontSize="8">🛵</text>
                  </g>
                );
              })}

              {/* Traffic Bottleneck Indicators */}
              <g transform="translate(480, 440)" className="cursor-pointer" onClick={() => setSelectedEntity({ type: 'traffic', data: BENGALURU_TRAFFIC_HOTSPOTS[0] })}>
                <circle r="14" fill="#dc2626" fillOpacity="0.4" className="animate-ping" />
                <circle r="8" fill="#ef4444" stroke="#fca5a5" strokeWidth="1.5" />
                <text y="3" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold">🚦</text>
                <text y="18" textAnchor="middle" fill="#fca5a5" fontSize="8" fontWeight="600">Silk Board Jam</text>
              </g>

              <g transform="translate(380, 130)" className="cursor-pointer" onClick={() => setSelectedEntity({ type: 'traffic', data: BENGALURU_TRAFFIC_HOTSPOTS[1] })}>
                <circle r="12" fill="#f97316" fillOpacity="0.3" className="animate-ping" />
                <circle r="7" fill="#f97316" stroke="#fed7aa" strokeWidth="1.5" />
                <text y="3" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold">🚦</text>
                <text y="17" textAnchor="middle" fill="#fed7aa" fontSize="8" fontWeight="600">Hebbal Delay</text>
              </g>
            </svg>

            {/* Bottom floating helper note */}
            <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur border border-slate-800 text-[11px] px-3 py-1.5 rounded-lg text-slate-300 flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-blue-400" />
              <span>Click any node to inspect real-time agent decisions and route telemetrics.</span>
            </div>
          </div>
        </div>

        {/* Dynamic Detail & Inspection Drawer */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between shadow-2xl">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                Node Telemetry & Inspection
              </h3>
              {selectedEntity && (
                <button 
                  onClick={() => setSelectedEntity(null)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {selectedEntity ? (
              <div className="mt-4 space-y-4">
                {selectedEntity.type === 'donation' && (
                  <div>
                    <div className="flex items-start justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                        {selectedEntity.data.donorType.replace('_', ' ')}
                      </span>
                      <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                        selectedEntity.data.status === 'safety_flagged' 
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : selectedEntity.data.status === 'in_transit'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {selectedEntity.data.status.replace('_', ' ')}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-white mt-1">{selectedEntity.data.donorName}</h4>
                    <p className="text-xs text-slate-400">{selectedEntity.data.address}</p>

                    <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800/80">
                      <div className="bg-slate-800/60 p-2.5 rounded-lg">
                        <span className="text-[11px] text-slate-400">Total Food</span>
                        <p className="text-sm font-bold text-white mt-0.5">
                          {selectedEntity.data.totalKg} kg ({selectedEntity.data.totalPortions} meals)
                        </p>
                      </div>
                      <div className="bg-slate-800/60 p-2.5 rounded-lg">
                        <span className="text-[11px] text-slate-400">Avg Temperature</span>
                        <p className="text-sm font-bold text-amber-400 mt-0.5 flex items-center gap-1">
                          <Thermometer className="w-3.5 h-3.5" />
                          {selectedEntity.data.foodItems[0]?.temperatureCelsius || 60}°C
                        </p>
                      </div>
                    </div>

                    {selectedEntity.data.matchPlan && (
                      <div className="mt-3 p-3 bg-blue-950/40 border border-blue-800/40 rounded-xl space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-300 font-medium">Assigned Destination:</span>
                          <span className="text-blue-300 font-bold">{selectedEntity.data.matchPlan.shelterName}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-300 font-medium">Traffic Adjusted ETA:</span>
                          <span className="text-amber-300 font-bold">{selectedEntity.data.matchPlan.trafficTransitMinutes} mins</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-300 font-medium">FSSAI Safety Rating:</span>
                          <span className="text-emerald-400 font-bold">{selectedEntity.data.matchPlan.fssaiSafetyScore} / 100</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {selectedEntity.type === 'shelter' && (
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Verified Shelter</span>
                    <h4 className="text-base font-bold text-white mt-1">{selectedEntity.data.name}</h4>
                    <p className="text-xs text-slate-400">{selectedEntity.data.address}</p>

                    <div className="mt-3 space-y-2">
                      <div className="flex justify-between text-xs bg-slate-800/60 p-2.5 rounded-lg">
                        <span className="text-slate-400">Daily Resident Capacity:</span>
                        <span className="text-white font-bold">{selectedEntity.data.capacity} people</span>
                      </div>
                      <div className="flex justify-between text-xs bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-lg">
                        <span className="text-amber-300">Current Hunger Deficit:</span>
                        <span className="text-amber-400 font-bold">{selectedEntity.data.currentDeficitPortions} meals needed</span>
                      </div>
                      <div className="flex justify-between text-xs bg-slate-800/60 p-2.5 rounded-lg">
                        <span className="text-slate-400">Shelter Coordinator:</span>
                        <span className="text-white font-semibold">{selectedEntity.data.contactPerson} ({selectedEntity.data.phone})</span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedEntity.type === 'volunteer' && (
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-400">Community Delivery Volunteer</span>
                    <h4 className="text-base font-bold text-white mt-1">{selectedEntity.data.name}</h4>
                    <p className="text-xs text-slate-400">Vehicle: {selectedEntity.data.vehicleType.replace('_', ' ')} | Area: {selectedEntity.data.area}</p>

                    <div className="mt-3 space-y-2">
                      <div className="flex justify-between text-xs bg-slate-800/60 p-2.5 rounded-lg">
                        <span className="text-slate-400">Languages:</span>
                        <span className="text-white font-bold uppercase">{selectedEntity.data.languages.join(', ')}</span>
                      </div>
                      <div className="flex justify-between text-xs bg-slate-800/60 p-2.5 rounded-lg">
                        <span className="text-slate-400">Partner Rating:</span>
                        <span className="text-amber-400 font-bold">★ {selectedEntity.data.rating}</span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedEntity.type === 'traffic' && (
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-red-400">Bengaluru Traffic Bottleneck</span>
                    <h4 className="text-base font-bold text-white mt-1">{selectedEntity.data.name}</h4>
                    <p className="text-xs text-slate-400">Congestion Level: {selectedEntity.data.congestionLevel}</p>
                    <div className="mt-3 p-3 bg-red-950/40 border border-red-800/40 rounded-xl">
                      <p className="text-xs text-red-300">
                        Average Corridor Delay: <strong className="text-white font-bold">+{selectedEntity.data.avgDelayMinutes} mins</strong>.
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Agent 2 automatically routes food deliveries around this hotspot or adjusts safe consumption thresholds.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-12 text-center">
                <MapPin className="w-8 h-8 text-slate-600 mx-auto mb-2 animate-bounce" />
                <p className="text-xs text-slate-400 font-medium">Select any node on the Bengaluru map</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  View food safety score, traffic bottlenecks, volunteer routing, or shelter deficit status.
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span>BBMP South, East & West Wards</span>
            <span className="text-emerald-400 font-semibold">100% Traceability</span>
          </div>
        </div>

      </div>
    </div>
  );
};

