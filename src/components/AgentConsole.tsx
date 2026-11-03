import React, { useState } from 'react';
import { Donation, AgentActionLog } from '../types';
import { 
  Cpu, 
  ShieldCheck, 
  Navigation, 
  Languages, 
  UserCheck, 
  CheckCircle, 
  AlertTriangle, 
  Terminal, 
  Clock, 
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface AgentConsoleProps {
  donations: Donation[];
  logs: AgentActionLog[];
  selectedDonationId: string | null;
  onSelectDonation: (id: string) => void;
}

export const AgentConsole: React.FC<AgentConsoleProps> = ({
  donations,
  logs,
  selectedDonationId,
  onSelectDonation,
}) => {
  const currentDonation = donations.find(d => d.id === selectedDonationId) || donations[0];

  const agentFleet = [
    {
      id: 'SafetyAgent',
      name: 'Food Quality & Safety Inspector',
      icon: ShieldCheck,
      role: 'Evaluates cooking time, storage temp against FSSAI guidelines & calculates safe transit window.',
      status: currentDonation?.status === 'safety_flagged' ? 'flagged' : 'active',
      badge: 'FSSAI Certified'
    },
    {
      id: 'LogisticsAgent',
      name: 'Bengaluru Logistics & Corridor Matcher',
      icon: Navigation,
      role: 'Pairs donor with nearest shelter accounting for Silk Board/Hebbal delays and volunteer vehicle volume.',
      status: 'active',
      badge: 'Spatial AI'
    },
    {
      id: 'MultilingualAgent',
      name: 'Multilingual Dispatcher',
      icon: Languages,
      role: 'Synthesizes native Kannada (ಕನ್ನಡ), Hindi and English delivery dispatches with landmarks.',
      status: 'active',
      badge: 'Kannada / Hi / En'
    },
    {
      id: 'HumanReviewGate',
      name: 'Human Review & Privacy Gate',
      icon: UserCheck,
      role: 'Holds anomalous food batches for Safety Officer approval and anonymizes donor private contacts.',
      status: currentDonation?.status === 'safety_flagged' ? 'pending_action' : 'verified',
      badge: 'Zero Spoilage HITL'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Active Donation Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-600/20 text-blue-400 rounded-lg">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Agentic Orchestration Console</h2>
              <p className="text-xs text-slate-400">
                Autonomous multi-agent collaboration built with <strong>IBM Bob</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-medium">Inspecting Batch:</span>
          <select
            value={currentDonation?.id || ''}
            onChange={(e) => onSelectDonation(e.target.value)}
            className="px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs font-semibold text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {donations.map((d) => (
              <option key={d.id} value={d.id}>
                {d.id} — {d.donorName.slice(0, 32)}... ({d.totalKg} kg)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4 Agent Fleet Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {agentFleet.map((agent) => {
          const Icon = agent.icon;
          return (
            <div
              key={agent.id}
              className={`p-4 rounded-xl border transition-all ${
                agent.status === 'flagged' || agent.status === 'pending_action'
                  ? 'bg-amber-950/20 border-amber-500/40 shadow-lg shadow-amber-500/10'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="p-2 rounded-lg bg-slate-800 text-amber-400">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-blue-500/10 text-blue-300 border border-blue-500/20">
                  {agent.badge}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white mt-3">{agent.name}</h3>
              <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                {agent.role}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Autonomous State:</span>
                {agent.status === 'flagged' || agent.status === 'pending_action' ? (
                  <span className="text-amber-400 font-semibold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Flagged for Review
                  </span>
                ) : (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Optimal Sync
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Pipeline Execution Visualizer */}
      {currentDonation && currentDonation.matchPlan && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Active Agent Pipeline Trace: {currentDonation.id}
            </h3>
            <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-medium">
              Source: {currentDonation.donorName}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Step 1 Result */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                1. Safety Assessment
              </span>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">FSSAI Score:</span>
                <span className={`text-base font-extrabold ${
                  currentDonation.matchPlan.fssaiSafetyScore > 75 ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  {currentDonation.matchPlan.fssaiSafetyScore} / 100
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Safe Window:</span>
                <span className="text-xs font-bold text-white">{currentDonation.matchPlan.safeWindowMinutes} mins remaining</span>
              </div>
              <p className="text-[11px] text-slate-400 italic pt-1 border-t border-slate-800/80">
                {currentDonation.matchPlan.fssaiRemarks[0] || 'Standard hot temperature threshold observed.'}
              </p>
            </div>

            {/* Step 2 Result */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                2. Spatial & Traffic Routing
              </span>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Paired Shelter:</span>
                <span className="text-xs font-bold text-emerald-400 truncate max-w-[140px] text-right">
                  {currentDonation.matchPlan.shelterName}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Calculated Transit:</span>
                <span className="text-xs font-bold text-amber-300">
                  {currentDonation.matchPlan.trafficTransitMinutes} mins (Delay: +{currentDonation.matchPlan.trafficDelayMinutes}m)
                </span>
              </div>
              <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80">
                Route: {currentDonation.matchPlan.trafficRoute}
              </p>
            </div>

            {/* Step 3 Result */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                3. Dispatch & Security Gate
              </span>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Assigned Volunteer:</span>
                <span className="text-xs font-bold text-white">{currentDonation.matchPlan.volunteerName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Pickup Security Code:</span>
                <span className="text-xs font-mono font-bold text-amber-400">{currentDonation.matchPlan.pickupCode}</span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                <span className="text-xs text-slate-400">Human Review Status:</span>
                <span className={`text-[11px] px-2 py-0.5 rounded font-bold ${
                  currentDonation.matchPlan.humanReviewStatus === 'pending'
                    ? 'bg-amber-500/20 text-amber-300'
                    : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {currentDonation.matchPlan.humanReviewStatus.toUpperCase()}
                </span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Live Agent Terminal Logs */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-2xl font-mono text-xs">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-slate-400">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-slate-200">Autonomous Reasoning Execution Stream</span>
          </div>
          <span className="text-[11px] text-slate-500">Live Agent Event Bus</span>
        </div>

        <div className="space-y-2 max-h-72 overflow-y-auto pr-2 no-scrollbar">
          {logs.map((log) => {
            const levelColor = 
              log.level === 'warn' ? 'text-amber-400' :
              log.level === 'decision' ? 'text-blue-400 font-semibold' :
              log.level === 'success' ? 'text-emerald-400' : 'text-slate-300';

            return (
              <div key={log.id} className="flex items-start gap-3 py-1 hover:bg-slate-900/50 px-2 rounded transition">
                <span className="text-slate-500 text-[11px] flex-shrink-0">{log.timestamp}</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-semibold flex-shrink-0">
                  {log.agentName}
                </span>
                <span className={`${levelColor} flex-1 leading-relaxed`}>
                  {log.message}
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

