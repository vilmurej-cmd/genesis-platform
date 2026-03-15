'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowLeft, Maximize2, Minimize2 } from 'lucide-react';
import { useState, Suspense } from 'react';
import SystemPanel from './components/ui/SystemPanel';
import InfoPanel from './components/ui/InfoPanel';
import ZoomIndicator from './components/ui/ZoomIndicator';
import SearchBar from './components/ui/SearchBar';
import DiseaseTimeline from './components/disease/DiseaseTimeline';
import HealthMeter from './components/cure/HealthMeter';
import SoundEngine from './components/SoundEngine';
import TreatmentPanel from './components/ui/TreatmentPanel';

/* Dynamic import for R3F — must be client-only, no SSR */
const BodyScene = dynamic(() => import('./components/BodyScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#030712]">
      <div className="text-center space-y-4">
        <div className="relative w-16 h-16 mx-auto">
          <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 animate-ping" />
          <div className="absolute inset-2 rounded-full border-2 border-cyan-500/40 animate-pulse" />
          <div className="absolute inset-4 rounded-full bg-cyan-500/20 animate-pulse" />
        </div>
        <div>
          <p className="text-sm text-white/60">Loading the Human Body</p>
          <p className="text-[10px] text-white/20 mt-1">Initializing 3D engine...</p>
        </div>
      </div>
    </div>
  ),
});

export default function ExplorePage() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#030712] overflow-hidden">
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 text-white/40 hover:text-white/70 transition-colors"
        >
          <ArrowLeft size={16} />
          <span className="text-xs">GENESIS</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400/60">
            HUMAN BODY EXPLORER
          </span>
        </div>

        <button
          onClick={toggleFullscreen}
          className="text-white/30 hover:text-white/60 transition-colors p-1"
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      </div>

      {/* Search bar */}
      <div className="pt-12">
        <Suspense fallback={null}>
          <SearchBar />
        </Suspense>
      </div>

      {/* 3D Viewport */}
      <div className="absolute inset-0">
        <BodyScene />
      </div>

      {/* UI Overlays */}
      <SystemPanel />
      <InfoPanel />
      <ZoomIndicator />
      <DiseaseTimeline />
      <HealthMeter />
      <TreatmentPanel />
      <SoundEngine />

      {/* Bottom-right controls legend */}
      <div className="absolute bottom-6 right-4 z-20">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl px-3 py-2 space-y-1">
          <p className="text-[9px] text-white/20 uppercase tracking-wider">Controls</p>
          <p className="text-[10px] text-white/30">🖱 Drag to rotate</p>
          <p className="text-[10px] text-white/30">⚙ Scroll to zoom</p>
          <p className="text-[10px] text-white/30">🔤 S/M/C/N/R keys toggle systems</p>
          <p className="text-[10px] text-white/30">X = X-Ray • Space = Pause</p>
        </div>
      </div>
    </div>
  );
}
