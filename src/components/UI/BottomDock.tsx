import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  RotateCcw,
  Sparkles,
  Utensils,
  Flower2,
  TreePine,
  Building2,
  Compass,
  X,
} from 'lucide-react';
import { CategoryType, POIItem } from '../../types/map';
import { GARDENS_POIS } from '../../data/gardensData';

interface BottomDockProps {
  selectedCategory: CategoryType;
  onSelectCategory: (cat: CategoryType) => void;
  onSelectPoi: (poi: POIItem) => void;
  onResetView: () => void;
}

export const BottomDock: React.FC<BottomDockProps> = ({
  selectedCategory,
  onSelectCategory,
  onSelectPoi,
  onResetView,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Filtered search results
  const filteredPois = searchQuery.trim() === ''
    ? []
    : GARDENS_POIS.filter((poi) => {
        const q = searchQuery.toLowerCase();
        return (
          poi.name.toLowerCase().includes(q) ||
          poi.subtitle.toLowerCase().includes(q) ||
          poi.tags.some((t) => t.toLowerCase().includes(q)) ||
          poi.numberKey?.toLowerCase() === q
        );
      }).slice(0, 7);

  // Keyboard shortcut 'H' to toggle dock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'h' || e.key === 'H') {
        if (document.activeElement?.tagName !== 'INPUT') {
          setIsCollapsed((prev) => !prev);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const categories: { id: CategoryType; label: string; icon: React.ReactNode; count: number }[] = [
    {
      id: 'all',
      label: 'All Points',
      icon: <Sparkles className="w-3.5 h-3.5" />,
      count: GARDENS_POIS.length,
    },
    {
      id: 'conservatory',
      label: 'Conservatories',
      icon: <Building2 className="w-3.5 h-3.5" />,
      count: GARDENS_POIS.filter((p) => p.category === 'conservatory').length,
    },
    {
      id: 'supertree',
      label: 'Supertrees',
      icon: <TreePine className="w-3.5 h-3.5" />,
      count: GARDENS_POIS.filter((p) => p.category === 'supertree').length,
    },
    {
      id: 'garden',
      label: 'Gardens & Flora',
      icon: <Flower2 className="w-3.5 h-3.5" />,
      count: GARDENS_POIS.filter((p) => p.category === 'garden').length,
    },
    {
      id: 'dining',
      label: 'Dining & Cafés',
      icon: <Utensils className="w-3.5 h-3.5" />,
      count: GARDENS_POIS.filter((p) => p.category === 'dining').length,
    },
  ];

  return (
    <div
      className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-30 transition-transform duration-300 ease-out flex flex-col items-center pointer-events-none ${
        isCollapsed ? 'translate-y-[calc(100%-28px)]' : 'translate-y-0'
      }`}
      style={{ width: 'min(920px, 94%)' }}
    >
      {/* Collapse / Expand Tab */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="pointer-events-auto bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white px-4 py-1 rounded-t-xl border-t border-x border-slate-700/60 shadow-lg text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer backdrop-none"
        title="Toggle Cinema Mode (Press 'H')"
      >
        {isCollapsed ? (
          <>
            <ChevronUp className="w-3.5 h-3.5 text-purple-400" />
            <span>Show Map Controls</span>
          </>
        ) : (
          <>
            <ChevronDown className="w-3.5 h-3.5 text-purple-400" />
            <span>Hide Controls (Cinema Mode)</span>
          </>
        )}
      </button>

      {/* Main Glassmorphic Dock Container */}
      <div className="pointer-events-auto w-full bg-slate-900/95 border border-slate-700/70 rounded-2xl p-2.5 sm:p-3 shadow-2xl flex flex-col gap-2.5">
        <div className="flex items-center gap-2 w-full">
          {/* Search Box */}
          <div className="relative flex-1">
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="Search Flower Dome, Supertrees, dining, #19 Planet..."
                className="w-full pl-10 pr-9 py-2 bg-slate-800/80 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setIsSearchOpen(false);
                  }}
                  className="absolute right-3 text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Autocomplete Search Dropdown */}
            {isSearchOpen && filteredPois.length > 0 && (
              <div className="absolute bottom-full mb-2 left-0 right-0 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden max-h-72 overflow-y-auto divide-y divide-slate-800/80">
                {filteredPois.map((poi) => (
                  <button
                    key={poi.id}
                    onClick={() => {
                      onSelectPoi(poi);
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="w-full px-3.5 py-2.5 flex items-center justify-between text-left hover:bg-purple-900/30 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5">
                      {poi.numberKey && (
                        <span className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 font-bold text-xs flex items-center justify-center border border-purple-500/30">
                          {poi.numberKey}
                        </span>
                      )}
                      <div>
                        <div className="text-xs sm:text-sm font-semibold text-white group-hover:text-purple-300 transition-colors">
                          {poi.name}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-xs sm:max-w-md">
                          {poi.subtitle}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                      {poi.categoryLabel}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick View Navigation / Compass Reset */}
          <div className="flex items-center gap-1">
            <button
              onClick={onResetView}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl border border-slate-700 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer shadow"
              title="Reset to Full Overview"
            >
              <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Overview</span>
            </button>
          </div>
        </div>

        {/* Category Filter Pills (Scrollable on mobile, spacious on large screen) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-900/30 border border-purple-400/30'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
                <span className="text-[10px] opacity-70 bg-black/30 px-1.5 py-0.2 rounded-full font-mono">
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
