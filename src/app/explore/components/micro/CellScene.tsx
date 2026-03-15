'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ATP energy particles released from mitochondria */
function ATPParticles({ count = 30 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() =>
    Array.from({ length: count }, () => ({
      origin: [
        (Math.random() - 0.5) * 1.2,
        (Math.random() - 0.5) * 0.8,
        (Math.random() - 0.5) * 1.2,
      ] as [number, number, number],
      speed: 0.3 + Math.random() * 0.5,
      t: Math.random(),
      angle: Math.random() * Math.PI * 2,
    })),
  [count]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const time = clock.getElapsedTime();
    particles.forEach((p, i) => {
      p.t += 0.003 * p.speed;
      if (p.t > 1) p.t = 0;
      const drift = p.t * 0.8;
      dummy.position.set(
        p.origin[0] + Math.cos(time * p.speed + p.angle) * drift,
        p.origin[1] + drift * 0.5,
        p.origin[2] + Math.sin(time * p.speed + p.angle) * drift,
      );
      dummy.scale.setScalar(0.015 + Math.sin(time * 3 + i) * 0.005);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 4]} />
      <meshStandardMaterial color="#FFD700" emissive="#FFD700" emissiveIntensity={2} transparent opacity={0.6} />
    </instancedMesh>
  );
}

