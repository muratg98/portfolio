import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

// Custom hook to load and parse brain OBJ file (vertex-only)
function useBrainVertices(url) {
  const [vertices, setVertices] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetch(url)
      .then(response => {
        if (!response.ok) throw new Error(`Failed to load ${url}`);
        return response.text();
      })
      .then(text => {
        const positions = [];
        const lines = text.split('\n');
        
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('v ')) {
            const parts = trimmed.split(/\s+/);
            if (parts.length >= 4) {
              positions.push(
                parseFloat(parts[1]),
                parseFloat(parts[2]),
                parseFloat(parts[3])
              );
            }
          }
        }
        
        setVertices(new Float32Array(positions));
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading brain:', err);
        setError(err);
        setLoading(false);
      });
  }, [url]);
  
  return { vertices, loading, error };
}

// Psychology/Coder color palette
const COLORS = {
  purple: '#963CBD',
  coral: '#FF6F61',
  magenta: '#C5299B',
  orange: '#FEAE51',
  cyan: '#00D9FF',
  darkPurple: '#1a0a2e',
  brainGlow: '#84ccff',
};

// Section node definitions - positions INSIDE the brain structure
const SECTIONS = [
  { id: 'me', label: 'Me', position: [0, 0.3, 0], color: COLORS.purple },
  { id: 'projects', label: 'Projects', position: [-0.6, 0, -0.2], color: COLORS.coral },
  { id: 'experience', label: 'Experience', position: [0.6, 0, -0.2], color: COLORS.magenta },
  { id: 'skills', label: 'Skills', position: [-0.4, -0.4, 0.2], color: COLORS.orange },
  { id: 'contact', label: 'Contact', position: [0.4, -0.4, 0.2], color: COLORS.cyan },
];

// Starfield background
function Starfield() {
  const starsRef = useRef();
  
  // Create multiple layers of stars
  const starPositions = useMemo(() => {
    const positions = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000; i++) {
      // Spread stars in a large sphere around the scene
      const radius = 15 + Math.random() * 85;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    return positions;
  }, []);
  
  const starSizes = useMemo(() => {
    const sizes = new Float32Array(2000);
    for (let i = 0; i < 2000; i++) {
      sizes[i] = Math.random() * 0.5 + 0.1;
    }
    return sizes;
  }, []);
  
  useFrame((state) => {
    if (starsRef.current) {
      // Very slow rotation for parallax effect
      starsRef.current.rotation.y = state.clock.elapsedTime * 0.005;
      starsRef.current.rotation.x = state.clock.elapsedTime * 0.002;
    }
  });
  
  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={2000}
          array={starPositions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={2000}
          array={starSizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#ffffff"
        transparent
        opacity={0.8}
        sizeAttenuation
      />
    </points>
  );
}

// Colored nebula particles
function NebulaParticles({ count = 300, color, radius = 30, opacity = 0.3 }) {
  const pointsRef = useRef();
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = radius + Math.random() * radius * 0.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [count, radius]);
  
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.008;
    }
  });
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        color={color}
        transparent
        opacity={opacity}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Shooting stars / meteors
function ShootingStars() {
  const groupRef = useRef();
  const [stars, setStars] = useState([]);
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    
    // Occasionally spawn a shooting star
    if (Math.random() < 0.002) {
      const newStar = {
        id: Math.random(),
        startPos: [
          (Math.random() - 0.5) * 60,
          20 + Math.random() * 20,
          (Math.random() - 0.5) * 60
        ],
        velocity: [
          (Math.random() - 0.5) * 0.5,
          -0.3 - Math.random() * 0.3,
          (Math.random() - 0.5) * 0.5
        ],
        life: 0,
        maxLife: 60 + Math.random() * 60
      };
      setStars(prev => [...prev.slice(-5), newStar]);
    }
    
    // Update existing stars
    setStars(prev => prev
      .map(star => ({ ...star, life: star.life + 1 }))
      .filter(star => star.life < star.maxLife)
    );
  });
  
  return (
    <group ref={groupRef}>
      {stars.map(star => (
        <mesh
          key={star.id}
          position={[
            star.startPos[0] + star.velocity[0] * star.life,
            star.startPos[1] + star.velocity[1] * star.life,
            star.startPos[2] + star.velocity[2] * star.life
          ]}
        >
          <sphereGeometry args={[0.05, 4, 4]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={1 - star.life / star.maxLife}
          />
        </mesh>
      ))}
    </group>
  );
}

