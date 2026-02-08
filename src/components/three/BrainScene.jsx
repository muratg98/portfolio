import { useRef, useMemo, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { useTheme } from '../../context/ThemeContext';

// Psychology/Coder color palette
const COLORS = {
  purple: '#963CBD',
  coral: '#FF6F61',
  magenta: '#C5299B',
  orange: '#FEAE51',
  cyan: '#00D9FF',
  darkPurple: '#1a0a2e',
};

// Custom shader material for the brain cubes
const vertexShader = `
  attribute float aScale;
  attribute vec3 aColor;
  
  varying vec3 vColor;
  varying float vScale;
  
  void main() {
    vColor = aColor;
    vScale = aScale;
    
    vec4 modelPosition = modelMatrix * instanceMatrix * vec4(position * aScale, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    
    gl_Position = projectedPosition;
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  varying float vScale;
  
  void main() {
    // Create glowing wireframe effect
    float alpha = 0.6 + vScale * 0.4;
    gl_FragColor = vec4(vColor, alpha);
  }
`;

// Create procedural brain geometry from multiple deformed spheres
function createBrainGeometry() {
  const positions = [];
  
  // Left hemisphere
  const leftHemisphere = new THREE.SphereGeometry(1.2, 32, 24);
  leftHemisphere.translate(-0.4, 0, 0);
  leftHemisphere.scale(1, 0.85, 1.1);
  
  // Apply brain-like deformation to left hemisphere
  const leftPositions = leftHemisphere.attributes.position;
  for (let i = 0; i < leftPositions.count; i++) {
    const x = leftPositions.getX(i);
    const y = leftPositions.getY(i);
    const z = leftPositions.getZ(i);
    
    // Create brain folds/sulci
    const noise = Math.sin(y * 8) * 0.05 + Math.sin(z * 6) * 0.04 + Math.sin(x * 7) * 0.03;
    const frontalBulge = Math.max(0, -z - 0.3) * 0.2;
    
    leftPositions.setX(i, x + noise);
    leftPositions.setY(i, y + noise * 0.5);
    leftPositions.setZ(i, z + frontalBulge);
  }
  
  // Right hemisphere
  const rightHemisphere = new THREE.SphereGeometry(1.2, 32, 24);
  rightHemisphere.translate(0.4, 0, 0);
  rightHemisphere.scale(1, 0.85, 1.1);
  
  // Apply brain-like deformation to right hemisphere
  const rightPositions = rightHemisphere.attributes.position;
  for (let i = 0; i < rightPositions.count; i++) {
    const x = rightPositions.getX(i);
    const y = rightPositions.getY(i);
    const z = rightPositions.getZ(i);
    
    const noise = Math.sin(y * 8) * 0.05 + Math.sin(z * 6) * 0.04 + Math.sin(x * 7) * 0.03;
    const frontalBulge = Math.max(0, -z - 0.3) * 0.2;
    
    rightPositions.setX(i, x + noise);
    rightPositions.setY(i, y + noise * 0.5);
    rightPositions.setZ(i, z + frontalBulge);
  }
  
  // Cerebellum (back lower part)
  const cerebellum = new THREE.SphereGeometry(0.5, 16, 12);
  cerebellum.translate(0, -0.6, 0.8);
  cerebellum.scale(1.4, 0.6, 0.8);
  
  // Brain stem
  const brainStem = new THREE.CylinderGeometry(0.15, 0.2, 0.5, 8);
  brainStem.translate(0, -1.1, 0.3);
  
  // Collect all vertices
  const addVertices = (geometry) => {
    const pos = geometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      positions.push(new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i)));
    }
  };
  
  addVertices(leftHemisphere);
  addVertices(rightHemisphere);
  addVertices(cerebellum);
  addVertices(brainStem);
  
  // Remove duplicate/close vertices
  const uniquePositions = [];
  const threshold = 0.08;
  
  for (const pos of positions) {
    let isDuplicate = false;
    for (const unique of uniquePositions) {
      if (pos.distanceTo(unique) < threshold) {
        isDuplicate = true;
        break;
      }
    }
    if (!isDuplicate) {
      uniquePositions.push(pos);
    }
  }
  
  return uniquePositions;
}

