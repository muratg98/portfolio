import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Colors matching the main brain
const COLORS = {
  purple: '#963CBD',
  magenta: '#C5299B',
  cyan: '#00D9FF',
};

// Custom hook to load and parse brain OBJ data
function useBrainData(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    
    fetch(url)
      .then(response => response.text())
      .then(text => {
        if (cancelled) return;
        
        const vertices = [];
        const edges = [];
        const lines = text.split('\n');
        
        for (const line of lines) {
          const parts = line.trim().split(/\s+/);
          if (parts[0] === 'v') {
            vertices.push(
              parseFloat(parts[1]),
              parseFloat(parts[2]),
              parseFloat(parts[3])
            );
          } else if (parts[0] === 'f') {
            const faceIndices = parts.slice(1).map(p => parseInt(p.split('/')[0]) - 1);
            
            for (let i = 0; i < faceIndices.length; i++) {
              const a = faceIndices[i];
              const b = faceIndices[(i + 1) % faceIndices.length];
              edges.push([Math.min(a, b), Math.max(a, b)]);
            }
          }
        }
        
        setData({ vertices: new Float32Array(vertices), edges });
        setLoading(false);
      })
      .catch(err => {
        if (cancelled) return;
        setError(err);
        setLoading(false);
      });
      
    return () => { cancelled = true; };
  }, [url]);

  return { data, loading, error };
}

// Simplified brain wireframe for hero section
function BrainWireframe() {
  const linesRef = useRef();
  const groupRef = useRef();
  const materialRef = useRef();
  const { data, loading } = useBrainData('/models/BrainUVS.obj');

  // Create line connections from brain mesh edges (simplified version)
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
    const scaleFactor = 3.0 / maxRange;

    const normalizedVertices = [];
    let maxDist = 0;

    for (let i = 0; i < vertexCount; i++) {
      const x = (vertices[i * 3] - centerX) * scaleFactor;
      const y = (vertices[i * 3 + 1] - centerY) * scaleFactor;
      const z = (vertices[i * 3 + 2] - centerZ) * scaleFactor;

      const adjustedY = y * 0.7;
      const dist = Math.sqrt(x * x + adjustedY * adjustedY + z * z);
      maxDist = Math.max(maxDist, dist);

      normalizedVertices.push({ x, y, z, dist, index: i });
    }

    const surfaceThreshold = maxDist * 0.5;

    const linePositions = [];
    const lineColors = [];

    const purple = new THREE.Color(COLORS.purple);
    const cyan = new THREE.Color(COLORS.cyan);
    const magenta = new THREE.Color(COLORS.magenta);

    // Sample edges for performance (every 3rd edge)
    const edgeSampleRate = 3;

    for (let i = 0; i < edges.length; i += edgeSampleRate) {
      const [aIdx, bIdx] = edges[i];
      if (aIdx >= vertexCount || bIdx >= vertexCount) continue;

      const v1 = normalizedVertices[aIdx];
      const v2 = normalizedVertices[bIdx];

      const v1Surface = v1.dist >= surfaceThreshold || v1.y > 0.8;
      const v2Surface = v2.dist >= surfaceThreshold || v2.y > 0.8;

      const midX = (v1.x + v2.x) / 2;
      const midY = (v1.y + v2.y) / 2;
      const midZ = (v1.z + v2.z) / 2;
      const midDist = Math.sqrt(midX * midX + (midY * 0.7) ** 2 + midZ * midZ);
      const midSurface = midDist >= surfaceThreshold * 0.85 || midY > 0.8;

      if (v1Surface && v2Surface && midSurface) {
        linePositions.push(v1.x, v1.y, v1.z);
        linePositions.push(v2.x, v2.y, v2.z);

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
      }
    }

    return {
      positions: new Float32Array(linePositions),
      colors: new Float32Array(lineColors),
    };
  }, [data]);

  // Gentle rotation animation (no pulse effect)
  useFrame((state) => {
    if (!groupRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    // Slow rotation only - no scaling/pulse
    groupRef.current.rotation.y = time * 0.15;
  });

  if (!lineData) return null;

  return (
    <group ref={groupRef}>
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={lineData.positions.length / 3}
            array={lineData.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={lineData.colors.length / 3}
            array={lineData.colors}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          ref={materialRef}
          vertexColors
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* Inner glow sphere */}
      <mesh>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial
          color={COLORS.purple}
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

// Main Hero Brain component - lightweight version for landing page
export default function HeroBrain() {
  return (
    <>
      {/* Minimal lighting */}
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={0.4} color={COLORS.purple} />
      <pointLight position={[-5, -5, -5]} intensity={0.2} color={COLORS.cyan} />

      {/* Brain wireframe */}
      <BrainWireframe />

      {/* Orbit controls - user can interact but no zoom */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        minPolarAngle={Math.PI * 0.3}
        maxPolarAngle={Math.PI * 0.7}
      />
    </>
  );
}
