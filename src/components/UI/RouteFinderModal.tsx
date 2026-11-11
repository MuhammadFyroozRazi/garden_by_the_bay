import React, { useState } from 'react';
import {
  X,
  Navigation,
  Compass,
  ArrowRight,
  Accessibility,
  Clock,
  MapPin,
  Check,
} from 'lucide-react';
import { POIItem } from '../../types/map';
import { GARDENS_POIS, POPULAR_ROUTES } from '../../data/gardensData';

interface RouteFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyRoute: (fromId: string, toId: string) => void;
  defaultDestination?: POIItem | null;
}

export const RouteFinderModal: React.FC<RouteFinderModalProps> = ({
  isOpen,
  onClose,
  onApplyRoute,
  defaultDestination,
}) => {
  const [fromId, setFromId] = useState<string>('bayfront-plaza');
  const [toId, setToId] = useState<string>(defaultDestination ? defaultDestination.id : 'flower-dome');
  const [isBarrierFreeOnly, setIsBarrierFreeOnly] = useState<boolean>(true);

  if (!isOpen) return null;

  const fromPoi = GARDENS_POIS.find((p) => p.id === fromId);
  const toPoi = GARDENS_POIS.find((p) => p.id === toId);

  // Calculate approximate distance
  let distMeters = 450;
  let walkMins = 6;
  if (fromPoi && toPoi) {
    const dx = (fromPoi.mapCoord.x - toPoi.mapCoord.x) * 2200;
    const dy = (fromPoi.mapCoord.y - toPoi.mapCoord.y) * 1500;
    distMeters = Math.max(120, Math.round(Math.sqrt(dx * dx + dy * dy) * 0.7));
    walkMins = Math.max(2, Math.round(distMeters / 75));
  }

  const handleStartNavigation = () => {
    onApplyRoute(fromId, toId);
    onClose();
  };

  const handleSelectPopularRoute = (route: typeof POPULAR_ROUTES[0]) => {
    setFromId(route.fromId);
    setToId(route.toId);
    onApplyRoute(route.fromId, route.toId);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="route-finder-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 pointer-events-auto"
    >
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <h2 id="route-finder-modal-title" className="text-base font-bold text-white">
                Walking Route Guide
              </h2>
              <p className="text-[11px] text-slate-400">
                Turn-by-turn pedestrian pathfinding across Gardens by the Bay
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Origin & Destination Selectors */}
          <div className="space-y-3 bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/50">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 block">
                Starting Point
              </label>
              <select
                value={fromId}
                onChange={(e) => setFromId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
              >
                {GARDENS_POIS.map((poi) => (
                  <option key={poi.id} value={poi.id}>
                    {poi.numberKey ? `[#${poi.numberKey}] ` : ''}{poi.name} ({poi.categoryLabel})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-center -my-1">
              <div className="w-7 h-7 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center text-xs">
                ↓
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 block">
                Destination
              </label>
              <select
                value={toId}
                onChange={(e) => setToId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-500"
              >
                {GARDENS_POIS.map((poi) => (
                  <option key={poi.id} value={poi.id}>
                    {poi.numberKey ? `[#${poi.numberKey}] ` : ''}{poi.name} ({poi.categoryLabel})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Route Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-800/70 p-3 rounded-xl border border-slate-700/50 flex items-center gap-3">
              <Clock className="w-5 h-5 text-cyan-400" />
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Walk Time</div>
                <div className="text-base font-bold text-white">~{walkMins} mins</div>
              </div>
            </div>

            <div className="bg-slate-800/70 p-3 rounded-xl border border-slate-700/50 flex items-center gap-3">
              <MapPin className="w-5 h-5 text-emerald-400" />
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Distance</div>
                <div className="text-base font-bold text-white">~{distMeters} metres</div>
              </div>
            </div>
          </div>

          {/* Barrier-Free Accessibility Toggle */}
          <label className="flex items-center justify-between p-3 bg-slate-800/40 rounded-xl border border-slate-700/40 cursor-pointer">
            <div className="flex items-center gap-2.5">
              <Accessibility className="w-4 h-4 text-purple-400" />
              <div>
                <span className="text-xs font-semibold text-white block">Barrier-Free Route Only</span>
                <span className="text-[10px] text-slate-400">Avoids staircases; elevator and ramp accessible</span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isBarrierFreeOnly}
              onChange={(e) => setIsBarrierFreeOnly(e.target.checked)}
              className="w-4 h-4 accent-purple-600 rounded"
            />
          </label>

          {/* Popular Curated Routes */}
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Popular Exhibition Itineraries
            </div>
            <div className="space-y-2">
              {POPULAR_ROUTES.map((route, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPopularRoute(route)}
                  className="w-full text-left p-2.5 bg-slate-800/50 hover:bg-slate-800 rounded-xl border border-slate-700/50 hover:border-cyan-500/40 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {route.title}
                    </span>
                    <span className="text-[10px] text-cyan-400 font-mono">
                      {route.walkMinutes} min ({route.distanceMeters}m)
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                    {route.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-4 bg-slate-950 border-t border-slate-800">
          <button
            onClick={handleStartNavigation}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/30 transition-all cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>Show Route on 3D Map</span>
          </button>
        </div>
      </div>
    </div>
  );
};
