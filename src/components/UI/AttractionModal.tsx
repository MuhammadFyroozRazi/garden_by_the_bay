import React from 'react';
import {
  X,
  Clock,
  Ticket,
  ThermometerSnowflake,
  Accessibility,
  Navigation,
  QrCode,
  Sparkles,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { POIItem } from '../../types/map';

interface AttractionModalProps {
  poi: POIItem | null;
  onClose: () => void;
  onPlanRouteTo: (poi: POIItem) => void;
  onOpenMobileQR: (poi: POIItem) => void;
}

export const AttractionModal: React.FC<AttractionModalProps> = ({
  poi,
  onClose,
  onPlanRouteTo,
  onOpenMobileQR,
}) => {
  if (!poi) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="attraction-modal-title"
      className="absolute inset-y-0 right-0 z-40 w-full max-w-md pointer-events-auto bg-slate-900/95 border-l border-slate-700/80 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300"
    >
      {/* Header Visual Banner */}
      <div className={`relative h-44 sm:h-48 bg-gradient-to-tr ${poi.bannerGradient} p-5 flex flex-col justify-between overflow-hidden`}>
        {/* Subtle patterned overlay */}
        <div className="absolute inset-0 bg-black/25 backdrop-none" />

        {/* Top bar inside banner */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {poi.numberKey && (
              <span className="w-8 h-8 rounded-xl bg-black/40 text-white font-extrabold text-sm flex items-center justify-center border border-white/20 shadow-md">
                #{poi.numberKey}
              </span>
            )}
            <span className="text-[11px] font-bold uppercase tracking-wider bg-black/40 text-white/90 px-2.5 py-1 rounded-lg border border-white/20">
              {poi.categoryLabel}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Title & Subtitle */}
        <div className="relative z-10">
          <h2 id="attraction-modal-title" className="text-2xl font-black text-white tracking-tight drop-shadow-md">
            {poi.name}
          </h2>
          <p className="text-xs text-white/90 font-medium drop-shadow mt-0.5 line-clamp-2">
            {poi.subtitle}
          </p>
        </div>
      </div>

      {/* Scrollable Content Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 text-slate-200">
        {/* Quick Specs Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60 flex items-start gap-2.5">
            <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Hours</div>
              <div className="text-xs font-semibold text-white leading-tight mt-0.5">
                {poi.hours}
              </div>
            </div>
          </div>

          <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60 flex items-start gap-2.5">
            <Ticket className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Admission</div>
              <div className="text-xs font-semibold text-white leading-tight mt-0.5">
                {poi.admission}
              </div>
            </div>
          </div>

          <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60 flex items-start gap-2.5">
            <ThermometerSnowflake className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Environment</div>
              <div className="text-xs font-semibold text-white leading-tight mt-0.5">
                {poi.climate}
              </div>
            </div>
          </div>

          <div className="bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60 flex items-start gap-2.5">
            <Accessibility className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-semibold">Accessibility</div>
              <div className="text-xs font-semibold text-white leading-tight mt-0.5">
                {poi.accessibility}
              </div>
            </div>
          </div>
        </div>

        {/* Narrative Description */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            About this Landmark
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {poi.description}
          </p>
        </div>

        {/* Highlights List */}
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Key Highlights
          </h3>
          <ul className="space-y-2">
            {poi.highlights.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                <ChevronRight className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {poi.tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] font-medium bg-slate-800 text-slate-400 px-2.5 py-1 rounded-md border border-slate-700/50"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Action Buttons */}
      <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center gap-2.5">
        <button
          onClick={() => onPlanRouteTo(poi)}
          className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/30 transition-all cursor-pointer"
        >
          <Navigation className="w-4 h-4" />
          <span>Walk Here</span>
        </button>

        <button
          onClick={() => onOpenMobileQR(poi)}
          className="bg-slate-800 hover:bg-slate-700 text-purple-300 hover:text-white p-2.5 px-3.5 rounded-xl border border-purple-500/30 font-semibold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow"
          title="Send to Mobile"
        >
          <QrCode className="w-4 h-4" />
          <span className="hidden sm:inline">Phone Pass</span>
        </button>
      </div>
    </div>
  );
};