// Interactive Section Node - embedded inside the brain
function SectionNode({ section, onClick }) {
  const meshRef = useRef();
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    // Gentle float animation
    if (groupRef.current) {
      groupRef.current.position.y = section.position[1] + Math.sin(time * 1.5 + section.position[0] * 2) * 0.02;
    }
    
    // Pulse on hover
    const targetScale = hovered ? 1.3 : 1;
    const currentScale = meshRef.current.scale.x;
    const newScale = THREE.MathUtils.lerp(currentScale, targetScale, 0.1);
    meshRef.current.scale.setScalar(newScale);
    
    // Slow rotation
    meshRef.current.rotation.x += 0.005;
    meshRef.current.rotation.y += 0.008;
  });
  
  const handlePointerOver = (e) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = 'pointer';
  };
  
  const handlePointerOut = () => {
    setHovered(false);
    document.body.style.cursor = 'grab';
  };
  
  const handleClick = (e) => {
    e.stopPropagation();
    onClick(section.id);
  };
  
  const emissiveIntensity = hovered ? 1.2 : 0.4;
  
  return (
    <group ref={groupRef} position={section.position}>
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <boxGeometry args={[0.18, 0.18, 0.18]} />
        <meshStandardMaterial
          color={section.color}
          emissive={section.color}
          emissiveIntensity={emissiveIntensity}
          transparent
          opacity={hovered ? 0.95 : 0.8}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>
      
      {/* Wireframe outline */}
      <mesh scale={1.1}>
        <boxGeometry args={[0.18, 0.18, 0.18]} />
        <meshBasicMaterial
          color={section.color}
          wireframe
          transparent
          opacity={0.4}
        />
      </mesh>
      
      {/* Label */}
      <Html
        position={[0, 0.2, 0]}
        center
        distanceFactor={8}
        style={{
          color: hovered ? '#fff' : section.color,
          fontSize: '11px',
          fontFamily: 'JetBrains Mono, monospace',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          textShadow: `0 0 10px ${section.color}, 0 0 20px ${section.color}`,
          opacity: hovered ? 1 : 0.9,
          transition: 'all 0.2s ease',
          background: hovered ? 'rgba(0,0,0,0.5)' : 'transparent',
          padding: hovered ? '4px 8px' : '0',
          borderRadius: '4px',
        }}
      >
        {section.label}
      </Html>
      
      {/* Glow sphere on hover */}
      {hovered && (
        <mesh>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshBasicMaterial
            color={section.color}
            transparent
            opacity={0.15}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
    </group>
  );
}

// Neural particles floating inside the brain
function NeuralParticles({ count = 60 }) {
  const pointsRef = useRef();
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 0.2 + Math.random() * 0.8;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.85;
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, [count]);
  
  useFrame((state) => {
    if (!pointsRef.current) return;
    const positionAttr = pointsRef.current.geometry.attributes.position;
    const time = state.clock.elapsedTime;
    
    for (let i = 0; i < count; i++) {
      let x = positionAttr.getX(i);
      let y = positionAttr.getY(i);
      let z = positionAttr.getZ(i);
      
      const angle = time * 0.2 + i * 0.03;
      x += Math.sin(angle + i) * 0.002;
      y += Math.cos(angle + i * 0.5) * 0.002;
      z += Math.sin(angle * 0.5 + i) * 0.002;
      
      const dist = Math.sqrt(x * x + y * y + z * z);
      if (dist > 1.1) {
        const scale = 1.1 / dist;
        x *= scale; y *= scale; z *= scale;
      }
      if (dist < 0.15) {
        const scale = 0.15 / dist;
        x *= scale; y *= scale; z *= scale;
      }
      
      positionAttr.setXYZ(i, x, y, z);
    }
    positionAttr.needsUpdate = true;
  });
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color={COLORS.cyan}
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Line Brain - Uses real brain OBJ vertices with connected lines
function ParticleBrain() {
  const linesRef = useRef();
  const { vertices, loading, error } = useBrainVertices('/models/brain_vertex_low.obj');
  
  // Create line connections from brain vertices - SURFACE ONLY
  const lineData = useMemo(() => {
    if (!vertices || vertices.length === 0) return null;
    
    const vertexCount = vertices.length / 3;
    
    // Find bounds and normalize
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;
    let minZ = Infinity, maxZ = -Infinity;
    
    for (let i = 0; i < vertexCount; i++) {
      const x = vertices[i * 3];
      const y = vertices[i * 3 + 1];
      const z = vertices[i * 3 + 2];
      minX = Math.min(minX, x); maxX = Math.max(maxX, x);
      minY = Math.min(minY, y); maxY = Math.max(maxY, y);
      minZ = Math.min(minZ, z); maxZ = Math.max(maxZ, z);
    }
    
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const centerZ = (minZ + maxZ) / 2;
    const maxRange = Math.max(maxX - minX, maxY - minY, maxZ - minZ);
    const scaleFactor = 4.0 / maxRange;
    
    // Create normalized vertex positions with distance from center
    const normalizedVertices = [];
    let maxDist = 0;
    
    for (let i = 0; i < vertexCount; i++) {
      const x = (vertices[i * 3] - centerX) * scaleFactor;
      const y = (vertices[i * 3 + 1] - centerY) * scaleFactor;
      const z = (vertices[i * 3 + 2] - centerZ) * scaleFactor;
      const dist = Math.sqrt(x * x + y * y + z * z);
      maxDist = Math.max(maxDist, dist);
      
      normalizedVertices.push({ x, y, z, dist, index: i });
    }
    
    // Calculate distance threshold for surface vertices (outer 60%)
    const surfaceThreshold = maxDist * 0.4;
    const surfaceVertices = normalizedVertices.filter(v => v.dist >= surfaceThreshold);
    
    // Build spatial grid for efficient neighbor lookup
    const gridSize = 0.24;
    const grid = new Map();
    
    for (const v of surfaceVertices) {
      const key = `${Math.floor(v.x / gridSize)},${Math.floor(v.y / gridSize)},${Math.floor(v.z / gridSize)}`;
      if (!grid.has(key)) grid.set(key, []);
      grid.get(key).push(v);
    }
    
    // Create line connections - connect nearby SURFACE vertices only
    const linePositions = [];
    const lineColors = [];
    const connections = new Set();
    const connectedVertices = new Map(); // vertex index -> {x, y, z, color}
    const connectionDistance = 0.28;
    const maxConnectionsPerVertex = 4;
    
    const purple = new THREE.Color(COLORS.purple);
    const cyan = new THREE.Color(COLORS.cyan);
    const magenta = new THREE.Color(COLORS.magenta);
    
    for (const v of surfaceVertices) {
      const gx = Math.floor(v.x / gridSize);
      const gy = Math.floor(v.y / gridSize);
      const gz = Math.floor(v.z / gridSize);
      
      // Check neighboring grid cells
      const neighbors = [];
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          for (let dz = -1; dz <= 1; dz++) {
            const key = `${gx + dx},${gy + dy},${gz + dz}`;
            if (grid.has(key)) {
              neighbors.push(...grid.get(key));
            }
          }
        }
      }
      
      // Find nearest neighbors and create connections
      const distances = neighbors
        .filter(n => n.index !== v.index)
        .map(n => {
          const midX = (v.x + n.x) / 2;
          const midY = (v.y + n.y) / 2;
          const midZ = (v.z + n.z) / 2;
          const midDist = Math.sqrt(midX * midX + midY * midY + midZ * midZ);
          
          return {
            vertex: n,
            dist: Math.sqrt(
              (n.x - v.x) ** 2 + 
              (n.y - v.y) ** 2 + 
              (n.z - v.z) ** 2
            ),
            midDist
          };
        })
        // Only keep connections where midpoint is also on surface (not going through center)
        .filter(d => d.dist < connectionDistance && d.midDist >= surfaceThreshold * 0.8)
        .sort((a, b) => a.dist - b.dist)
        .slice(0, maxConnectionsPerVertex);
      
      for (const { vertex: n } of distances) {
        const connKey = v.index < n.index ? `${v.index}-${n.index}` : `${n.index}-${v.index}`;
        if (!connections.has(connKey)) {
          connections.add(connKey);
          
          linePositions.push(v.x, v.y, v.z);
          linePositions.push(n.x, n.y, n.z);
          
          // Color gradient based on Y position
          const t1 = (v.y + 2) / 4;
          const t2 = (n.y + 2) / 4;
          
          let color1, color2;
          if (t1 < 0.5) {
            color1 = cyan.clone().lerp(magenta, t1 * 2);
          } else {
            color1 = magenta.clone().lerp(purple, (t1 - 0.5) * 2);
          }
          if (t2 < 0.5) {
            color2 = cyan.clone().lerp(magenta, t2 * 2);
          } else {
            color2 = magenta.clone().lerp(purple, (t2 - 0.5) * 2);
          }
          
          lineColors.push(color1.r, color1.g, color1.b);
          lineColors.push(color2.r, color2.g, color2.b);
          
          // Track connected vertices for node circles
          if (!connectedVertices.has(v.index)) {
            connectedVertices.set(v.index, { x: v.x, y: v.y, z: v.z, color: color1 });
          }
          if (!connectedVertices.has(n.index)) {
            connectedVertices.set(n.index, { x: n.x, y: n.y, z: n.z, color: color2 });
          }
        }
      }
    }
    
    // Create node positions and colors arrays
    const nodePositions = [];
    const nodeColors = [];
    for (const vertex of connectedVertices.values()) {
      nodePositions.push(vertex.x, vertex.y, vertex.z);
      nodeColors.push(vertex.color.r, vertex.color.g, vertex.color.b);
    }
    
    return {
      positions: new Float32Array(linePositions),
      colors: new Float32Array(lineColors),
      count: linePositions.length / 3,
      nodePositions: new Float32Array(nodePositions),
      nodeColors: new Float32Array(nodeColors),
      nodeCount: nodePositions.length / 3
    };
  }, [vertices]);
  
  // Slow rotation
  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });
  
  // Show nothing while loading
  if (loading || error || !lineData) {
    return null;
  }
  
  return (
    <group ref={linesRef}>
      {/* Connection lines */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={lineData.count}
            array={lineData.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={lineData.count}
            array={lineData.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.4}
        />
      </lineSegments>
      
      {/* Node circles at connection points */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={lineData.nodeCount}
            array={lineData.nodePositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={lineData.nodeCount}
            array={lineData.nodeColors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          vertexColors
          size={0.06}
          transparent
          opacity={0.9}
          sizeAttenuation
        />
      </points>
    </group>
  );
}



// Main exported component
export default function BrainPortfolio({ onSectionClick }) {
  const groupRef = useRef();
  
  return (
    <>
      {/* Orbit Controls - enables zoom, rotate */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={15}
        minPolarAngle={Math.PI * 0.15}
        maxPolarAngle={Math.PI * 0.85}
        rotateSpeed={0.5}
        zoomSpeed={0.8}
        onStart={() => { document.body.style.cursor = 'grabbing'; }}
        onEnd={() => { document.body.style.cursor = 'grab'; }}
      />
      
      {/* Background: Stars and nebula */}
      <Starfield />
      <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />
      <NebulaParticles count={200} color={COLORS.purple} radius={40} opacity={0.2} />
      <NebulaParticles count={150} color={COLORS.magenta} radius={50} opacity={0.15} />
      <NebulaParticles count={100} color={COLORS.cyan} radius={35} opacity={0.15} />
      <ShootingStars />
      
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color={COLORS.purple} />
      <pointLight position={[-5, -5, 5]} intensity={0.8} color={COLORS.magenta} />
      <pointLight position={[0, 5, -5]} intensity={0.6} color={COLORS.cyan} />
      <pointLight position={[0, -3, 3]} intensity={0.4} color={COLORS.orange} />
      
      {/* Brain group */}
      <group ref={groupRef} scale={4.0}>
        {/* Particle Brain - loads OBJ model, falls back to procedural */}
        <ParticleBrain />
        
        {/* Neural particles inside */}
        <NeuralParticles count={80} />
        
        {/* Section nodes embedded inside the brain */}
        {SECTIONS.map((section) => (
          <SectionNode
            key={section.id}
            section={section}
            onClick={onSectionClick}
          />
        ))}
      </group>
    </>
  );
}
