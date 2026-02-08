import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html, OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

// Camera zoom-in animation on page load
function CameraAnimation({ brainLoaded }) {
  const { camera } = useThree();
  const startTime = useRef(null);
  const startZ = 20; // start zoomed out
  const endZ = 10;   // end at 50% zoom (between start and min distance)
  const duration = 3000; // 3 seconds
  
  useFrame((state) => {
    // Wait for brain to load before starting animation
    if (!brainLoaded) return;
    
    if (startTime.current === null) {
      startTime.current = state.clock.elapsedTime * 1000;
    }
    
    const elapsed = state.clock.elapsedTime * 1000 - startTime.current;
    
    if (elapsed < duration) {
      // Ease out cubic for smooth deceleration
      const progress = elapsed / duration;
      const eased = 1 - Math.pow(1 - progress, 3);
      
      camera.position.z = startZ + (endZ - startZ) * eased;
      camera.updateProjectionMatrix();
    }
  });
  
  return null;
}

// Custom hook to load and parse brain OBJ file (with faces for proper edges)
function useBrainData(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetch(url)
      .then(response => {
        if (!response.ok) throw new Error(`Failed to load ${url}`);
        return response.text();
      })
      .then(text => {
        const vertices = [];
        const edges = new Set(); // Store unique edges from faces
        const lines = text.split('\n');
        
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('v ')) {
            const parts = trimmed.split(/\s+/);
            if (parts.length >= 4) {
              vertices.push(
                parseFloat(parts[1]),
                parseFloat(parts[2]),
                parseFloat(parts[3])
              );
            }
          } else if (trimmed.startsWith('f ')) {
            // Parse face to extract edges
            const parts = trimmed.split(/\s+/).slice(1);
            const indices = parts.map(p => parseInt(p.split('/')[0]) - 1); // OBJ indices are 1-based
            
            // Create edges from face vertices
            for (let i = 0; i < indices.length; i++) {
              const a = indices[i];
              const b = indices[(i + 1) % indices.length];
              // Store edge as sorted pair to avoid duplicates
              const edgeKey = a < b ? `${a}-${b}` : `${b}-${a}`;
              edges.add(edgeKey);
            }
          }
        }
        
        setData({
          vertices: new Float32Array(vertices),
          edges: Array.from(edges).map(e => e.split('-').map(Number))
        });
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading brain:', err);
        setError(err);
        setLoading(false);
      });
  }, [url]);
  
  return { data, loading, error };
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

