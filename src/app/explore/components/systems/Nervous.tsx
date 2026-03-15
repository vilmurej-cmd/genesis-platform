'use client';

import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* Neural signal spark — travels along a path */
function NeuralSpark({ path, delay }: { path: THREE.Vector3[]; delay: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const [t, setT] = useState(delay);

  useFrame((_, delta) => {
    if (!ref.current) return;
    setT(prev => {
      const next = prev + delta * 0.4;
      if (next > 1 + delay) return -0.5; // Reset with pause
      if (next < 0) return next + delta * 0.8;
      const clamped = Math.max(0, Math.min(1, next));
      const idx = clamped * (path.length - 1);
      const a = Math.floor(idx);
      const b = Math.min(a + 1, path.length - 1);
      const frac = idx - a;
      const pos = path[a].clone().lerp(path[b], frac);
      ref.current!.position.copy(pos);
      ref.current!.visible = clamped > 0 && clamped < 1;
      const pulse = 0.5 + Math.sin(next * 20) * 0.5;
      ref.current!.scale.setScalar(0.008 + pulse * 0.006);
      return next;
    });
  });

  return (
    <mesh ref={ref} visible={false}>
      <sphereGeometry args={[1, 6, 4]} />
      <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={2} transparent opacity={0.9} />
    </mesh>
  );
}

export default function Nervous({ visible, isPaused }: { visible: boolean; isPaused?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  const { nervePaths, nerveGeos } = useMemo(() => {
    const paths: THREE.Vector3[][] = [];
    const geos: { curve: THREE.CatmullRomCurve3; radius: number }[] = [];

    // Spinal cord
    const spine = [
      new THREE.Vector3(0, 1.85, -0.02),
      new THREE.Vector3(0, 1.7, -0.04),
      new THREE.Vector3(0, 1.5, -0.04),
      new THREE.Vector3(0, 1.3, -0.04),
      new THREE.Vector3(0, 1.1, -0.04),
      new THREE.Vector3(0, 0.9, -0.04),
      new THREE.Vector3(0, 0.7, -0.04),
      new THREE.Vector3(0, 0.5, -0.03),
    ];
    paths.push(spine);
    geos.push({ curve: new THREE.CatmullRomCurve3(spine), radius: 0.012 });

    // Brain stem spread (3 branches in brain)
    [[-0.08, 1.95, 0.02], [0.08, 1.95, 0.02], [0, 2.05, -0.02]].forEach(end => {
      const branch = [new THREE.Vector3(0, 1.85, -0.02), new THREE.Vector3(end[0] * 0.5, 1.9, end[2] * 0.5), new THREE.Vector3(...end)];
      paths.push(branch);
      geos.push({ curve: new THREE.CatmullRomCurve3(branch), radius: 0.006 });
    });

    // Brachial plexus → arms
    const leftBrachial = [
      new THREE.Vector3(0, 1.6, -0.04),
      new THREE.Vector3(-0.12, 1.58, -0.02),
      new THREE.Vector3(-0.25, 1.55, 0),
      new THREE.Vector3(-0.35, 1.4, 0.02),
      new THREE.Vector3(-0.38, 1.2, 0.04),
      new THREE.Vector3(-0.4, 1.0, 0.06),
    ];
    paths.push(leftBrachial);
    geos.push({ curve: new THREE.CatmullRomCurve3(leftBrachial), radius: 0.005 });

    const rightBrachial = leftBrachial.map(v => new THREE.Vector3(-v.x, v.y, v.z));
    paths.push(rightBrachial);
    geos.push({ curve: new THREE.CatmullRomCurve3(rightBrachial), radius: 0.005 });

    // Lumbar/sacral → legs
    const leftSciatic = [
      new THREE.Vector3(0, 0.55, -0.03),
      new THREE.Vector3(-0.08, 0.45, -0.02),
      new THREE.Vector3(-0.12, 0.3, -0.01),
      new THREE.Vector3(-0.15, 0.1, 0),
      new THREE.Vector3(-0.17, -0.15, 0.01),
      new THREE.Vector3(-0.18, -0.4, 0.02),
      new THREE.Vector3(-0.18, -0.55, 0.03),
    ];
    paths.push(leftSciatic);
    geos.push({ curve: new THREE.CatmullRomCurve3(leftSciatic), radius: 0.005 });

    const rightSciatic = leftSciatic.map(v => new THREE.Vector3(-v.x, v.y, v.z));
    paths.push(rightSciatic);
    geos.push({ curve: new THREE.CatmullRomCurve3(rightSciatic), radius: 0.005 });

    // Intercostal nerves — short branches off spine
    for (let i = 0; i < 5; i++) {
      const y = 1.5 - i * 0.12;
      const leftIC = [
        new THREE.Vector3(0, y, -0.04),
        new THREE.Vector3(-0.1, y, -0.02),
        new THREE.Vector3(-0.2, y - 0.02, 0),
      ];
      paths.push(leftIC);
      geos.push({ curve: new THREE.CatmullRomCurve3(leftIC), radius: 0.003 });

      const rightIC = leftIC.map(v => new THREE.Vector3(-v.x, v.y, v.z));
      paths.push(rightIC);
      geos.push({ curve: new THREE.CatmullRomCurve3(rightIC), radius: 0.003 });
    }

    return { nervePaths: paths, nerveGeos: geos };
  }, []);

  return (
    <group ref={groupRef} visible={visible}>
      {/* Nerve tubes */}
      {nerveGeos.map((n, i) => (
        <mesh key={`nerve-${i}`}>
          <tubeGeometry args={[n.curve, 20, n.radius, 6, false]} />
          <meshStandardMaterial
            color="#FFD700"
            emissive="#FFD700"
            emissiveIntensity={0.3}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}

      {/* Neural sparks — signals firing along nerves */}
      {!isPaused && nervePaths.slice(0, 8).map((path, i) => (
        <NeuralSpark key={`spark-${i}`} path={path} delay={i * 0.4} />
      ))}
    </group>
  );
}