// Floating neural particles around the brain
function NeuralParticles({ count = 150 }) {
  const { theme } = useTheme();
  const pointsRef = useRef();
  
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = [];
    
    for (let i = 0; i < count; i++) {
      // Position particles in a sphere around the brain
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2 + Math.random() * 3;
      
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      
      vel.push({
        x: (Math.random() - 0.5) * 0.01,
        y: (Math.random() - 0.5) * 0.01,
        z: (Math.random() - 0.5) * 0.01,
      });
    }
    
    return [pos, vel];
  }, [count]);
  
  useFrame((state) => {
    if (!pointsRef.current) return;
    
    const positionAttr = pointsRef.current.geometry.attributes.position;
    const time = state.clock.elapsedTime;
    
    for (let i = 0; i < count; i++) {
      let x = positionAttr.getX(i);
      let y = positionAttr.getY(i);
      let z = positionAttr.getZ(i);
      
      // Orbital motion with noise
      const angle = time * 0.1 + i * 0.01;
      x += Math.sin(angle + i) * 0.002;
      y += Math.cos(angle + i * 0.5) * 0.002;
      z += Math.sin(angle * 0.5 + i) * 0.002;
      
      // Keep within bounds
      const dist = Math.sqrt(x * x + y * y + z * z);
      if (dist > 5) {
        const scale = 5 / dist;
        x *= scale;
        y *= scale;
        z *= scale;
      }
      if (dist < 2) {
        const scale = 2 / dist;
        x *= scale;
        y *= scale;
        z *= scale;
      }
      
      positionAttr.setXYZ(i, x, y, z);
    }
    
    positionAttr.needsUpdate = true;
  });
  
  const particleColor = theme === 'dark' ? COLORS.cyan : COLORS.purple;
  
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color={particleColor}
        transparent
        opacity={0.8}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Neural connection lines
function NeuralConnections() {
  const { theme } = useTheme();
  const linesRef = useRef();
  
  const linePositions = useMemo(() => {
    const positions = [];
    const connectionCount = 30;
    
    for (let i = 0; i < connectionCount; i++) {
      // Start point on brain surface
      const theta1 = Math.random() * Math.PI * 2;
      const phi1 = Math.acos(2 * Math.random() - 1);
      const r1 = 1.2 + Math.random() * 0.3;
      
      const x1 = r1 * Math.sin(phi1) * Math.cos(theta1);
      const y1 = r1 * Math.sin(phi1) * Math.sin(theta1) * 0.85;
      const z1 = r1 * Math.cos(phi1);
      
      // End point further out
      const theta2 = theta1 + (Math.random() - 0.5) * 0.5;
      const phi2 = phi1 + (Math.random() - 0.5) * 0.5;
      const r2 = r1 + 1 + Math.random() * 2;
      
      const x2 = r2 * Math.sin(phi2) * Math.cos(theta2);
      const y2 = r2 * Math.sin(phi2) * Math.sin(theta2);
      const z2 = r2 * Math.cos(phi2);
      
      positions.push(x1, y1, z1, x2, y2, z2);
    }
    
    return new Float32Array(positions);
  }, []);
  
  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });
  
  const lineColor = theme === 'dark' ? COLORS.magenta : COLORS.purple;
  
  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={linePositions.length / 3}
          array={linePositions}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial
        color={lineColor}
        transparent
        opacity={0.2}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
}

