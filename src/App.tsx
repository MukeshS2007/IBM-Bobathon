import React, { useState } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { CityGridMap } from './components/CityGridMap';
import { DonorIntakeForm } from './components/DonorIntakeForm';
import { AgentConsole } from './components/AgentConsole';
import { HumanReviewGate } from './components/HumanReviewGate';
import { VolunteerHub } from './components/VolunteerHub';
import { BobStory } from './components/BobStory';
import { ImpactDashboard } from './components/ImpactDashboard';

import { 
  SAMPLE_DONATIONS, 
  INITIAL_SHELTERS, 
  INITIAL_VOLUNTEERS, 
  INITIAL_STATS 
} from './data/mockData';
import { 
  Donation, 
  Shelter, 
  Volunteer, 
  ImpactStats, 
  AgentActionLog, 
  FoodItem, 
  DonorType 
} from './types';
import { orchestrateSurplusMatching } from './services/agentEngine';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('map');
  const [donations, setDonations] = useState<Donation[]>(SAMPLE_DONATIONS);
  const [shelters, setShelters] = useState<Shelter[]>(INITIAL_SHELTERS);
  const [volunteers, setVolunteers] = useState<Volunteer[]>(INITIAL_VOLUNTEERS);
  const [stats, setStats] = useState<ImpactStats>(INITIAL_STATS);
  const [selectedDonationId, setSelectedDonationId] = useState<string | null>(SAMPLE_DONATIONS[0].id);

  // Initial Agent Execution Logs
  const [logs, setLogs] = useState<AgentActionLog[]>([
    {
      id: 'init-1',
      timestamp: '08:15:02',
      agentName: 'SafetyAgent',
      level: 'success',
      message: 'FSSAI Rule Engine initialized with Bengaluru ambient temperature model (29°C average).',
    },
    {
      id: 'init-2',
      timestamp: '08:15:05',
      agentName: 'LogisticsAgent',
      level: 'info',
      message: 'Spatial routing synchronized with 6 major traffic bottlenecks (Silk Board, Hebbal, ORR).',
    },
    {
      id: 'init-3',
      timestamp: '08:15:10',
      agentName: 'MultilingualAgent',
      level: 'info',
      message: 'Kannada (ಕನ್ನಡ), Hindi, and English localized dispatch dictionaries loaded.',
    },
    {
      id: 'init-4',
      timestamp: '08:15:12',
      agentName: 'HumanReviewGate',
      level: 'success',
      message: 'Zero-spoilage human verification gate active. PII mask enabled for volunteer security.',
    }
  ]);

  // Handle new surplus intake submitted by donor
  const handleCreateDonation = (data: {
    donorName: string;
    donorType: DonorType;
    area: string;
    address: string;
    lat: number;
    lng: number;
    foodItems: FoodItem[];
  }) => {
    const totalKg = data.foodItems.reduce((acc, i) => acc + i.quantityKg, 0);
    const totalPortions = data.foodItems.reduce((acc, i) => acc + i.mealPortions, 0);

    const rawDonation: Donation = {
      id: `DON-BLR-${Math.floor(1000 + Math.random() * 9000)}`,
      donorName: data.donorName,
      donorType: data.donorType,
      area: data.area,
      address: data.address,
      lat: data.lat,
      lng: data.lng,
      foodItems: data.foodItems,
      totalPortions,
      totalKg,
      createdAt: new Date().toISOString(),
      status: 'evaluating_safety',
      urgencyScore: 8,
    };

    // Run through the 4-agent fleet!
    const { updatedDonation, logs: newLogs } = orchestrateSurplusMatching(
      rawDonation,
      shelters,
      volunteers
    );

    setDonations(prev => [updatedDonation, ...prev]);
    setLogs(prev => [...newLogs, ...prev]);
    setSelectedDonationId(updatedDonation.id);

    // Update stats
    setStats(prev => ({
      ...prev,
      totalKgRescued: prev.totalKgRescued + totalKg,
      mealsServed: prev.mealsServed + totalPortions,
      co2EmissionsPreventedKg: prev.co2EmissionsPreventedKg + Math.round(totalKg * 1.9),
      activeDonationsCount: prev.activeDonationsCount + 1,
    }));

    // If flagged for safety, route to Human Review Gate, otherwise to Agent Console
    if (updatedDonation.status === 'safety_flagged') {
      setActiveTab('safety_review');
    } else {
      setActiveTab('agents');
    }
  };

  // Food Safety Officer Approves Flagged Donation
  const handleApproveDonation = (donationId: string, notes: string) => {
    setDonations(prev =>
      prev.map(d => {
        if (d.id === donationId && d.matchPlan) {
          return {
            ...d,
            status: 'safety_approved',
            matchPlan: {
              ...d.matchPlan,
              humanReviewRequired: false,
              humanReviewStatus: 'approved',
              humanReviewNotes: notes,
            }
          };
        }
        return d;
      })
    );

    const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs(prev => [
      {
        id: `gate-${Date.now()}`,
        timestamp: time,
        agentName: 'HumanReviewGate',
        level: 'success',
        message: `Safety Officer approved batch ${donationId}. Notes: "${notes}". Volunteer dispatch unblocked!`,
      },
      ...prev
    ]);

    setActiveTab('volunteer');
  };

  // Food Safety Officer Rejects Spoiled Donation
  const handleRejectDonation = (donationId: string, notes: string) => {
    setDonations(prev =>
      prev.map(d => {
        if (d.id === donationId && d.matchPlan) {
          return {
            ...d,
            status: 'rejected_safety',
            matchPlan: {
              ...d.matchPlan,
              humanReviewStatus: 'rejected',
              humanReviewNotes: notes,
            }
          };
        }
        return d;
      })
    );

    const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs(prev => [
      {
        id: `gate-${Date.now()}`,
        timestamp: time,
        agentName: 'HumanReviewGate',
        level: 'warn',
        message: `Safety Officer REJECTED batch ${donationId} for public health risk. Routed to BBMP organic composting.`,
      },
      ...prev
    ]);
  };

  // Volunteer confirms pickup at venue
  const handleConfirmPickup = (donationId: string) => {
    setDonations(prev =>
      prev.map(d => (d.id === donationId ? { ...d, status: 'in_transit' } : d))
    );

    const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs(prev => [
      {
        id: `transit-${Date.now()}`,
        timestamp: time,
        agentName: 'LogisticsAgent',
        level: 'info',
        message: `Courier in transit with batch ${donationId}. Navigating live Bengaluru traffic corridor.`,
      },
      ...prev
    ]);
  };

  // Volunteer confirms delivery at shelter
  const handleConfirmDelivery = (donationId: string, tempAtDelivery: number) => {
    const target = donations.find(d => d.id === donationId);
    if (!target) return;

    setDonations(prev =>
      prev.map(d =>
        d.id === donationId
          ? {
              ...d,
              status: 'verified_complete',
              matchPlan: d.matchPlan
                ? { ...d.matchPlan, temperatureAtHandover: tempAtDelivery }
                : undefined
            }
          : d
      )
    );

    // Update shelter deficit
    if (target.matchPlan) {
      setShelters(prev =>
        prev.map(s => {
          if (s.id === target.matchPlan?.shelterId) {
            return {
              ...s,
              currentDeficitPortions: Math.max(0, s.currentDeficitPortions - target.totalPortions)
            };
          }
          return s;
        })
      );
    }

    const time = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLogs(prev => [
      {
        id: `deliv-${Date.now()}`,
        timestamp: time,
        agentName: 'SafetyAgent',
        level: 'success',
        message: `Batch ${donationId} successfully received at shelter. Handover temp verified at ${tempAtDelivery}°C. 0% Spoilage!`,
      },
      ...prev
    ]);

    setActiveTab('impact');
  };

  const flaggedDonations = donations.filter(d => d.status === 'safety_flagged');
  const activeDonationsCount = donations.filter(
    d => d.status !== 'verified_complete' && d.status !== 'rejected_safety'
  ).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Global Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        pendingReviewCount={flaggedDonations.length}
        activeDonationsCount={activeDonationsCount}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'map' && (
          <CityGridMap
            donations={donations}
            shelters={shelters}
            volunteers={volunteers}
            onSelectDonation={(id) => {
              setSelectedDonationId(id);
              setActiveTab('agents');
            }}
          />
        )}

        {activeTab === 'donate' && (
          <DonorIntakeForm onSubmitDonation={handleCreateDonation} />
        )}

        {activeTab === 'agents' && (
          <AgentConsole
            donations={donations}
            logs={logs}
            selectedDonationId={selectedDonationId}
            onSelectDonation={setSelectedDonationId}
          />
        )}

        {activeTab === 'safety_review' && (
          <HumanReviewGate
            flaggedDonations={flaggedDonations}
            onApproveDonation={handleApproveDonation}
            onRejectDonation={handleRejectDonation}
          />
        )}

        {activeTab === 'volunteer' && (
          <VolunteerHub
            activeDonations={donations}
            onConfirmPickup={handleConfirmPickup}
            onConfirmDelivery={handleConfirmDelivery}
          />
        )}

        {activeTab === 'impact' && (
          <ImpactDashboard
            stats={stats}
            shelters={shelters}
            completedDonations={donations.filter(d => d.status === 'verified_complete')}
          />
        )}

        {activeTab === 'bob_story' && <BobStory />}
      </main>

      {/* Footer with IBM Bobathon Branding */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold">AharaSetu (ಆಹಾರ ಸೇತು)</span>
            <span>•</span>
            <span>IBM Bobathon: Build for Bengaluru</span>
          </div>
          <div>
            Built with <span className="text-blue-400 font-semibold">IBM Bob</span> • Theme 2: More Opportunity, Greater Together
          </div>
        </div>
      </footer>

    </div>
  );
};

export default App;

