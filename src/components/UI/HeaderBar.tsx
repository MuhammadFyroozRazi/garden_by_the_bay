import React from 'react';
import {
  Compass,
  Sun,
  Sunset,
  Moon,
  Volume2,
  VolumeX,
  QrCode,
  Route,
  Sparkles,
  Info,
} from 'lucide-react';
import { TimeOfDayMode } from '../../types/map';

interface HeaderBarProps {
  timeOfDay: TimeOfDayMode;
  setTimeOfDay: (mode: TimeOfDayMode) => void;
  audioActive: boolean;
  toggleAudio: () => void;
  onOpenQR: () => void;
  onOpenRouteFinder: () => void;
  onSelectPreset: (preset: 'overview' | 'supertree' | 'conservatory' | 'meadow' | 'children' | 'heritage') => void;
  activePreset: string;
  isKioskMode: boolean;
  setIsKioskMode: (val: boolean) => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  timeOfDay,
  setTimeOfDay,
  audioActive,
  toggleAudio,
  onOpenQR,
  onOpenRouteFinder,
  onSelectPreset,
  activePreset,
  isKioskMode,
  setIsKioskMode,
}) => {
  return (
    <header className="absolute top-0 left-0 right-0 z-30 pointer-events-none p-3 sm:p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3 w-full">
        {/* Brand Identity */}
        <div className="pointer-events-auto flex items-center gap-3 bg-slate-900/90 text-white px-4 py-2.5 rounded-2xl border border-slate-700/60 shadow-2xl">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 via-purple-600 to-amber-400 p-0.5 flex items-center justify-center shadow-lg">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-amber-200 via-pink-200 to-white bg-clip-text text-transparent">
                Gardens by the Bay
              </span>
              <span className="hidden sm:inline-block text-[10px] font-semibold uppercase tracking-wider bg-purple-500/30 text-purple-200 px-2 py-0.5 rounded-md border border-purple-500/40">
                Bay South
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden md:block">
              Interactive 3D Exhibition Map & Navigator
            </p>
          </div>
        </div>

        {/* Quick View Presets (Desktop & Touchscreen) */}
        <nav aria-label="Quick Landmarks" className="pointer-events-auto hidden lg:flex items-center gap-1.5 bg-slate-900/85 px-3 py-1.5 rounded-2xl border border-slate-700/60 shadow-xl">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'supertree', label: 'Supertree Grove' },
            { id: 'conservatory', label: 'Conservatories' },
            { id: 'meadow', label: 'The Meadow' },
            { id: 'children', label: 'Children\'s Garden' },
            { id: 'heritage', label: 'Heritage Gardens' },
          ].map((preset) => (
            <button
              key={preset.id}
              onClick={() => onSelectPreset(preset.id as 'overview' | 'supertree' | 'conservatory' | 'meadow' | 'children' | 'heritage')}
              className={`text-xs font-medium px-3 py-1.5 rounded-xl transition-all duration-200 cursor-pointer ${
                activePreset === preset.id
                  ? 'bg-purple-600 text-white shadow-md font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </nav>

        {/* Right Tools & Modals */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Route Finder Button */}
          <button
            onClick={onOpenRouteFinder}
            className="flex items-center gap-1.5 bg-slate-900/90 hover:bg-slate-800 text-cyan-300 hover:text-white px-3.5 py-2 rounded-xl border border-cyan-500/30 hover:border-cyan-400 text-xs font-semibold shadow-lg transition-all cursor-pointer"
            title="Plan walking route"
          >
            <Route className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Directions</span>
          </button>

          {/* Time of Day Switcher */}
          <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-700/60 shadow-lg">
            <button
              onClick={() => setTimeOfDay('day')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                timeOfDay === 'day'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Day Mode (Lush Tropical Sun)"
            >
              <Sun className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTimeOfDay('sunset')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                timeOfDay === 'sunset'
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Sunset Mode (Golden Hour)"
            >
              <Sunset className="w-4 h-4" />
            </button>
            <button
              onClick={() => setTimeOfDay('night')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                timeOfDay === 'night'
                  ? 'bg-purple-500/30 text-pink-300 border border-purple-500/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Night Mode (Garden Rhapsody Light Show)"
            >
              <Moon className="w-4 h-4" />
            </button>
          </div>

          {/* Audio Synthesizer */}
          <button
            onClick={toggleAudio}
            className={`p-2 rounded-xl border transition-all cursor-pointer shadow-lg ${
              audioActive
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-900/90 text-slate-400 border-slate-700/60 hover:text-white hover:bg-slate-800'
            }`}
            title={audioActive ? 'Mute Garden Soundscape' : 'Enable Garden Ambient Soundscape'}
          >
            {audioActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Mobile QR Pass Button */}
          <button
            onClick={onOpenQR}
            className="flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-3.5 py-2 rounded-xl shadow-lg shadow-purple-900/40 text-xs font-semibold transition-all cursor-pointer"
            title="Scan QR to take map on phone"
          >
            <QrCode className="w-4 h-4" />
            <span className="hidden md:inline">Mobile Pass</span>
          </button>
        </div>
      </div>
    </header>
  );
};