// Neural lightning effect - traveling illumination along connected point chains
function NeuralLightning({ nodePositions, linePositions }) {
  const [lightnings, setLightnings] = useState([]);
  const lastFlashTime = useRef(0);
  const nextFlashDelay = useRef(2000 + Math.random() * 4000);
  
  // Build adjacency map from line segments for finding connected points
  const adjacencyMap = useMemo(() => {
    if (!linePositions || linePositions.length === 0) return new Map();
    
    const map = new Map();
    const numSegments = linePositions.length / 6;
    
    // Helper to create position key
    const posKey = (x, y, z) => `${x.toFixed(3)},${y.toFixed(3)},${z.toFixed(3)}`;
    
    for (let i = 0; i < numSegments; i++) {
      const baseIdx = i * 6;
      const p1 = { x: linePositions[baseIdx], y: linePositions[baseIdx + 1], z: linePositions[baseIdx + 2] };
      const p2 = { x: linePositions[baseIdx + 3], y: linePositions[baseIdx + 4], z: linePositions[baseIdx + 5] };
      
      const key1 = posKey(p1.x, p1.y, p1.z);
      const key2 = posKey(p2.x, p2.y, p2.z);
      
      if (!map.has(key1)) map.set(key1, { pos: p1, neighbors: [] });
      if (!map.has(key2)) map.set(key2, { pos: p2, neighbors: [] });
      
      map.get(key1).neighbors.push(key2);
      map.get(key2).neighbors.push(key1);
    }
    
    return map;
  }, [linePositions]);
  
  // Helper to create a single lightning chain
  const createLightning = (time, keys) => {
    const startKey = keys[Math.floor(Math.random() * keys.length)];
    
    // Walk through connected points to create chain (8-30 points)
    const chainLength = 8 + Math.floor(Math.random() * 23);
    const chain = [];
    const visited = new Set();
    let currentKey = startKey;
    
    for (let i = 0; i < chainLength && currentKey; i++) {
      const node = adjacencyMap.get(currentKey);
      if (!node) break;
      
      chain.push(node.pos);
      visited.add(currentKey);
      
      // Pick random unvisited neighbor
      const unvisitedNeighbors = node.neighbors.filter(n => !visited.has(n));
      if (unvisitedNeighbors.length > 0) {
        currentKey = unvisitedNeighbors[Math.floor(Math.random() * unvisitedNeighbors.length)];
      } else {
        break;
      }
    }
    
    if (chain.length >= 3) {
      const colors = [COLORS.cyan, COLORS.magenta, COLORS.purple];
      return {
        id: Math.random(),
        chain,
        color: colors[Math.floor(Math.random() * colors.length)],
        startTime: time,
        duration: 800 + Math.random() * 400,
        activeIndex: 0
      };
    }
    return null;
  };
  
  useFrame((state) => {
    const time = state.clock.elapsedTime * 1000;
    
    // Trigger new lightning batch every 2-6 seconds
    if (time - lastFlashTime.current > nextFlashDelay.current && adjacencyMap.size > 0) {
      lastFlashTime.current = time;
      nextFlashDelay.current = 2000 + Math.random() * 4000;
      
      const keys = Array.from(adjacencyMap.keys());
      
      // Create 1-5 simultaneous lightnings
      const numLightnings = 1 + Math.floor(Math.random() * 5);
      const newLightnings = [];
      
      for (let i = 0; i < numLightnings; i++) {
        const lightning = createLightning(time + i * 50, keys); // slight delay between each
        if (lightning) newLightnings.push(lightning);
      }
      
      if (newLightnings.length > 0) {
        setLightnings(prev => [...prev.filter(l => {
          const elapsed = time - l.startTime;
          return elapsed < l.duration;
        }), ...newLightnings]);
      }
    }
    
    // Update all lightning travel progress
    setLightnings(prev => {
      let updated = false;
      const newLightnings = prev.map(lightning => {
        const elapsed = time - lightning.startTime;
        const progress = elapsed / lightning.duration;
        
        if (progress >= 1) {
          updated = true;
          return null;
        }
        
        const activeIndex = Math.floor(progress * lightning.chain.length * 1.5);
        if (activeIndex !== lightning.activeIndex) {
          updated = true;
          return { ...lightning, activeIndex };
        }
        return lightning;
      }).filter(Boolean);
      
      return updated ? newLightnings : prev;
    });
  });
  
  if (lightnings.length === 0) return null;
  
  const trailLength = 6;
  
  return (
    <group>
      {lightnings.map(lightning => (
        <group key={lightning.id}>
          {lightning.chain.map((pos, idx) => {
            const distFromHead = lightning.activeIndex - idx;
            if (distFromHead < 0 || distFromHead > trailLength) return null;
            
            const intensity = 1 - (distFromHead / trailLength);
            
            return (
              <mesh key={idx} position={[pos.x, pos.y, pos.z]}>
                <sphereGeometry args={[0.018, 6, 6]} />
                <meshBasicMaterial
                  color={lightning.color}
                  transparent
                  opacity={intensity * 0.95}
                  blending={THREE.AdditiveBlending}
                />
              </mesh>
            );
          })}
          
          {lightning.chain.map((pos, idx) => {
            if (idx === 0) return null;
            const prevPos = lightning.chain[idx - 1];
            
            const distFromHead = lightning.activeIndex - idx;
            if (distFromHead < 0 || distFromHead > trailLength) return null;
            
            const intensity = 1 - (distFromHead / trailLength);
            
            return (
              <line key={`line-${idx}`}>
                <bufferGeometry>
                  <bufferAttribute
                    attach="attributes-position"
                    count={2}
                    array={new Float32Array([prevPos.x, prevPos.y, prevPos.z, pos.x, pos.y, pos.z])}
                    itemSize={3}
                  />
                </bufferGeometry>
                <lineBasicMaterial
                  color={lightning.color}
                  transparent
                  opacity={intensity * 0.9}
                  linewidth={2}
                  blending={THREE.AdditiveBlending}
                />
              </line>
            );
          })}
        </group>
      ))}
    </group>
  );
}

