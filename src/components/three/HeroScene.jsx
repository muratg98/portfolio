import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useTheme } from '../../context/ThemeContext';

function FloatingShape({ position, scale, speed, distort, color }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * speed * 0.3;
      meshRef.current.rotation.y = state.clock.elapsedTime * speed * 0.2;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 1]} />
        <MeshDistortMaterial
          color={color}
          attach="material"
          distort={distort}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.7}
        />
      </mesh>
    </Float>
  );
}

function GlowingSphere({ position, scale, color }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        transparent
        opacity={0.4}
      />
    </mesh>
  );
}

function ParticleField({ count = 500 }) {
  const { theme } = useTheme();
  const pointsRef = useRef();
  
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return positions;
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      pointsRef.current.rotation.x = state.clock.elapsedTime * 0.01;
    }
  });

  const particleColor = theme === 'dark' ? '#6366f1' : '#3b82f6';

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color={particleColor}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function WireframeGlobe() {
  const meshRef = useRef();
  const { theme } = useTheme();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  const wireColor = theme === 'dark' ? '#3b82f6' : '#6366f1';

  return (
    <mesh ref={meshRef} position={[3, 0, -2]} scale={2}>
      <icosahedronGeometry args={[1, 2]} />
      <meshBasicMaterial 
        color={wireColor} 
        wireframe 
        transparent 
        opacity={0.15} 
      />
    </mesh>
  );
}

function TorusKnot() {
  const meshRef = useRef();
  const { theme } = useTheme();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  const knotColor = theme === 'dark' ? '#8b5cf6' : '#7c3aed';

  return (
    <Float speed={1} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={meshRef} position={[-4, 1, -3]} scale={0.6}>
        <torusKnotGeometry args={[1, 0.3, 100, 16]} />
        <MeshDistortMaterial
          color={knotColor}
          distort={0.2}
          speed={2}
          roughness={0.3}
          metalness={0.7}
          transparent
          opacity={0.5}
        />
      </mesh>
    </Float>
  );
}

export default function HeroScene() {
  const { theme } = useTheme();
  
  const primaryColor = theme === 'dark' ? '#3b82f6' : '#2563eb';
  const secondaryColor = theme === 'dark' ? '#8b5cf6' : '#7c3aed';
  const accentColor = theme === 'dark' ? '#06b6d4' : '#0891b2';

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color={primaryColor} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color={secondaryColor} />
      
      <ParticleField count={300} />
      <WireframeGlobe />
      <TorusKnot />
      
      <FloatingShape
        position={[2, 2, -1]}
        scale={0.8}
        speed={1.5}
        distort={0.4}
        color={primaryColor}
      />
      <FloatingShape
        position={[-3, -1, -2]}
        scale={0.6}
        speed={1}
        distort={0.3}
        color={secondaryColor}
      />
      <FloatingShape
        position={[4, -2, -3]}
        scale={0.5}
        speed={2}
        distort={0.5}
        color={accentColor}
      />
      
      <GlowingSphere 
        position={[-2, 3, -4]} 
        scale={0.4} 
        color={primaryColor} 
      />
      <GlowingSphere 
        position={[3, -3, -5]} 
        scale={0.3} 
        color={secondaryColor} 
      />
    </>
  );
}
