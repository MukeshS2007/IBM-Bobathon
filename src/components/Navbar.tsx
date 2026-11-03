import React from 'react';
import { 
  Soup, 
  MapPin, 
  Cpu, 
  ShieldCheck, 
  Smartphone, 
  Sparkles, 
  BarChart3, 
  Bell,
  HeartHandshake
} from 'lucide-react';

export type NavTab = 
  | 'map' 
  | 'donate' 
  | 'agents' 
  | 'safety_review' 
  | 'volunteer' 
  | 'bob_story' 
  | 'impact';

interface NavbarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  pendingReviewCount: number;
  activeDonationsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  pendingReviewCount,
  activeDonationsCount
}) => {
  const navItems = [
    { id: 'map' as NavTab, label: 'Live City Grid', icon: MapPin },
    { id: 'donate' as NavTab, label: 'Report Surplus', icon: Soup, badge: activeDonationsCount > 0 ? activeDonationsCount : undefined },
    { id: 'agents' as NavTab, label: 'Agentic Console', icon: Cpu },
    { 
      id: 'safety_review' as NavTab, 
      label: 'Human Review Gate', 
      icon: ShieldCheck, 
      badge: pendingReviewCount > 0 ? pendingReviewCount : undefined,
      badgeColor: 'bg-amber-500' 
    },
    { id: 'volunteer' as NavTab, label: 'Volunteer Hub', icon: Smartphone },
    { id: 'impact' as NavTab, label: 'Measurable Impact', icon: BarChart3 },
    { id: 'bob_story' as NavTab, label: 'Built with IBM Bob', icon: Sparkles, highlight: true },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onTabChange('map')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20 text-white font-bold text-xl">
              🍲
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-extrabold tracking-tight text-white">
                  Ahara<span className="text-amber-400">Setu</span>
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-medium">
                  ಆಹಾರ ಸೇತು
                </span>
                <span className="hidden md:inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-blue-600/20 border border-blue-500/40 text-blue-300 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                  Built with IBM Bob
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Autonomous Surplus Food & Hunger Matching for Bengaluru
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`relative flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? item.highlight
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 ring-1 ring-blue-400/30'
                        : 'bg-slate-800 text-amber-400 border border-slate-700 shadow-sm'
                      : item.highlight
                      ? 'text-blue-300 hover:text-white hover:bg-blue-950/60 border border-blue-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? (item.highlight ? 'text-white' : 'text-amber-400') : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold text-slate-950 ${item.badgeColor || 'bg-amber-400'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* City & Live Status Indicator */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex flex-col text-right">
              <span className="text-[11px] font-semibold text-emerald-400 flex items-center justify-end gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block"></span>
                Bengaluru Grid Active
              </span>
              <span className="text-[10px] text-slate-400">BBMP Zone Integration</span>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Tab Bar */}
      <div className="lg:hidden flex overflow-x-auto py-2 px-3 space-x-1 border-t border-slate-800/80 bg-slate-900/90 no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex-shrink-0 flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-300 bg-slate-800/70'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
              {item.badge !== undefined && (
                <span className="px-1 rounded-full text-[10px] bg-slate-900 text-white font-bold">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};