// Line Brain - Uses real brain OBJ with face-based edges for proper wireframe
function ParticleBrain({ onLoaded }) {
  const linesRef = useRef();
  const { data, loading, error } = useBrainData('/models/BrainUVS.obj');
  
  // Notify parent when brain is loaded
  useEffect(() => {
    if (!loading && data && onLoaded) {
      onLoaded();
    }
  }, [loading, data, onLoaded]);
  
  // Create line connections from brain mesh edges
  const lineData = useMemo(() => {
    if (!data || !data.vertices || !data.edges) return null;
    
    const vertices = data.vertices;
    const edges = data.edges;
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
      
      // Use ellipsoid-adjusted distance to account for brain shape
      const adjustedY = y * 0.7;
      const dist = Math.sqrt(x * x + adjustedY * adjustedY + z * z);
      maxDist = Math.max(maxDist, dist);
      
      normalizedVertices.push({ x, y, z, dist, index: i });
    }
    
    // Calculate distance threshold for surface vertices (outer 40%)
    const surfaceThreshold = maxDist * 0.6;
    
    // Create line connections from mesh edges
    const linePositions = [];
    const lineColors = [];
    const connectedVertices = new Map();
    
    const purple = new THREE.Color(COLORS.purple);
    const cyan = new THREE.Color(COLORS.cyan);
    const magenta = new THREE.Color(COLORS.magenta);
    
    // Sample every Nth edge for performance (58k edges -> ~10k)
    const edgeSampleRate = 6;
    
    for (let i = 0; i < edges.length; i += edgeSampleRate) {
      const [aIdx, bIdx] = edges[i];
      if (aIdx >= vertexCount || bIdx >= vertexCount) continue;
      
      const v1 = normalizedVertices[aIdx];
      const v2 = normalizedVertices[bIdx];
      
      // Only keep surface edges (both vertices on surface or top of brain)
      const v1Surface = v1.dist >= surfaceThreshold || v1.y > 1.2;
      const v2Surface = v2.dist >= surfaceThreshold || v2.y > 1.2;
      
      // Check midpoint is also on surface
      const midX = (v1.x + v2.x) / 2;
      const midY = (v1.y + v2.y) / 2;
      const midZ = (v1.z + v2.z) / 2;
      const midDist = Math.sqrt(midX * midX + (midY * 0.7) ** 2 + midZ * midZ);
      const midSurface = midDist >= surfaceThreshold * 0.95 || midY > 1.2;
      
      if (v1Surface && v2Surface && midSurface) {
        linePositions.push(v1.x, v1.y, v1.z);
        linePositions.push(v2.x, v2.y, v2.z);
        
        // Color gradient based on Y position
        const t1 = (v1.y + 2) / 4;
        const t2 = (v2.y + 2) / 4;
        
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
        if (!connectedVertices.has(aIdx)) {
          connectedVertices.set(aIdx, { x: v1.x, y: v1.y, z: v1.z, color: color1 });
        }
        if (!connectedVertices.has(bIdx)) {
          connectedVertices.set(bIdx, { x: v2.x, y: v2.y, z: v2.z, color: color2 });
        }
      }
    }
    
    // Create node positions and colors arrays (excluding those near section squares)
    const nodePositions = [];
    const nodeColors = [];
    const sectionPositions = SECTIONS.map(s => s.position);
    const minDistFromSquares = 0.5;
    
    // Sample nodes for performance
    const nodeArray = Array.from(connectedVertices.values());
    const nodeSampleRate = 4;
    
    for (let i = 0; i < nodeArray.length; i += nodeSampleRate) {
      const vertex = nodeArray[i];
      
      // Check if this node is too close to any section square
      let tooClose = false;
      for (const sp of sectionPositions) {
        const dx = vertex.x - sp[0];
        const dy = vertex.y - sp[1];
        const dz = vertex.z - sp[2];
        const distToSquare = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (distToSquare < minDistFromSquares) {
          tooClose = true;
          break;
        }
      }
      
      if (!tooClose) {
        nodePositions.push(vertex.x, vertex.y, vertex.z);
        nodeColors.push(vertex.color.r, vertex.color.g, vertex.color.b);
      }
    }
    
    return {
      positions: new Float32Array(linePositions),
      colors: new Float32Array(lineColors),
      count: linePositions.length / 3,
      nodePositions: new Float32Array(nodePositions),
      nodeColors: new Float32Array(nodeColors),
      nodeCount: nodePositions.length / 3
    };
  }, [data]);
  
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
          opacity={0.25}
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
          opacity={0.6}
          sizeAttenuation
        />
      </points>
      
      {/* Neural lightning effect */}
      <NeuralLightning 
        nodePositions={lineData.nodePositions} 
        linePositions={lineData.positions} 
      />
    </group>
  );
}



// Main exported component
export default function BrainPortfolio({ onSectionClick }) {
  const groupRef = useRef();
  const [brainLoaded, setBrainLoaded] = useState(false);
  
  const handleBrainLoaded = () => {
    setBrainLoaded(true);
  };
  
  return (
    <>
      {/* Camera zoom-in animation */}
      <CameraAnimation brainLoaded={brainLoaded} />
      
      {/* Orbit Controls - enables zoom, rotate */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={25}
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
        <ParticleBrain onLoaded={handleBrainLoaded} />
        
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