/* Receptor activity — molecules docking onto membrane */
function ReceptorParticles({ count = 15 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() =>
    Array.from({ length: count }, () => ({
      angle: Math.random() * Math.PI * 2,
      elevation: (Math.random() - 0.5) * Math.PI,
      distance: 2.5 + Math.random() * 1.5,
      speed: 0.2 + Math.random() * 0.3,
      docking: false,
      dockTime: 0,
    })),
  [count]);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    particles.forEach((p, i) => {
      p.angle += 0.005 * p.speed;
      const r = p.distance + Math.sin(t * p.speed + i) * 0.3;
      dummy.position.set(
        Math.cos(p.angle) * Math.cos(p.elevation) * r,
        Math.sin(p.elevation) * r,
        Math.sin(p.angle) * Math.cos(p.elevation) * r,
      );
      dummy.scale.setScalar(0.04);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={1} transparent opacity={0.5} />
    </instancedMesh>
  );
}

export default function CellScene({ visible }: { visible: boolean }) {
  const cellRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!cellRef.current || !visible) return;
    cellRef.current.rotation.y = clock.getElapsedTime() * 0.05;
  });

  return (
    <group ref={cellRef} visible={visible}>
      {/* Cell membrane — semi-transparent sphere */}
      <mesh>
        <sphereGeometry args={[2, 32, 24]} />
        <meshStandardMaterial
          color="#88CCFF"
          emissive="#00E5FF"
          emissiveIntensity={0.1}
          transparent
          opacity={0.12}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Phospholipid texture layer */}
      <mesh>
        <sphereGeometry args={[1.98, 32, 24]} />
        <meshStandardMaterial
          color="#66AADD"
          emissive="#00AAFF"
          emissiveIntensity={0.05}
          transparent
          opacity={0.08}
          wireframe
          depthWrite={false}
        />
      </mesh>

      {/* Nucleus */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.7, 20, 16]} />
        <meshStandardMaterial
          color="#6633AA"
          emissive="#9945FF"
          emissiveIntensity={0.3}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Nuclear membrane */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.72, 20, 16]} />
        <meshStandardMaterial
          color="#7744BB"
          emissive="#9945FF"
          emissiveIntensity={0.1}
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Nuclear pores — small holes */}
      {Array.from({ length: 12 }, (_, i) => {
        const phi = Math.acos(1 - 2 * (i + 0.5) / 12);
        const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);
        return (
          <mesh
            key={`pore-${i}`}
            position={[
              0.72 * Math.sin(phi) * Math.cos(theta),
              0.72 * Math.cos(phi),
              0.72 * Math.sin(phi) * Math.sin(theta),
            ]}
          >
            <torusGeometry args={[0.04, 0.01, 6, 8]} />
            <meshStandardMaterial color="#9966CC" emissive="#9945FF" emissiveIntensity={0.5} />
          </mesh>
        );
      })}

      {/* Mitochondria — oblong shapes with inner glow */}
      {[
        [1.0, 0.3, 0.5],
        [-0.8, -0.4, 0.7],
        [0.5, 0.6, -0.9],
        [-0.6, -0.2, -0.6],
        [0.3, -0.7, 0.3],
        [-1.1, 0.5, -0.3],
        [0.9, -0.5, -0.4],
      ].map((pos, i) => (
        <group key={`mito-${i}`} position={pos as [number, number, number]} rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}>
          <mesh>
            <capsuleGeometry args={[0.08, 0.2, 8, 10]} />
            <meshStandardMaterial
              color="#FF6600"
              emissive="#FF4400"
              emissiveIntensity={0.4}
              transparent
              opacity={0.7}
            />
          </mesh>
          {/* Inner cristae folds */}
          <mesh>
            <capsuleGeometry args={[0.05, 0.15, 6, 8]} />
            <meshStandardMaterial color="#CC4400" emissive="#FF6600" emissiveIntensity={0.6} transparent opacity={0.5} />
          </mesh>
        </group>
      ))}

      {/* Endoplasmic Reticulum — folded sheets near nucleus */}
      {[
        { pos: [0.9, 0.1, 0.1], rot: [0.3, 0.5, 0] },
        { pos: [-0.85, 0.15, -0.2], rot: [-0.2, -0.4, 0.1] },
        { pos: [0.7, -0.3, -0.5], rot: [0.1, 0.8, 0.2] },
      ].map((er, i) => (
        <mesh key={`er-${i}`} position={er.pos as [number, number, number]} rotation={er.rot as [number, number, number]}>
          <planeGeometry args={[0.5, 0.3, 4, 3]} />
          <meshStandardMaterial
            color="#44AACC"
            emissive="#00AAFF"
            emissiveIntensity={0.15}
            transparent
            opacity={0.25}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Ribosomes — tiny spheres on rough ER */}
      {Array.from({ length: 20 }, (_, i) => {
        const angle = (i / 20) * Math.PI * 2;
        const r = 0.8 + Math.random() * 0.3;
        return (
          <mesh
            key={`ribo-${i}`}
            position={[
              Math.cos(angle) * r + (Math.random() - 0.5) * 0.2,
              (Math.random() - 0.5) * 0.4,
              Math.sin(angle) * r + (Math.random() - 0.5) * 0.2,
            ]}
          >
            <sphereGeometry args={[0.025, 6, 4]} />
            <meshStandardMaterial color="#AADDFF" emissive="#88CCFF" emissiveIntensity={0.3} />
          </mesh>
        );
      })}

      {/* Golgi Apparatus — stacked discs */}
      <group position={[-1.0, -0.3, 0.6]} rotation={[0.3, 0.5, 0.2]}>
        {[0, 0.06, 0.12, 0.18, 0.24].map((y, i) => (
          <mesh key={`golgi-${i}`} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.1 - i * 0.01, 0.02, 6, 12]} />
            <meshStandardMaterial
              color="#FFCC44"
              emissive="#FFD700"
              emissiveIntensity={0.3}
              transparent
              opacity={0.5}
            />
          </mesh>
        ))}
      </group>

      {/* Lysosomes — small spheres with enzyme glow */}
      {[
        [1.3, -0.5, -0.2],
        [-0.4, 0.8, 1.0],
        [0.2, -0.9, -0.8],
        [-1.2, -0.6, -0.4],
      ].map((pos, i) => (
        <mesh key={`lyso-${i}`} position={pos as [number, number, number]}>
          <sphereGeometry args={[0.06, 8, 6]} />
          <meshStandardMaterial color="#CC4488" emissive="#FF00E5" emissiveIntensity={0.5} transparent opacity={0.6} />
        </mesh>
      ))}

      {/* Cytoskeleton — wireframe structure */}
      {Array.from({ length: 15 }, (_, i) => {
        const start = new THREE.Vector3(
          (Math.random() - 0.5) * 3,
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 3,
        );
        const end = start.clone().add(new THREE.Vector3(
          (Math.random() - 0.5) * 1.5,
          (Math.random() - 0.5) * 1,
          (Math.random() - 0.5) * 1.5,
        ));
        const curve = new THREE.CatmullRomCurve3([start, end]);
        return (
          <mesh key={`cyto-${i}`}>
            <tubeGeometry args={[curve, 4, 0.005, 4, false]} />
            <meshStandardMaterial color="#8899AA" emissive="#88AACC" emissiveIntensity={0.1} transparent opacity={0.2} />
          </mesh>
        );
      })}

      {/* ATP energy particles */}
      <ATPParticles count={25} />

      {/* Receptor molecules outside cell */}
      <ReceptorParticles count={12} />

      {/* Ambient light inside cell */}
      <pointLight position={[0, 0, 0]} color="#9945FF" intensity={0.5} distance={3} />
      <pointLight position={[1, 0.3, 0.5]} color="#FF6600" intensity={0.3} distance={2} />
    </group>
  );
}
