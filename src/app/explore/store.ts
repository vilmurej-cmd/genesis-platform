import { create } from 'zustand';

export type ZoomLevel = 'body' | 'region' | 'organ' | 'tissue' | 'cell';

export type SystemId =
  | 'skeletal'
  | 'muscular'
  | 'circulatory'
  | 'nervous'
  | 'respiratory'
  | 'digestive'
  | 'urinary'
  | 'endocrine'
  | 'lymphatic'
  | 'reproductive'
  | 'integumentary';

export interface DiseaseOverlay {
  name: string;
  affectedOrgans: string[];
  stages: { name: string; description: string; severity: string }[];
  type: 'cancer' | 'infection' | 'inflammation' | 'circulatory' | 'neurological' | 'metabolic' | 'respiratory' | 'autoimmune' | 'generic';
}

export interface TreatmentEffect {
  name: string;
  type: 'medication' | 'surgery' | 'radiation' | 'immunotherapy' | 'therapy';
  targetOrgan: string;
  effectiveness: number; // 0-100
}

export const SYSTEM_META: Record<SystemId, { label: string; color: string; shortcut: string }> = {
  skeletal:       { label: 'Skeletal',       color: '#F5F5DC', shortcut: 'S' },
  muscular:       { label: 'Muscular',       color: '#CC3333', shortcut: 'M' },
  circulatory:    { label: 'Circulatory',    color: '#FF4444', shortcut: 'C' },
  nervous:        { label: 'Nervous',        color: '#FFD700', shortcut: 'N' },
  respiratory:    { label: 'Respiratory',    color: '#87CEEB', shortcut: 'R' },
  digestive:      { label: 'Digestive',      color: '#66BB6A', shortcut: 'D' },
  urinary:        { label: 'Urinary',        color: '#FFEE58', shortcut: 'U' },
  endocrine:      { label: 'Endocrine',      color: '#AB47BC', shortcut: 'E' },
  lymphatic:      { label: 'Lymphatic',      color: '#81C784', shortcut: 'L' },
  reproductive:   { label: 'Reproductive',   color: '#F48FB1', shortcut: 'P' },
  integumentary:  { label: 'Integumentary',  color: '#FFCCBC', shortcut: 'I' },
};

interface GenesisStore {
  // System visibility
  activeSystems: Set<SystemId>;
  toggleSystem: (system: SystemId) => void;
  setActiveSystems: (systems: SystemId[]) => void;
  showAllSystems: () => void;
  hideAllSystems: () => void;

  // Zoom & selection
  zoomLevel: ZoomLevel;
  setZoomLevel: (level: ZoomLevel) => void;
  selectedOrgan: string | null;
  selectOrgan: (organ: string | null) => void;
  selectedRegion: string | null;
  selectRegion: (region: string | null) => void;

  // Camera
  cameraTarget: [number, number, number];
  setCameraTarget: (target: [number, number, number]) => void;
  autoRotate: boolean;
  setAutoRotate: (v: boolean) => void;

  // Disease
  activeDisease: DiseaseOverlay | null;
  setActiveDisease: (disease: DiseaseOverlay | null) => void;
  diseaseStage: number;
  setDiseaseStage: (stage: number) => void;

  // Cure
  appliedTreatments: TreatmentEffect[];
  applyTreatment: (treatment: TreatmentEffect) => void;
  clearTreatments: () => void;
  healthScore: number;
  setHealthScore: (score: number) => void;

  // Animation
  isPaused: boolean;
  togglePause: () => void;
  animationSpeed: number;
  setAnimationSpeed: (speed: number) => void;

  // Modes
  xrayMode: boolean;
  toggleXrayMode: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;
}

export const useGenesisStore = create<GenesisStore>((set) => ({
  // System visibility — start with integumentary + circulatory + skeletal
  activeSystems: new Set<SystemId>(['integumentary', 'skeletal', 'circulatory']),
  toggleSystem: (system) =>
    set((s) => {
      const next = new Set(s.activeSystems);
      if (next.has(system)) next.delete(system);
      else next.add(system);
      return { activeSystems: next };
    }),
  setActiveSystems: (systems) => set({ activeSystems: new Set(systems) }),
  showAllSystems: () =>
    set({
      activeSystems: new Set<SystemId>(Object.keys(SYSTEM_META) as SystemId[]),
    }),
  hideAllSystems: () => set({ activeSystems: new Set<SystemId>() }),

  // Zoom
  zoomLevel: 'body',
  setZoomLevel: (level) => set({ zoomLevel: level }),
  selectedOrgan: null,
  selectOrgan: (organ) => set({ selectedOrgan: organ }),
  selectedRegion: null,
  selectRegion: (region) => set({ selectedRegion: region }),

  // Camera
  cameraTarget: [0, 0, 0],
  setCameraTarget: (target) => set({ cameraTarget: target }),
  autoRotate: true,
  setAutoRotate: (v) => set({ autoRotate: v }),

  // Disease
  activeDisease: null,
  setActiveDisease: (disease) =>
    set({ activeDisease: disease, diseaseStage: 0, healthScore: disease ? 70 : 100 }),
  diseaseStage: 0,
  setDiseaseStage: (stage) => set({ diseaseStage: stage }),

  // Cure
  appliedTreatments: [],
  applyTreatment: (treatment) =>
    set((s) => ({
      appliedTreatments: [...s.appliedTreatments, treatment],
      healthScore: Math.min(100, s.healthScore + treatment.effectiveness * 0.3),
    })),
  clearTreatments: () => set({ appliedTreatments: [], healthScore: 50 }),
  healthScore: 100,
  setHealthScore: (score) => set({ healthScore: score }),

  // Animation
  isPaused: false,
  togglePause: () => set((s) => ({ isPaused: !s.isPaused })),
  animationSpeed: 1,
  setAnimationSpeed: (speed) => set({ animationSpeed: speed }),

  // Modes
  xrayMode: false,
  toggleXrayMode: () => set((s) => ({ xrayMode: !s.xrayMode })),
  soundEnabled: false,
  toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
}));