// Main brain mesh with instanced cubes
function BrainMesh() {
  const { theme } = useTheme();
  const meshRef = useRef();
  const instancedMeshRef = useRef();
  const { raycaster, camera, pointer } = useThree();
  
  const [hovered, setHovered] = useState(null);
  const scalesRef = useRef([]);
  const colorsRef = useRef([]);
  
  // Generate brain vertex positions
  const brainVertices = useMemo(() => createBrainGeometry(), []);
  
  // Setup instanced mesh data
  const { matrices, scales, colors, colorArray } = useMemo(() => {
    const matrices = [];
    const scales = [];
    const colors = [];
    const colorArray = new Float32Array(brainVertices.length * 3);
    
    const colorPalette = [
      new THREE.Color(COLORS.purple),
      new THREE.Color(COLORS.coral),
      new THREE.Color(COLORS.magenta),
      new THREE.Color(COLORS.orange),
    ];
    
    for (let i = 0; i < brainVertices.length; i++) {
      const matrix = new THREE.Matrix4();
      matrix.setPosition(brainVertices[i]);
      
      // Random slight rotation for each cube
      const rotMatrix = new THREE.Matrix4().makeRotationFromEuler(
        new THREE.Euler(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        )
      );
      matrix.multiply(rotMatrix);
      
      matrices.push(matrix);
      scales.push(1);
      
      // Assign colors based on position (create gradients across brain)
      const normalizedY = (brainVertices[i].y + 1.5) / 3;
      const colorIndex = Math.floor(normalizedY * (colorPalette.length - 1));
      const color = colorPalette[Math.min(colorIndex, colorPalette.length - 1)];
      
      colors.push(color);
      colorArray[i * 3] = color.r;
      colorArray[i * 3 + 1] = color.g;
      colorArray[i * 3 + 2] = color.b;
    }
    
    return { matrices, scales, colors, colorArray };
  }, [brainVertices]);
  
  // Initialize refs
  useEffect(() => {
    scalesRef.current = [...scales];
    colorsRef.current = [...colors];
  }, [scales, colors]);
  
  // Setup instanced mesh
  useEffect(() => {
    if (!instancedMeshRef.current) return;
    
    const mesh = instancedMeshRef.current;
    
    for (let i = 0; i < matrices.length; i++) {
      mesh.setMatrixAt(i, matrices[i]);
    }
    
    mesh.instanceMatrix.needsUpdate = true;
    
    // Set initial scales
    const scaleAttr = new THREE.InstancedBufferAttribute(
      new Float32Array(brainVertices.length).fill(1),
      1
    );
    mesh.geometry.setAttribute('aScale', scaleAttr);
    
    // Set colors
    const colorAttr = new THREE.InstancedBufferAttribute(colorArray, 3);
    mesh.geometry.setAttribute('aColor', colorAttr);
  }, [matrices, brainVertices.length, colorArray]);
  
  // Mouse interaction and animation
  useFrame((state) => {
    if (!instancedMeshRef.current) return;
    
    const mesh = instancedMeshRef.current;
    const time = state.clock.elapsedTime;
    
    // Slow rotation
    mesh.rotation.y = time * 0.1;
    mesh.rotation.x = Math.sin(time * 0.05) * 0.1;
    
    // Raycasting for hover effect
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObject(mesh);
    
    const scaleAttr = mesh.geometry.attributes.aScale;
    const colorAttr = mesh.geometry.attributes.aColor;
    
    if (!scaleAttr || !colorAttr) return;
    
    // Reset all cubes
    for (let i = 0; i < brainVertices.length; i++) {
      const targetScale = 1;
      const currentScale = scaleAttr.getX(i);
      
      // Smooth interpolation back to normal
      scaleAttr.setX(i, THREE.MathUtils.lerp(currentScale, targetScale, 0.1));
      
      // Pulsing animation
      const pulse = 1 + Math.sin(time * 2 + i * 0.1) * 0.05;
      scaleAttr.setX(i, scaleAttr.getX(i) * pulse);
    }
    
    // Hover effect
    if (intersects.length > 0) {
      const instanceId = intersects[0].instanceId;
      if (instanceId !== undefined) {
        // Expand hovered cube and neighbors
        const hoveredPos = brainVertices[instanceId];
        
        for (let i = 0; i < brainVertices.length; i++) {
          const dist = hoveredPos.distanceTo(brainVertices[i]);
          
          if (dist < 0.5) {
            const scale = 1.5 - dist * 0.8;
            scaleAttr.setX(i, Math.max(scaleAttr.getX(i), scale));
            
            // Change color on hover
            const hoverColor = new THREE.Color(COLORS.cyan);
            const blend = 1 - dist * 2;
            
            const originalColor = colorsRef.current[i];
            const r = THREE.MathUtils.lerp(originalColor.r, hoverColor.r, blend * 0.5);
            const g = THREE.MathUtils.lerp(originalColor.g, hoverColor.g, blend * 0.5);
            const b = THREE.MathUtils.lerp(originalColor.b, hoverColor.b, blend * 0.5);
            
            colorAttr.setXYZ(i, r, g, b);
          } else {
            // Reset to original color
            const originalColor = colorsRef.current[i];
            const currentR = colorAttr.getX(i);
            const currentG = colorAttr.getY(i);
            const currentB = colorAttr.getZ(i);
            
            colorAttr.setXYZ(
              i,
              THREE.MathUtils.lerp(currentR, originalColor.r, 0.1),
              THREE.MathUtils.lerp(currentG, originalColor.g, 0.1),
              THREE.MathUtils.lerp(currentB, originalColor.b, 0.1)
            );
          }
        }
      }
    }
    
    scaleAttr.needsUpdate = true;
    colorAttr.needsUpdate = true;
  });
  
  // Custom shader material
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, []);
  
  return (
    <group>
      <instancedMesh
        ref={instancedMeshRef}
        args={[null, null, brainVertices.length]}
        material={shaderMaterial}
      >
        <boxGeometry args={[0.06, 0.06, 0.06]} />
      </instancedMesh>
    </group>
  );
}

// Glow effect ring
function GlowRing() {
  const { theme } = useTheme();
  const ringRef = useRef();
  
  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.PI / 2;
      ringRef.current.rotation.z = state.clock.elapsedTime * 0.2;
    }
  });
  
  const ringColor = theme === 'dark' ? COLORS.purple : COLORS.magenta;
  
  return (
    <mesh ref={ringRef} position={[0, 0, 0]}>
      <torusGeometry args={[2.5, 0.02, 16, 100]} />
      <meshBasicMaterial
        color={ringColor}
        transparent
        opacity={0.3}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

// Main exported component
export default function BrainScene() {
  const { theme } = useTheme();
  
  return (
    <>
      {/* Ambient lighting */}
      <ambientLight intensity={0.2} />
      
      {/* Colored point lights */}
      <pointLight position={[5, 5, 5]} intensity={1} color={COLORS.purple} />
      <pointLight position={[-5, -5, 5]} intensity={0.8} color={COLORS.magenta} />
      <pointLight position={[0, 5, -5]} intensity={0.6} color={COLORS.cyan} />
      
      {/* Brain visualization */}
      <group position={[0, 0, 0]} scale={1.5}>
        <BrainMesh />
        <NeuralParticles count={200} />
        <NeuralConnections />
        <GlowRing />
      </group>
    </>
  );
}
