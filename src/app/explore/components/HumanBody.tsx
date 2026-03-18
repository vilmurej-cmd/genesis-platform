'use client';

import { useGenesisStore } from '../store';
import AnatomyGLB, { GLBErrorBoundary } from './AnatomyGLB';
import Skeletal from './systems/Skeletal';
import Muscular from './systems/Muscular';
import Circulatory from './systems/Circulatory';
import Nervous from './systems/Nervous';
import Respiratory from './systems/Respiratory';
import Digestive from './systems/Digestive';
import Urinary from './systems/Urinary';
import Endocrine from './systems/Endocrine';
import Lymphatic from './systems/Lymphatic';
import Reproductive from './systems/Reproductive';
import Integumentary from './systems/Integumentary';
import Heart from './organs/Heart';
import Brain from './organs/Brain';
import DiseaseOverlayComponent from './disease/DiseaseOverlay';
import SymptomMarkers from './disease/SymptomMarkers';
import TreatmentAnimationSystem from './cure/TreatmentAnimation';

export default function HumanBody() {
  const activeSystems = useGenesisStore((s) => s.activeSystems);
  const isPaused = useGenesisStore((s) => s.isPaused);
  const animationSpeed = useGenesisStore((s) => s.animationSpeed);
  const xrayMode = useGenesisStore((s) => s.xrayMode);
  const zoomLevel = useGenesisStore((s) => s.zoomLevel);
  const selectOrgan = useGenesisStore((s) => s.selectOrgan);

  const showBody = zoomLevel !== 'cell';

  return (
    <group visible={showBody}>
      {/* ── Realistic 3D anatomy models (GLB) ──
          Replaces the procedural Skeletal system with real bone geometry.
          Falls back to procedural Skeletal if GLB fails to load. */}
      <GLBErrorBoundary fallback={<Skeletal visible={activeSystems.has('skeletal')} />}>
        <AnatomyGLB />
      </GLBErrorBoundary>

      {/* ── Procedural systems (overlay on top of GLB models) ──
          These provide animated effects (blood flow, neural signals, breathing)
          that complement the static GLB anatomy. */}
      <Integumentary visible={activeSystems.has('integumentary')} xrayMode={xrayMode} />
      {/* Skeletal removed — now provided by AnatomyGLB above */}
      <Muscular visible={activeSystems.has('muscular')} />
      <Circulatory visible={activeSystems.has('circulatory')} isPaused={isPaused} />
      <Nervous visible={activeSystems.has('nervous')} isPaused={isPaused} />
      <Respiratory visible={activeSystems.has('respiratory')} isPaused={isPaused} animationSpeed={animationSpeed} onSelectOrgan={selectOrgan} />
      <Digestive visible={activeSystems.has('digestive')} isPaused={isPaused} animationSpeed={animationSpeed} onSelectOrgan={selectOrgan} />
      <Urinary visible={activeSystems.has('urinary')} />
      <Endocrine visible={activeSystems.has('endocrine')} isPaused={isPaused} />
      <Lymphatic visible={activeSystems.has('lymphatic')} />
      <Reproductive visible={activeSystems.has('reproductive')} />

      {/* Detailed organs (always present, layered on top of system views) */}
      <Heart
        visible={activeSystems.has('circulatory')}
        isPaused={isPaused}
        animationSpeed={animationSpeed}
        onSelect={() => selectOrgan('heart')}
      />
      <Brain
        visible={activeSystems.has('nervous')}
        isPaused={isPaused}
        onSelect={() => selectOrgan('brain')}
      />

      {/* Disease overlay — rendered on top of everything */}
      <DiseaseOverlayComponent />
      <SymptomMarkers />
      <TreatmentAnimationSystem />
    </group>
  );
}
