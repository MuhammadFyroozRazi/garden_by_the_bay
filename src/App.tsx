/**
 * Gardens by the Bay, Singapore – 3D Interactive Exhibition Map
 * Designed for Large Touchscreen Displays & Mobile Continuation
 * @license Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ThreeMapCanvas } from './components/ThreeMap/ThreeMapCanvas';
import { HeaderBar } from './components/UI/HeaderBar';
import { BottomDock } from './components/UI/BottomDock';
import { AttractionModal } from './components/UI/AttractionModal';
import { RouteFinderModal } from './components/UI/RouteFinderModal';
import { MobileHandoverModal } from './components/UI/MobileHandoverModal';
import { IdleTimerOverlay } from './components/UI/IdleTimerOverlay';
import { GARDENS_POIS } from './data/gardensData';
import { POIItem, CategoryType, TimeOfDayMode } from './types/map';
import { gardenAudio } from './utils/audio';
import { Smartphone, Monitor } from 'lucide-react';

export default function App() {
  const [selectedPoi, setSelectedPoi] = useState<POIItem | null>(null);
  const [hoveredPoi, setHoveredPoi] = useState<POIItem | null>(null);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDayMode>('day');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [activeRoute, setActiveRoute] = useState<{ fromId: string; toId: string } | null>(null);
  const [cameraPreset, setCameraPreset] = useState<'overview' | 'supertree' | 'conservatory' | 'meadow' | 'children' | 'heritage' | null>(null);
  const [activePreset, setActivePreset] = useState<string>('overview');

  const [audioActive, setAudioActive] = useState<boolean>(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState<boolean>(false);
  const [isRouteModalOpen, setIsRouteModalOpen] = useState<boolean>(false);
  const [routeDestinationPoi, setRouteDestinationPoi] = useState<POIItem | null>(null);

  // Kiosk mode & Idle reset timer
  const [isKioskMode, setIsKioskMode] = useState<boolean>(true);
  const [idleCountdown, setIdleCountdown] = useState<number | null>(null);
  const lastActivityTime = useRef<number>(Date.now());

  // Phone simulation view toggle
  const [isMobilePreview, setIsMobilePreview] = useState<boolean>(false);

  // 1. Read URL query parameters on initial mount (for QR code handover continuity)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const poiParam = params.get('poi');
    const timeParam = params.get('time') as TimeOfDayMode | null;

    if (poiParam && poiParam !== 'all') {
      const match = GARDENS_POIS.find((p) => p.id === poiParam || p.numberKey === poiParam);
      if (match) {
        setSelectedPoi(match);
        setActivePreset('');
      }
    }

    if (timeParam && (timeParam === 'day' || timeParam === 'sunset' || timeParam === 'night')) {
      setTimeOfDay(timeParam);
    }
  }, []);

  // 2. Exhibition Kiosk Inactivity Detector (auto-resets when unattended)
  useEffect(() => {
    if (!isKioskMode) return;

    const handleUserActivity = () => {
      lastActivityTime.current = Date.now();
      if (idleCountdown !== null) {
        setIdleCountdown(null);
      }
    };

    window.addEventListener('mousemove', handleUserActivity);
    window.addEventListener('touchstart', handleUserActivity);
    window.addEventListener('keydown', handleUserActivity);

    const checkInterval = window.setInterval(() => {
      const elapsed = Date.now() - lastActivityTime.current;
      const IDLE_THRESHOLD = 75000; // 75 seconds of silence
      const COUNTDOWN_TIME = 10000; // 10 seconds countdown

      if (elapsed > IDLE_THRESHOLD + COUNTDOWN_TIME) {
        // Trigger reset to overview
        handleResetView();
        setIdleCountdown(null);
        lastActivityTime.current = Date.now();
      } else if (elapsed > IDLE_THRESHOLD) {
        const remaining = Math.max(1, Math.ceil((IDLE_THRESHOLD + COUNTDOWN_TIME - elapsed) / 1000));
        setIdleCountdown(remaining);
      }
    }, 1000);

    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('touchstart', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      clearInterval(checkInterval);
    };
  }, [isKioskMode, idleCountdown]);

  // Audio Toggle
  const handleToggleAudio = useCallback(() => {
    const active = gardenAudio.toggle();
    setAudioActive(active);
  }, []);

  // Selection Handler
  const handleSelectPoi = useCallback((poi: POIItem | null) => {
    setSelectedPoi(poi);
    if (poi) {
      gardenAudio.playSelectSound();
      setActivePreset('');
    }
  }, []);

  // Preset Selection
  const handleSelectPreset = useCallback((preset: 'overview' | 'supertree' | 'conservatory' | 'meadow' | 'children' | 'heritage') => {
    setCameraPreset(preset);
    setActivePreset(preset);
    if (preset === 'overview') {
      setSelectedPoi(null);
      setActiveRoute(null);
    }
  }, []);

  // Reset to full map view
  const handleResetView = useCallback(() => {
    setSelectedPoi(null);
    setActiveRoute(null);
    setCameraPreset('overview');
    setActivePreset('overview');
  }, []);

  // Plan Route Handler from Attraction Card
  const handlePlanRouteTo = useCallback((poi: POIItem) => {
    setRouteDestinationPoi(poi);
    setIsRouteModalOpen(true);
  }, []);

  // Open QR handover with specific attraction context
  const handleOpenMobileQR = useCallback((poi: POIItem) => {
    setSelectedPoi(poi);
    setIsQRModalOpen(true);
  }, []);

  // Apply route line on 3D map
  const handleApplyRoute = useCallback((fromId: string, toId: string) => {
    setActiveRoute({ fromId, toId });
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans select-none">
      {/* If Mobile Preview is active, wrap in realistic smartphone frame */}
      {isMobilePreview ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 p-2 sm:p-6">
          <div className="mb-3 flex items-center gap-3">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700">
              <Smartphone className="w-4 h-4 text-purple-400" />
              Mobile Smartphone Simulation
            </span>
            <button
              onClick={() => setIsMobilePreview(false)}
              className="text-xs font-semibold text-purple-300 hover:text-white bg-purple-900/50 hover:bg-purple-800 px-3 py-1.5 rounded-xl border border-purple-500/40 transition-all cursor-pointer"
            >
              Back to Full Kiosk Screen
            </button>
          </div>

          <div className="relative w-full max-w-[410px] h-[820px] max-h-[90vh] rounded-[44px] border-8 border-slate-800 shadow-2xl overflow-hidden bg-slate-950 flex flex-col">
            {/* Phone speaker notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-800 rounded-full z-40" />

            <div className="relative w-full h-full flex-1">
              <ThreeMapCanvas
                selectedPoi={selectedPoi}
                hoveredPoi={hoveredPoi}
                onSelectPoi={handleSelectPoi}
                onHoverPoi={setHoveredPoi}
                timeOfDay={timeOfDay}
                selectedCategory={selectedCategory}
                activeRoute={activeRoute}
                cameraPreset={cameraPreset}
                onCameraPresetConsumed={() => setCameraPreset(null)}
              />

              <HeaderBar
                timeOfDay={timeOfDay}
                setTimeOfDay={setTimeOfDay}
                audioActive={audioActive}
                toggleAudio={handleToggleAudio}
                onOpenQR={() => setIsQRModalOpen(true)}
                onOpenRouteFinder={() => {
                  setRouteDestinationPoi(selectedPoi);
                  setIsRouteModalOpen(true);
                }}
                onSelectPreset={handleSelectPreset}
                activePreset={activePreset}
                isKioskMode={isKioskMode}
                setIsKioskMode={setIsKioskMode}
              />

              <BottomDock
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                onSelectPoi={handleSelectPoi}
                onResetView={handleResetView}
              />

              <AttractionModal
                poi={selectedPoi}
                onClose={() => setSelectedPoi(null)}
                onPlanRouteTo={handlePlanRouteTo}
                onOpenMobileQR={handleOpenMobileQR}
              />
            </div>
          </div>
        </div>
      ) : (
        /* Standard Fullscreen Exhibition Touchscreen Experience */
        <main className="relative w-full h-full">
          {/* Main 3D WebGL Canvas */}
          <ThreeMapCanvas
            selectedPoi={selectedPoi}
            hoveredPoi={hoveredPoi}
            onSelectPoi={handleSelectPoi}
            onHoverPoi={setHoveredPoi}
            timeOfDay={timeOfDay}
            selectedCategory={selectedCategory}
            activeRoute={activeRoute}
            cameraPreset={cameraPreset}
            onCameraPresetConsumed={() => setCameraPreset(null)}
          />

          {/* Exhibition Top Navigation Bar */}
          <HeaderBar
            timeOfDay={timeOfDay}
            setTimeOfDay={setTimeOfDay}
            audioActive={audioActive}
            toggleAudio={handleToggleAudio}
            onOpenQR={() => setIsQRModalOpen(true)}
            onOpenRouteFinder={() => {
              setRouteDestinationPoi(selectedPoi);
              setIsRouteModalOpen(true);
            }}
            onSelectPreset={handleSelectPreset}
            activePreset={activePreset}
            isKioskMode={isKioskMode}
            setIsKioskMode={setIsKioskMode}
          />

          {/* Ergonomic Collapsible Bottom Control Dock */}
          <BottomDock
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onSelectPoi={handleSelectPoi}
            onResetView={handleResetView}
          />

          {/* Exhibition Detail Flyout Sheet */}
          <AttractionModal
            poi={selectedPoi}
            onClose={() => setSelectedPoi(null)}
            onPlanRouteTo={handlePlanRouteTo}
            onOpenMobileQR={handleOpenMobileQR}
          />

          {/* Route Planning Modal */}
          <RouteFinderModal
            isOpen={isRouteModalOpen}
            onClose={() => setIsRouteModalOpen(false)}
            onApplyRoute={handleApplyRoute}
            defaultDestination={routeDestinationPoi}
          />

          {/* Mobile QR Handover Modal */}
          <MobileHandoverModal
            isOpen={isQRModalOpen}
            onClose={() => setIsQRModalOpen(false)}
            selectedPoi={selectedPoi}
            timeOfDay={timeOfDay}
            onToggleMobilePreview={() => setIsMobilePreview(true)}
            isMobilePreviewActive={isMobilePreview}
          />

          {/* Exhibition Kiosk Auto-Reset Countdown */}
          {idleCountdown !== null && (
            <IdleTimerOverlay
              countdownSeconds={idleCountdown}
              onDismiss={() => {
                lastActivityTime.current = Date.now();
                setIdleCountdown(null);
              }}
              onResetNow={handleResetView}
            />
          )}
        </main>
      )}
    </div>
  );
}
