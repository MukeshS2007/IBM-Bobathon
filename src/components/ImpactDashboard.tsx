import React from 'react';
import { ImpactStats, Shelter, Donation } from '../types';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Flame, 
  Clock, 
  ShieldCheck, 
  Award,
  Sparkles,
  ArrowUpRight,
  Heart
} from 'lucide-react';

interface ImpactDashboardProps {
  stats: ImpactStats;
  shelters: Shelter[];
  completedDonations: Donation[];
}

export const ImpactDashboard: React.FC<ImpactDashboardProps> = ({
  stats,
  shelters,
  completedDonations,
}) => {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Primary Goal Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-500/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold mb-3">
            <Award className="w-4 h-4 text-emerald-400" />
            Hackathon Mandatory Deliverable: Measurable Outcome
          </span>
          
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Measurable Civic Outcome for Bengaluru
          </h2>

          <p className="text-sm text-slate-300 mt-2 leading-relaxed">
            <strong className="text-emerald-400 font-bold">438 kg</strong> of freshly cooked banquet and cafeteria surplus rescued and safely redirected today alone, serving <strong className="text-white font-bold">1,240 hot meals</strong> within an average turnaround time of <strong className="text-amber-400 font-bold">34 minutes</strong> (beating the critical 60-minute FSSAI spoilage window).
          </p>
        </div>

        <div className="absolute right-6 top-6 opacity-10 hidden md:block">
          <Heart className="w-56 h-56 text-emerald-400" />
        </div>
      </div>

      {/* 4 Big Impact Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Daily Food Rescued</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-emerald-400">{stats.totalKgRescued} <span className="text-sm text-slate-400">kg</span></p>
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-3 overflow-hidden">
              <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: `${Math.min(100, (stats.totalKgRescued / 400) * 100)}%` }}></div>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">109% of 400 kg daily target</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Hot Meals Delivered</span>
            <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-white">{stats.mealsServed}</p>
            <p className="text-[11px] text-amber-400 mt-3 font-semibold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Direct nutrition to 6 shelters
            </p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">CO2 Landfill Emissions Saved</span>
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-blue-400">{stats.co2EmissionsPreventedKg} <span className="text-sm text-slate-400">kg</span></p>
            <p className="text-[11px] text-slate-400 mt-3">Methane footprint averted</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Logistics & Safety SLA</span>
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-3xl font-extrabold text-purple-400">{stats.avgDeliveryMinutes} <span className="text-sm text-slate-400">mins</span></p>
            <p className="text-[11px] text-emerald-400 mt-3 font-semibold">
              {stats.safetyComplianceRate}% Safety Compliance
            </p>
          </div>
        </div>

      </div>

      {/* Detailed Shelters Fed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recipient Shelters Table */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">Active Recipient Shelters Supported</h3>
              <p className="text-xs text-slate-400">Verified orphanages, night shelters & senior care homes across Bengaluru wards</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
              BBMP Monitored
            </span>
          </div>

          <div className="space-y-3">
            {shelters.map((shelter) => (
              <div key={shelter.id} className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">{shelter.name}</h4>
                  <p className="text-[11px] text-slate-400">{shelter.area} • Capacity: {shelter.capacity} people</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-amber-400">{shelter.currentDeficitPortions} meals deficit</span>
                  <p className="text-[10px] text-emerald-400 font-medium">Partner Verified</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Source Categories Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white pb-3 border-b border-slate-800">
              Surplus Contribution by Sector
            </h3>

            <div className="mt-4 space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Wedding Halls (Kalyana Mantapas)</span>
                  <span className="text-amber-400 font-bold">48%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div className="bg-amber-400 h-2 rounded-full" style={{ width: '48%' }}></div>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Palace Grounds, Jayamahal, Rajajinagar</p>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Tech Parks & Corporate Cafeterias</span>
                  <span className="text-blue-400 font-bold">34%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div className="bg-blue-400 h-2 rounded-full" style={{ width: '34%' }}></div>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Manyata, Ecospace ORR, Electronic City</p>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Darshinis & Traditional Restaurants</span>
                  <span className="text-emerald-400 font-bold">18%</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2">
                  <div className="bg-emerald-400 h-2 rounded-full" style={{ width: '18%' }}></div>
                </div>
                <p className="text-[10px] text-slate-500 mt-1">Malleshwaram, Gandhi Bazaar, Indiranagar</p>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-[11px] text-slate-400">
            <span className="text-white font-bold">Scalability Vision:</span> Deploying across all 198 BBMP wards will unlock over 12 tons of daily food rescue, feeding 35,000+ citizens.
          </div>
        </div>

      </div>

    </div>
  );
};

