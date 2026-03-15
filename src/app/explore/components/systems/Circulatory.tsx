'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* Blood flow particles using instanced mesh for performance */
function BloodParticles({ paths, count = 300, color = '#FF2222', speed = 1 }: {
  paths: THREE.Vector3[][];
  count?: number;
  color?: string;
  speed?: number;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Each particle tracks its path index and position along that path
  const particles = useMemo(() =>
    Array.from({ length: count }, () => ({
      pathIdx: Math.floor(Math.random() * paths.length),
      t: Math.random(),
      speed: (0.3 + Math.random() * 0.7) * speed,
      scale: 0.004 + Math.random() * 0.004,
    })),
  [count, paths.length, speed]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    particles.forEach((p, i) => {
      p.t += delta * p.speed * 0.15;
      if (p.t > 1) p.t -= 1;
      const path = paths[p.pathIdx];
      if (!path || path.length < 2) return;
      const idx = p.t * (path.length - 1);
      const a = Math.floor(idx);
      const b = Math.min(a + 1, path.length - 1);
      const frac = idx - a;
      const pos = path[a].clone().lerp(path[b], frac);
      dummy.position.copy(pos);
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 4]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />
    </instancedMesh>
  );
}

export default function Circulatory({ visible, isPaused }: { visible: boolean; isPaused?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);

  // Define major vessel paths
  const { arteryPaths, veinPaths, vesselGeos } = useMemo(() => {
    const arteries: THREE.Vector3[][] = [];
    const veins: THREE.Vector3[][] = [];
    const geos: { curve: THREE.CatmullRomCurve3; color: string; radius: number }[] = [];

    // Aorta — heart up through aortic arch and down
    const aorta = [
      new THREE.Vector3(0.05, 1.35, 0.05),
      new THREE.Vector3(0.05, 1.5, 0.05),
      new THREE.Vector3(0.03, 1.6, 0.0),
      new THREE.Vector3(0, 1.65, -0.03),
      new THREE.Vector3(-0.03, 1.6, -0.05),
      new THREE.Vector3(-0.02, 1.4, -0.04),
      new THREE.Vector3(0, 1.1, -0.04),
      new THREE.Vector3(0, 0.8, -0.03),
      new THREE.Vector3(0, 0.5, -0.02),
    ];
    arteries.push(aorta);
    geos.push({ curve: new THREE.CatmullRomCurve3(aorta), color: '#CC2222', radius: 0.018 });

    // Carotid arteries — to head
    const leftCarotid = [
      new THREE.Vector3(-0.03, 1.6, 0.0),
      new THREE.Vector3(-0.06, 1.7, 0.02),
      new THREE.Vector3(-0.05, 1.85, 0.03),
      new THREE.Vector3(-0.03, 1.95, 0.02),
    ];
    arteries.push(leftCarotid);
    geos.push({ curve: new THREE.CatmullRomCurve3(leftCarotid), color: '#CC2222', radius: 0.01 });

    const rightCarotid = leftCarotid.map(v => new THREE.Vector3(-v.x, v.y, v.z));
    arteries.push(rightCarotid);
    geos.push({ curve: new THREE.CatmullRomCurve3(rightCarotid), color: '#CC2222', radius: 0.01 });

    // Subclavian → brachial — arms
    const leftArm = [
      new THREE.Vector3(-0.1, 1.6, 0.0),
      new THREE.Vector3(-0.25, 1.6, 0.02),
      new THREE.Vector3(-0.35, 1.5, 0.03),
      new THREE.Vector3(-0.38, 1.3, 0.05),
      new THREE.Vector3(-0.4, 1.1, 0.07),
      new THREE.Vector3(-0.41, 0.9, 0.08),
    ];
    arteries.push(leftArm);
    geos.push({ curve: new THREE.CatmullRomCurve3(leftArm), color: '#CC2222', radius: 0.008 });

    const rightArm = leftArm.map(v => new THREE.Vector3(-v.x, v.y, v.z));
    arteries.push(rightArm);
    geos.push({ curve: new THREE.CatmullRomCurve3(rightArm), color: '#CC2222', radius: 0.008 });

    // Iliac → femoral — legs
    const leftLeg = [
      new THREE.Vector3(-0.05, 0.5, 0.0),
      new THREE.Vector3(-0.1, 0.4, 0.02),
      new THREE.Vector3(-0.14, 0.2, 0.03),
      new THREE.Vector3(-0.16, 0.0, 0.03),
      new THREE.Vector3(-0.17, -0.2, 0.03),
      new THREE.Vector3(-0.18, -0.45, 0.04),
      new THREE.Vector3(-0.18, -0.6, 0.04),
    ];
    arteries.push(leftLeg);
    geos.push({ curve: new THREE.CatmullRomCurve3(leftLeg), color: '#CC2222', radius: 0.01 });

    const rightLeg = leftLeg.map(v => new THREE.Vector3(-v.x, v.y, v.z));
    arteries.push(rightLeg);
    geos.push({ curve: new THREE.CatmullRomCurve3(rightLeg), color: '#CC2222', radius: 0.01 });

    // Vena cava (venous return)
    const venaCava = [
      new THREE.Vector3(0.06, 0.5, 0.0),
      new THREE.Vector3(0.06, 0.8, 0.0),
      new THREE.Vector3(0.06, 1.1, 0.0),
      new THREE.Vector3(0.06, 1.3, 0.02),
    ];
    veins.push(venaCava);
    geos.push({ curve: new THREE.CatmullRomCurve3(venaCava), color: '#3344AA', radius: 0.02 });

    // Jugular veins
    const leftJugular = [
      new THREE.Vector3(-0.08, 1.9, 0.0),
      new THREE.Vector3(-0.08, 1.75, 0.02),
      new THREE.Vector3(-0.06, 1.6, 0.02),
      new THREE.Vector3(-0.04, 1.45, 0.02),
    ];
    veins.push(leftJugular);
    geos.push({ curve: new THREE.CatmullRomCurve3(leftJugular), color: '#3344AA', radius: 0.008 });

    const rightJugular = leftJugular.map(v => new THREE.Vector3(-v.x, v.y, v.z));
    veins.push(rightJugular);
    geos.push({ curve: new THREE.CatmullRomCurve3(rightJugular), color: '#3344AA', radius: 0.008 });

    // Pulmonary arteries (heart to lungs)
    const pulmonaryL = [
      new THREE.Vector3(0, 1.38, 0.05),
      new THREE.Vector3(-0.1, 1.42, 0.04),
      new THREE.Vector3(-0.18, 1.45, 0.02),
    ];
    arteries.push(pulmonaryL);
    geos.push({ curve: new THREE.CatmullRomCurve3(pulmonaryL), color: '#5555CC', radius: 0.01 });

    const pulmonaryR = pulmonaryL.map(v => new THREE.Vector3(-v.x, v.y, v.z));
    arteries.push(pulmonaryR);
    geos.push({ curve: new THREE.CatmullRomCurve3(pulmonaryR), color: '#5555CC', radius: 0.01 });

    return { arteryPaths: arteries, veinPaths: veins, vesselGeos: geos };
  }, []);

  return (
    <group ref={groupRef} visible={visible}>
      {/* Vessel tubes */}
      {vesselGeos.map((v, i) => (
        <mesh key={`vessel-${i}`}>
          <tubeGeometry args={[v.curve, 32, v.radius, 8, false]} />
          <meshStandardMaterial
            color={v.color}
            emissive={v.color}
            emissiveIntensity={0.4}
            transparent
            opacity={0.7}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Heart glow center */}
      <mesh position={[0, 1.35, 0.05]}>
        <sphereGeometry args={[0.04, 12, 8]} />
        <meshStandardMaterial color="#FF0000" emissive="#FF0000" emissiveIntensity={1} transparent opacity={0.6} />
      </mesh>

      {/* Blood flow particles */}
      {!isPaused && (
        <>
          <BloodParticles paths={arteryPaths} count={250} color="#FF3333" speed={1.2} />
          <BloodParticles paths={veinPaths} count={150} color="#4455CC" speed={0.8} />
        </>
      )}
    </group>
  );
}
