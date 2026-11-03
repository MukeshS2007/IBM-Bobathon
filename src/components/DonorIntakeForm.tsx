import React, { useState } from 'react';
import { FoodItem, DonorType } from '../types';
import { Soup, Sparkles, AlertCircle, Plus, Trash2, ArrowRight } from 'lucide-react';

interface DonorIntakeFormProps {
  onSubmitDonation: (data: {
    donorName: string;
    donorType: DonorType;
    area: string;
    address: string;
    lat: number;
    lng: number;
    foodItems: FoodItem[];
  }) => void;
}

export const DonorIntakeForm: React.FC<DonorIntakeFormProps> = ({ onSubmitDonation }) => {
  const [donorName, setDonorName] = useState('');
  const [donorType, setDonorType] = useState<DonorType>('kalyana_mantapa');
  const [area, setArea] = useState('Palace Grounds, Jayamahal');
  const [address, setAddress] = useState('Gate 3, Bellary Road, Bengaluru');
  const [lat, setLat] = useState(12.9984);
  const [lng, setLng] = useState(77.5921);

  const [foodItems, setFoodItems] = useState<FoodItem[]>([
    {
      name: 'Bisi Bele Bath & Ghee Rice',
      quantityKg: 40,
      mealPortions: 95,
      cookedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      temperatureCelsius: 65,
      packagingType: 'sealed_steel_vessels',
      dietaryType: 'pure_veg',
      perishableGrade: 'medium',
    }
  ]);

  // Quick Preset Scenarios for instantaneous testing during Hackathon demo
  const applyPreset = (presetType: 'wedding' | 'tech_park' | 'danger_chutney') => {
    if (presetType === 'wedding') {
      setDonorName('Gayathri Grand Palace Grounds');
      setDonorType('kalyana_mantapa');
      setArea('Palace Grounds, Jayamahal');
      setAddress('Gate 4, Bellary Road, Bengaluru');
      setLat(12.9995);
      setLng(77.5930);
      setFoodItems([
        {
          name: 'Vangi Bath & Curd Rice',
          quantityKg: 50,
          mealPortions: 130,
          cookedAt: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
          temperatureCelsius: 63,
          packagingType: 'sealed_steel_vessels',
          dietaryType: 'pure_veg',
          perishableGrade: 'medium',
        },
        {
          name: 'Mysore Pak & Kheer',
          quantityKg: 20,
          mealPortions: 110,
          cookedAt: new Date(Date.now() - 80 * 60 * 1000).toISOString(),
          temperatureCelsius: 45,
          packagingType: 'insulated_containers',
          dietaryType: 'pure_veg',
          perishableGrade: 'medium',
        }
      ]);
    } else if (presetType === 'tech_park') {
      setDonorName('Manyata Embassy Business Park (Cafeteria Block G)');
      setDonorType('tech_park');
      setArea('Hebbal / Nagavara');
      setAddress('Outer Ring Road, Thanisandra Main Rd, Bengaluru');
      setLat(13.0489);
      setLng(77.6205);
      setFoodItems([
        {
          name: 'Dal Makhani & Steamed Basmati Rice',
          quantityKg: 35,
          mealPortions: 85,
          cookedAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
          temperatureCelsius: 68,
          packagingType: 'foil_boxes',
          dietaryType: 'pure_veg',
          perishableGrade: 'high',
        }
      ]);
    } else if (presetType === 'danger_chutney') {
      setDonorName('Malleshwaram Traditional Bhavan');
      setDonorType('restaurant');
      setArea('Malleshwaram 8th Cross');
      setAddress('Sampige Road, Malleshwaram, Bengaluru');
      setLat(13.0039);
      setLng(77.5688);
      setFoodItems([
        {
          name: 'Leftover Coconut Chutney & Idlis',
          quantityKg: 18,
          mealPortions: 50,
          cookedAt: new Date(Date.now() - 200 * 60 * 1000).toISOString(), // >3 hours ago
          temperatureCelsius: 31, // Room temp danger zone
          packagingType: 'loose_open',
          dietaryType: 'pure_veg',
          perishableGrade: 'high',
        }
      ]);
    }
  };

  const handleAddItem = () => {
    setFoodItems([
      ...foodItems,
      {
        name: '',
        quantityKg: 15,
        mealPortions: 35,
        cookedAt: new Date().toISOString(),
        temperatureCelsius: 60,
        packagingType: 'sealed_steel_vessels',
        dietaryType: 'pure_veg',
        perishableGrade: 'medium',
      }
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setFoodItems(foodItems.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof FoodItem, value: any) => {
    const updated = [...foodItems];
    updated[index] = { ...updated[index], [field]: value };
    setFoodItems(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName.trim() || foodItems.length === 0) return;

    onSubmitDonation({
      donorName,
      donorType,
      area,
      address,
      lat,
      lng,
      foodItems
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Banner & Demo Presets */}
      <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-blue-500/10 border border-amber-500/20 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Soup className="w-5 h-5 text-amber-400" />
              Surplus Food Incident Intake
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Input surplus details. The <strong>IBM Bob-architected agent fleet</strong> will instantly triage safety, calculate Bengaluru traffic corridors, and dispatch nearby verified shelters.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Demo Presets:
            </span>
            <button
              type="button"
              onClick={() => applyPreset('wedding')}
              className="px-2.5 py-1 text-xs rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 font-medium"
            >
              🏛️ Wedding (130 meals)
            </button>
            <button
              type="button"
              onClick={() => applyPreset('tech_park')}
              className="px-2.5 py-1 text-xs rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30 hover:bg-blue-500/30 font-medium"
            >
              🏢 Tech Park (85 meals)
            </button>
            <button
              type="button"
              onClick={() => applyPreset('danger_chutney')}
              className="px-2.5 py-1 text-xs rounded-lg bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 font-medium"
              title="Test FSSAI Human Review Gate"
            >
              ⚠️ Safety Flag Demo
            </button>
          </div>
        </div>
      </div>

      {/* Main Intake Form */}
      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        
        {/* Donor Entity Details */}
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 pb-2 border-b border-slate-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            1. Donor & Source Facility
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Facility / Event Name *
              </label>
              <input
                type="text"
                required
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                placeholder="e.g. Sheesh Mahal Palace Grounds"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Donor Type
              </label>
              <select
                value={donorType}
                onChange={(e) => setDonorType(e.target.value as DonorType)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="kalyana_mantapa">Wedding Hall (Kalyana Mantapa)</option>
                <option value="tech_park">Tech Park / Corporate Cafeteria</option>
                <option value="restaurant">Darshini / Restaurant</option>
                <option value="community_event">Community Banquet / Puja</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Bengaluru Locality / Area *
              </label>
              <input
                type="text"
                required
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="e.g. Whitefield, Bellandur, Palace Grounds"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Exact Pickup Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Gate 3, Near Main Stage, Jayamahal Road"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* Food Items & FSSAI Safety Telemetry */}
        <div>
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              2. Food Items & Safety Parameters
            </h3>
            <button
              type="button"
              onClick={handleAddItem}
              className="text-xs px-2.5 py-1 bg-slate-800 text-amber-400 hover:text-white hover:bg-slate-700 rounded-lg flex items-center gap-1 font-semibold transition"
            >
              <Plus className="w-3.5 h-3.5" /> Add Food Category
            </button>
          </div>

          <div className="space-y-4">
            {foodItems.map((item, idx) => (
              <div key={idx} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400">Item #{idx + 1}</span>
                  {foodItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="text-slate-500 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Dish Description *
                    </label>
                    <input
                      type="text"
                      required
                      value={item.name}
                      onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                      placeholder="e.g. Bisi Bele Bath with Boondi"
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Dietary Classification
                    </label>
                    <select
                      value={item.dietaryType}
                      onChange={(e) => handleItemChange(idx, 'dietaryType', e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="pure_veg">Pure Vegetarian (South/North)</option>
                      <option value="jain_veg">Jain Vegetarian (No onion/garlic)</option>
                      <option value="non_veg">Non-Vegetarian</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Estimated Weight (kg)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantityKg}
                      onChange={(e) => handleItemChange(idx, 'quantityKg', Number(e.target.value))}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Meal Portions (People)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={item.mealPortions}
                      onChange={(e) => handleItemChange(idx, 'mealPortions', Number(e.target.value))}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Current Temp (°C)
                    </label>
                    <input
                      type="number"
                      value={item.temperatureCelsius}
                      onChange={(e) => handleItemChange(idx, 'temperatureCelsius', Number(e.target.value))}
                      className={`w-full px-3 py-1.5 bg-slate-900 border rounded-lg text-xs text-white focus:ring-2 ${
                        item.temperatureCelsius < 60 && item.temperatureCelsius > 5
                          ? 'border-amber-500/80 text-amber-300'
                          : 'border-slate-700'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Packaging Type
                    </label>
                    <select
                      value={item.packagingType}
                      onChange={(e) => handleItemChange(idx, 'packagingType', e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="sealed_steel_vessels">Sealed Steel Vessels (Best)</option>
                      <option value="insulated_containers">Insulated Thermal Hot-Boxes</option>
                      <option value="foil_boxes">Foil Sealed Meal Boxes</option>
                      <option value="loose_open">Loose / Open Containers (Risk)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Perishability Risk
                    </label>
                    <select
                      value={item.perishableGrade}
                      onChange={(e) => handleItemChange(idx, 'perishableGrade', e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="high">High (Coconut/Dairy/Paneer/Curd)</option>
                      <option value="medium">Medium (Cooked Rice/Sambar/Roti)</option>
                      <option value="low">Low (Dry Bread/Biscuits/Sweets)</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Action */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Total Batch: <strong className="text-white font-bold">{foodItems.reduce((acc, i) => acc + i.quantityKg, 0)} kg</strong> ({foodItems.reduce((acc, i) => acc + i.mealPortions, 0)} meals)
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            <span>Trigger Agentic Matching Pipeline</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </form>
    </div>
  );
};

