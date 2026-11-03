import React, { useState } from 'react';
import { Donation } from '../types';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  UserCheck, 
  EyeOff, 
  Thermometer, 
  Clock, 
  FileCheck
} from 'lucide-react';

interface HumanReviewGateProps {
  flaggedDonations: Donation[];
  onApproveDonation: (donationId: string, notes: string) => void;
  onRejectDonation: (donationId: string, notes: string) => void;
}

export const HumanReviewGate: React.FC<HumanReviewGateProps> = ({
  flaggedDonations,
  onApproveDonation,
  onRejectDonation,
}) => {
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});
  const [maskPrivacy, setMaskPrivacy] = useState(true);

  const handleNoteChange = (id: string, note: string) => {
    setReviewNotes(prev => ({ ...prev, [id]: note }));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Privacy & Safety Overview Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Human-in-the-Loop Food Safety & Privacy Gate
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 font-semibold">
                  Hackathon Requirement
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Food Safety Officers verify anomalous batches before dispatch to protect shelter residents from food-borne risks.
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Shield Toggle */}
        <div className="flex items-center gap-3 bg-slate-800/80 px-3.5 py-2 rounded-xl border border-slate-700">
          <EyeOff className="w-4 h-4 text-emerald-400" />
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold text-white">Privacy Protection Mode</span>
            <span className="text-[10px] text-slate-400">Mask PII & donor contacts</span>
          </div>
          <button
            type="button"
            onClick={() => setMaskPrivacy(!maskPrivacy)}
            className={`ml-2 w-10 h-5 flex items-center rounded-full p-1 transition-colors ${
              maskPrivacy ? 'bg-emerald-500' : 'bg-slate-600'
            }`}
          >
            <div
              className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform ${
                maskPrivacy ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Review Queue */}
      {flaggedDonations.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center">
          <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">All Active Batches are Cleared</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            No pending safety violations or danger zone anomalies. The autonomous agent fleet is currently running with 100% verified compliance.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {flaggedDonations.map((donation) => {
            const plan = donation.matchPlan;
            return (
              <div
                key={donation.id}
                className="bg-slate-900 border-2 border-amber-500/30 rounded-2xl p-6 shadow-xl space-y-5"
              >
                
                {/* Header Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-amber-400">
                        {donation.id}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Autonomous Dispatch Paused
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-white mt-1">
                      {donation.donorName}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {donation.area} • {maskPrivacy ? 'Address masked for volunteer privacy' : donation.address}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[11px] text-slate-400">FSSAI Safety Rating</span>
                      <p className="text-lg font-extrabold text-amber-400">
                        {plan?.fssaiSafetyScore || 45} / 100
                      </p>
                    </div>
                  </div>
                </div>

                {/* Flagged Food Items & Temperature Telemetry */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <Thermometer className="w-4 h-4 text-red-400" />
                      Food Safety Telemetry
                    </h4>
                    
                    <div className="space-y-2">
                      {donation.foodItems.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-900 border border-slate-800">
                          <div>
                            <span className="font-semibold text-white">{item.name}</span>
                            <p className="text-[10px] text-slate-400">
                              {item.quantityKg} kg • {item.packagingType.replace('_', ' ')}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`font-bold ${
                              item.temperatureCelsius < 60 && item.temperatureCelsius > 5
                                ? 'text-red-400'
                                : 'text-emerald-400'
                            }`}>
                              {item.temperatureCelsius}°C
                            </span>
                            <p className="text-[10px] text-slate-500">
                              {item.temperatureCelsius < 60 && item.temperatureCelsius > 5 ? 'Danger Zone' : 'Safe Hot'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* FSSAI Auditor Remarks */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-amber-400" />
                      Agent 1 (FSSAI Rules Engine) Flags
                    </h4>

                    <div className="space-y-1.5 text-xs">
                      {plan?.fssaiRemarks.map((remark, rIdx) => (
                        <div key={rIdx} className="flex items-start gap-2 text-slate-300 bg-amber-500/5 p-2 rounded-lg border border-amber-500/10">
                          <span className="text-amber-400 text-sm leading-none">•</span>
                          <span className="leading-relaxed">{remark}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Human Review Input & Action Form */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <label className="block text-xs font-bold text-slate-300">
                    Food Safety Officer Certification Notes:
                  </label>
                  <input
                    type="text"
                    value={reviewNotes[donation.id] || ''}
                    onChange={(e) => handleNoteChange(donation.id, e.target.value)}
                    placeholder="e.g. Inspected via phone video; coconut chutney instructed to be discarded; idlis safe to distribute."
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                    <p className="text-[11px] text-slate-400">
                      Authorizing will immediately unlock multilingual dispatch to volunteer <strong>{plan?.volunteerName}</strong>.
                    </p>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        type="button"
                        onClick={() => onRejectDonation(donation.id, reviewNotes[donation.id] || 'Rejected for safety: Microbial spoilage risk')}
                        className="flex-1 sm:flex-none px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Reject & Route to Composting
                      </button>

                      <button
                        type="button"
                        onClick={() => onApproveDonation(donation.id, reviewNotes[donation.id] || 'Verified and approved with food safety precautions.')}
                        className="flex-1 sm:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-emerald-600/20 transition flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Authorize Volunteer Dispatch
                      </button>
                    </div>
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

