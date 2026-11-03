import React, { useState } from 'react';
import { Donation } from '../types';
import { 
  Smartphone, 
  MapPin, 
  Navigation, 
  Languages, 
  CheckCircle2, 
  Copy, 
  Check, 
  Share2, 
  Clock, 
  Thermometer, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface VolunteerHubProps {
  activeDonations: Donation[];
  onConfirmPickup: (donationId: string) => void;
  onConfirmDelivery: (donationId: string, tempAtDelivery: number) => void;
}

export const VolunteerHub: React.FC<VolunteerHubProps> = ({
  activeDonations,
  onConfirmPickup,
  onConfirmDelivery,
}) => {
  const [selectedLanguage, setSelectedLanguage] = useState<'kn' | 'en' | 'hi'>('kn');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [inputDeliveryTemp, setInputDeliveryTemp] = useState<number>(62);

  // Filter donations that have reached dispatch or transit
  const dispatchQueue = activeDonations.filter(
    d => d.status === 'dispatched' || d.status === 'in_transit' || d.status === 'safety_approved'
  );

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Volunteer Mobile Dispatch Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              Volunteer & Courier Dispatch Hub
              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                PWA Ready
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Multilingual dispatch instructions synthesized by Agent 3 in native Bengaluru languages.
            </p>
          </div>
        </div>

        {/* Language Selector */}
        <div className="flex items-center gap-2 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
          <button
            type="button"
            onClick={() => setSelectedLanguage('kn')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              selectedLanguage === 'kn'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            ಕನ್ನಡ (Kannada)
          </button>
          <button
            type="button"
            onClick={() => setSelectedLanguage('en')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              selectedLanguage === 'en'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setSelectedLanguage('hi')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              selectedLanguage === 'hi'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            हिंदी (Hindi)
          </button>
        </div>
      </div>

      {/* Dispatch Cards */}
      {dispatchQueue.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
          <Clock className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No Pending Dispatches</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            All active surplus batches have been safely delivered or are undergoing quality review.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {dispatchQueue.map((donation) => {
            const plan = donation.matchPlan;
            if (!plan) return null;
            const message = plan.instructions[selectedLanguage] || plan.instructions.en;

            return (
              <div
                key={donation.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5"
              >
                
                {/* Header & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-400">
                      {donation.id}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 font-semibold">
                      Assigned to: {plan.volunteerName} ({plan.volunteerVehicle.replace('_', ' ')})
                    </span>
                  </div>

                  <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase ${
                    donation.status === 'in_transit'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {donation.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Multilingual Dispatch Message Banner */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold flex items-center gap-1.5 text-amber-400">
                      <Languages className="w-4 h-4" />
                      Multilingual Driver Dispatch Instruction
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(message, donation.id)}
                      className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 transition"
                    >
                      {copiedId === donation.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy WhatsApp Text</span>
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-sm font-medium text-slate-200 leading-relaxed font-sans">
                    {message}
                  </p>
                </div>

                {/* Navigation & Traffic Corridor Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/60 flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                      <Navigation className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400">Traffic Corridor Advisory</p>
                      <p className="text-xs font-bold text-white mt-0.5">{plan.trafficRoute}</p>
                    </div>
                  </div>

                  <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/60 flex items-center gap-3">
                    <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400">ETA & Remaining Safe Window</p>
                      <p className="text-xs font-bold text-amber-300 mt-0.5">
                        {plan.trafficTransitMinutes} mins trip (Safe window: {plan.safeWindowMinutes} mins)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Secure Handover Protocol */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-6">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Step 1: Pickup Code</span>
                      <p className="text-sm font-mono font-extrabold text-amber-400">{plan.pickupCode}</p>
                    </div>
                    <div className="h-8 w-px bg-slate-800"></div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Step 2: Drop Code</span>
                      <p className="text-sm font-mono font-extrabold text-emerald-400">{plan.deliveryCode}</p>
                    </div>
                  </div>

                  {/* Action Handover Triggers */}
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    {donation.status !== 'in_transit' ? (
                      <button
                        type="button"
                        onClick={() => onConfirmPickup(donation.id)}
                        className="w-full md:w-auto px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Confirm Food Pickup at Venue
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 w-full md:w-auto">
                        <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1">
                          <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                          <input
                            type="number"
                            value={inputDeliveryTemp}
                            onChange={(e) => setInputDeliveryTemp(Number(e.target.value))}
                            className="w-12 bg-transparent text-xs text-white font-bold text-center focus:outline-none"
                            title="Handover probe temp"
                          />
                          <span className="text-[10px] text-slate-400">°C</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => onConfirmDelivery(donation.id, inputDeliveryTemp)}
                          className="w-full md:w-auto px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-md"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Verify & Complete Shelter Delivery
                        </button>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

