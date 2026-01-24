/**
 * HologramViewer - 3D Holographic Visualization Component
 * Features: Sacred Geometry, Illuminati Pyramid, DNA, Galaxy, Waves
 */

import React, { useEffect, useRef, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface HologramViewerProps {
  type: string;
  text?: string;
  onClose: () => void;
}

// Neon color palette
const COLORS = {
  primary: 0x00ff88,
  secondary: 0x00ffff,
  accent: 0xff00ff,
  gold: 0xffd700,
  orange: 0xff6600,
  purple: 0x9933ff,
  white: 0xffffff,
};

const HologramViewer: React.FC<HologramViewerProps> = ({ type = 'cube', text, onClose }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animationRef = useRef<number>(0);
  const hologramRef = useRef<THREE.Group | null>(null);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClose]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050510);
    scene.fog = new THREE.Fog(0x050510, 10, 50);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 3, 8);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 3;
    controls.maxDistance = 20;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    controlsRef.current = controls;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x222244, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(COLORS.primary, 1, 100);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(COLORS.accent, 0.5, 100);
    pointLight2.position.set(-10, -10, -10);
    scene.add(pointLight2);

    // Grid floor
    const gridHelper = new THREE.GridHelper(20, 20, COLORS.primary, 0x003322);
    gridHelper.position.y = -3;
    gridHelper.material.opacity = 0.2;
    gridHelper.material.transparent = true;
    scene.add(gridHelper);

    // Ambient particles
    const particleCount = 300;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 30;
      particlePositions[i + 1] = (Math.random() - 0.5) * 30;
      particlePositions[i + 2] = (Math.random() - 0.5) * 30;
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: COLORS.primary,
      size: 0.05,
      transparent: true,
      opacity: 0.6,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Create hologram based on type
    const hologramGroup = new THREE.Group();
    hologramRef.current = hologramGroup;
    scene.add(hologramGroup);

    const createHologram = () => {
      // Clear existing
      while (hologramGroup.children.length > 0) {
        hologramGroup.remove(hologramGroup.children[0]);
      }

      switch (type.toLowerCase()) {
        case 'cube':
          createCube(hologramGroup);
          break;
        case 'sphere':
          createSphere(hologramGroup);
          break;
        case 'torus':
          createTorus(hologramGroup);
          break;
        case 'pyramid':
          createPyramid(hologramGroup);
          break;
        case 'dna':
          createDNA(hologramGroup);
          break;
        case 'galaxy':
          createGalaxy(hologramGroup);
          break;
        case 'wave':
          createWave(hologramGroup);
          break;
        case 'text':
          createText(hologramGroup, text || 'HELLO');
          break;
        case 'particles':
          createParticles(hologramGroup);
          break;
        case 'sacred':
        case 'geometry':
        case 'sacredgeometry':
          createSacredGeometry(hologramGroup);
          break;
        case 'illuminati':
        case 'eye':
        case 'allseeingeye':
          createIlluminatiPyramid(hologramGroup);
          break;
        case 'metatron':
          createMetatronCube(hologramGroup);
          break;
        case 'flower':
        case 'floweroflife':
          createFlowerOfLife(hologramGroup);
          break;
        case 'tesseract':
        case 'hypercube':
          createTesseract(hologramGroup);
          break;
        case 'icosahedron':
          createIcosahedron(hologramGroup);
          break;
        default:
          createCube(hologramGroup);
      }
    };

    // === HOLOGRAM CREATION FUNCTIONS ===

    function createCube(group: THREE.Group) {
      // Outer wireframe cube
      const outerGeometry = new THREE.BoxGeometry(3, 3, 3);
      const outerEdges = new THREE.EdgesGeometry(outerGeometry);
      const outerMaterial = new THREE.LineBasicMaterial({ color: COLORS.primary, linewidth: 2 });
      const outerCube = new THREE.LineSegments(outerEdges, outerMaterial);
      group.add(outerCube);

      // Inner solid cube
      const innerGeometry = new THREE.BoxGeometry(2, 2, 2);
      const innerMaterial = new THREE.MeshBasicMaterial({
        color: COLORS.secondary,
        transparent: true,
        opacity: 0.3,
        wireframe: true,
      });
      const innerCube = new THREE.Mesh(innerGeometry, innerMaterial);
      group.add(innerCube);

      // Corner spheres
      const corners = [
        [-1.5, -1.5, -1.5], [1.5, -1.5, -1.5], [-1.5, 1.5, -1.5], [1.5, 1.5, -1.5],
        [-1.5, -1.5, 1.5], [1.5, -1.5, 1.5], [-1.5, 1.5, 1.5], [1.5, 1.5, 1.5],
      ];
      corners.forEach(([x, y, z]) => {
        const sphereGeometry = new THREE.SphereGeometry(0.1, 16, 16);
        const sphereMaterial = new THREE.MeshBasicMaterial({ color: COLORS.accent });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.set(x, y, z);
        group.add(sphere);
      });
    }

    function createSphere(group: THREE.Group) {
      // Main sphere
      const sphereGeometry = new THREE.IcosahedronGeometry(2, 2);
      const sphereMaterial = new THREE.MeshBasicMaterial({
        color: COLORS.secondary,
        wireframe: true,
        transparent: true,
        opacity: 0.8,
      });
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      group.add(sphere);

      // Inner glowing core
      const coreGeometry = new THREE.SphereGeometry(0.5, 32, 32);
      const coreMaterial = new THREE.MeshBasicMaterial({
        color: COLORS.accent,
        transparent: true,
        opacity: 0.8,
      });
      group.add(new THREE.Mesh(coreGeometry, coreMaterial));

      // Orbital rings
      for (let i = 0; i < 3; i++) {
        const ringGeometry = new THREE.TorusGeometry(2.5 + i * 0.3, 0.03, 8, 64);
        const ringMaterial = new THREE.MeshBasicMaterial({
          color: i === 0 ? COLORS.primary : i === 1 ? COLORS.accent : COLORS.secondary,
          transparent: true,
          opacity: 0.7,
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2 + (i * Math.PI) / 6;
        ring.rotation.y = (i * Math.PI) / 4;
        group.add(ring);
      }
    }

    function createTorus(group: THREE.Group) {
      // Main torus
      const torusGeometry = new THREE.TorusGeometry(2, 0.8, 24, 64);
      const torusMaterial = new THREE.MeshBasicMaterial({
        color: COLORS.primary,
        wireframe: true,
      });
      const torus = new THREE.Mesh(torusGeometry, torusMaterial);
      group.add(torus);

      // Inner torus
      const innerTorusGeometry = new THREE.TorusGeometry(1.5, 0.4, 24, 48);
      const innerTorusMaterial = new THREE.MeshBasicMaterial({
        color: COLORS.accent,
        wireframe: true,
        transparent: true,
        opacity: 0.6,
      });
      const innerTorus = new THREE.Mesh(innerTorusGeometry, innerTorusMaterial);
      innerTorus.rotation.x = Math.PI / 2;
      group.add(innerTorus);

      // Tiny core torus
      const coreTorusGeometry = new THREE.TorusGeometry(0.8, 0.2, 16, 32);
      const coreTorusMaterial = new THREE.MeshBasicMaterial({
        color: COLORS.secondary,
        wireframe: true,
        transparent: true,
        opacity: 0.8,
      });
      const coreTorus = new THREE.Mesh(coreTorusGeometry, coreTorusMaterial);
      coreTorus.rotation.y = Math.PI / 2;
      group.add(coreTorus);
    }

    function createPyramid(group: THREE.Group) {
      // Main pyramid
      const pyramidGeometry = new THREE.ConeGeometry(2, 3, 4);
      const pyramidEdges = new THREE.EdgesGeometry(pyramidGeometry);
      const pyramidMaterial = new THREE.LineBasicMaterial({ color: COLORS.gold });
      const pyramid = new THREE.LineSegments(pyramidEdges, pyramidMaterial);
      pyramid.rotation.y = Math.PI / 4;
      group.add(pyramid);

      // Pyramid faces
      const facesMaterial = new THREE.MeshBasicMaterial({
        color: COLORS.gold,
        transparent: true,
        opacity: 0.15,
        side: THREE.DoubleSide,
      });
      const facesPyramid = new THREE.Mesh(pyramidGeometry.clone(), facesMaterial);
      facesPyramid.rotation.y = Math.PI / 4;
      group.add(facesPyramid);

      // Glowing base
      const baseGeometry = new THREE.RingGeometry(0, 2.83, 4);
      const baseMaterial = new THREE.MeshBasicMaterial({
        color: COLORS.gold,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
      });
      const base = new THREE.Mesh(baseGeometry, baseMaterial);
      base.rotation.x = -Math.PI / 2;
      base.rotation.z = Math.PI / 4;
      base.position.y = -1.5;
      group.add(base);
    }

    function createDNA(group: THREE.Group) {
      const helixPoints1: THREE.Vector3[] = [];
      const helixPoints2: THREE.Vector3[] = [];
      const numPoints = 100;

      for (let i = 0; i < numPoints; i++) {
        const t = (i / numPoints) * Math.PI * 4;
        const y = (i / numPoints) * 6 - 3;
        helixPoints1.push(new THREE.Vector3(Math.cos(t) * 1.5, y, Math.sin(t) * 1.5));
        helixPoints2.push(new THREE.Vector3(Math.cos(t + Math.PI) * 1.5, y, Math.sin(t + Math.PI) * 1.5));
      }

      // Helix strands
      const curve1 = new THREE.CatmullRomCurve3(helixPoints1);
      const curve2 = new THREE.CatmullRomCurve3(helixPoints2);

      const tubeGeometry1 = new THREE.TubeGeometry(curve1, 100, 0.1, 8, false);
      const tubeGeometry2 = new THREE.TubeGeometry(curve2, 100, 0.1, 8, false);

      const material1 = new THREE.MeshBasicMaterial({ color: COLORS.primary });
      const material2 = new THREE.MeshBasicMaterial({ color: COLORS.accent });

      group.add(new THREE.Mesh(tubeGeometry1, material1));
      group.add(new THREE.Mesh(tubeGeometry2, material2));

      // Connecting bars
      for (let i = 0; i < numPoints; i += 5) {
        const barGeometry = new THREE.CylinderGeometry(0.05, 0.05, 3, 8);
        const barMaterial = new THREE.MeshBasicMaterial({
          color: COLORS.secondary,
          transparent: true,
          opacity: 0.6,
        });
        const bar = new THREE.Mesh(barGeometry, barMaterial);
        bar.position.copy(helixPoints1[i].clone().add(helixPoints2[i]).multiplyScalar(0.5));
        bar.lookAt(helixPoints2[i]);
        bar.rotateX(Math.PI / 2);
        group.add(bar);
      }
    }

    function createGalaxy(group: THREE.Group) {
      const starCount = 3000;
      const positions = new Float32Array(starCount * 3);
      const colors = new Float32Array(starCount * 3);

      for (let i = 0; i < starCount; i++) {
        const i3 = i * 3;
        const radius = Math.random() * 5;
        const spinAngle = radius * 3;
        const branchAngle = ((i % 3) / 3) * Math.PI * 2;

        const randomX = (Math.random() - 0.5) * (0.5 + radius * 0.1);
        const randomY = (Math.random() - 0.5) * 0.5;
        const randomZ = (Math.random() - 0.5) * (0.5 + radius * 0.1);

        positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
        positions[i3 + 1] = randomY;
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

        // Color gradient
        const mixedColor = new THREE.Color();
        const innerColor = new THREE.Color(COLORS.accent);
        const outerColor = new THREE.Color(COLORS.primary);
        mixedColor.lerpColors(innerColor, outerColor, radius / 5);
        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
      }

      const galaxyGeometry = new THREE.BufferGeometry();
      galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const galaxyMaterial = new THREE.PointsMaterial({
        size: 0.08,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
      });

      const galaxy = new THREE.Points(galaxyGeometry, galaxyMaterial);
      group.add(galaxy);

      // Central glow
      const coreGeometry = new THREE.SphereGeometry(0.3, 16, 16);
      const coreMaterial = new THREE.MeshBasicMaterial({
        color: COLORS.white,
        transparent: true,
        opacity: 0.8,
      });
      group.add(new THREE.Mesh(coreGeometry, coreMaterial));
    }

    function createWave(group: THREE.Group) {
      // Main wave surface
      const waveGeometry = new THREE.PlaneGeometry(12, 12, 80, 80);
      const waveMaterial = new THREE.MeshBasicMaterial({
        color: COLORS.secondary,
        wireframe: true,
        transparent: true,
        opacity: 0.7,
      });
      const wave = new THREE.Mesh(waveGeometry, waveMaterial);
      wave.rotation.x = -Math.PI / 2;
      wave.userData.originalPositions = waveGeometry.attributes.position.array.slice();
      wave.userData.waveType = 'main';
      group.add(wave);

      // Second wave layer (cross pattern)
      const wave2Geometry = new THREE.PlaneGeometry(12, 12, 40, 40);
      const wave2Material = new THREE.MeshBasicMaterial({
        color: COLORS.accent,
        wireframe: true,
        transparent: true,
        opacity: 0.3,
      });
      const wave2 = new THREE.Mesh(wave2Geometry, wave2Material);
      wave2.rotation.x = -Math.PI / 2;
      wave2.position.y = 0.3;
      wave2.userData.originalPositions = wave2Geometry.attributes.position.array.slice();
      wave2.userData.waveType = 'secondary';
      group.add(wave2);

      // Third wave layer (ripple effect)
      const wave3Geometry = new THREE.PlaneGeometry(12, 12, 50, 50);
      const wave3Material = new THREE.MeshBasicMaterial({
        color: COLORS.primary,
        wireframe: true,
        transparent: true,
        opacity: 0.4,
      });
      const wave3 = new THREE.Mesh(wave3Geometry, wave3Material);
      wave3.rotation.x = -Math.PI / 2;
      wave3.position.y = -0.3;
      wave3.userData.originalPositions = wave3Geometry.attributes.position.array.slice();
      wave3.userData.waveType = 'ripple';
      group.add(wave3);
    }

    function createText(group: THREE.Group, message: string) {
      // Create 3D text using sprites (no font loading required)
      const chars = message.toUpperCase().split('');
      const spacing = 1.2;
      const startX = -((chars.length - 1) * spacing) / 2;

      chars.forEach((char, index) => {
        // Create canvas for each character
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d')!;

        // Draw character
        ctx.fillStyle = 'transparent';
        ctx.fillRect(0, 0, 128, 128);
        ctx.font = 'bold 80px Arial, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#00ff88';
        ctx.fillText(char, 64, 64);

        // Add glow
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 20;
        ctx.fillText(char, 64, 64);

        // Create sprite
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({
          map: texture,
          transparent: true,
        });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.position.set(startX + index * spacing, 0, 0);
        sprite.scale.set(2, 2, 1);
        sprite.userData.baseY = 0;
        sprite.userData.offset = index * 0.5;
        group.add(sprite);
      });
    }

    function createParticles(group: THREE.Group) {
      const particleCount = 2000;
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const r = 3 * Math.cbrt(Math.random());

        positions[i3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i3 + 2] = r * Math.cos(phi);

        const color = new THREE.Color();
        color.setHSL(0.4 + Math.random() * 0.2, 1, 0.5 + Math.random() * 0.3);
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
      });

      group.add(new THREE.Points(geometry, material));
    }

    // === SACRED GEOMETRY ===

    function createSacredGeometry(group: THREE.Group) {
      // Merkaba (Star Tetrahedron)
      const size = 2.5;

      // Upward tetrahedron
      const tetra1Geometry = new THREE.TetrahedronGeometry(size);
      const tetra1Edges = new THREE.EdgesGeometry(tetra1Geometry);
      const tetra1Material = new THREE.LineBasicMaterial({ color: COLORS.gold });
      const tetra1 = new THREE.LineSegments(tetra1Edges, tetra1Material);
      group.add(tetra1);

      // Downward tetrahedron (inverted)
      const tetra2Geometry = new THREE.TetrahedronGeometry(size);
      const tetra2Edges = new THREE.EdgesGeometry(tetra2Geometry);
      const tetra2Material = new THREE.LineBasicMaterial({ color: COLORS.secondary });
      const tetra2 = new THREE.LineSegments(tetra2Edges, tetra2Material);
      tetra2.rotation.x = Math.PI;
      group.add(tetra2);

      // Inner sphere
      const sphereGeometry = new THREE.SphereGeometry(size * 0.5, 32, 32);
      const sphereMaterial = new THREE.MeshBasicMaterial({
        color: COLORS.primary,
        transparent: true,
        opacity: 0.2,
        wireframe: true,
      });
      group.add(new THREE.Mesh(sphereGeometry, sphereMaterial));

      // Outer circle rings
      for (let i = 0; i < 3; i++) {
        const ringGeometry = new THREE.TorusGeometry(size * 0.9, 0.02, 8, 64);
        const ringMaterial = new THREE.MeshBasicMaterial({
          color: COLORS.gold,
          transparent: true,
          opacity: 0.5,
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = (i * Math.PI) / 3;
        group.add(ring);
      }
    }

    function createIlluminatiPyramid(group: THREE.Group) {
      // Main pyramid - wireframe
      const pyramidSize = 3;
      const pyramidGeometry = new THREE.ConeGeometry(pyramidSize, pyramidSize * 1.5, 4);
      const pyramidEdges = new THREE.EdgesGeometry(pyramidGeometry);
      const pyramidMaterial = new THREE.LineBasicMaterial({ color: COLORS.gold, linewidth: 2 });
      const pyramid = new THREE.LineSegments(pyramidEdges, pyramidMaterial);
      pyramid.rotation.y = Math.PI / 4;
      pyramid.position.y = -0.5;
      group.add(pyramid);

      // Solid faces with transparency
      const facesMaterial = new THREE.MeshBasicMaterial({
        color: COLORS.gold,
        transparent: true,
        opacity: 0.15,
        side: THREE.DoubleSide,
      });
      const facesPyramid = new THREE.Mesh(pyramidGeometry.clone(), facesMaterial);
      facesPyramid.rotation.y = Math.PI / 4;
      facesPyramid.position.y = -0.5;
      group.add(facesPyramid);

      // All-Seeing Eye
      const eyeGroup = new THREE.Group();

      // Eye outer circle
      const eyeRingGeometry = new THREE.TorusGeometry(0.6, 0.08, 16, 32);
      const eyeRingMaterial = new THREE.MeshBasicMaterial({ color: COLORS.white });
      const eyeRing = new THREE.Mesh(eyeRingGeometry, eyeRingMaterial);
      eyeGroup.add(eyeRing);

      // Eye inner (iris)
      const irisGeometry = new THREE.CircleGeometry(0.4, 32);
      const irisMaterial = new THREE.MeshBasicMaterial({
        color: COLORS.secondary,
        transparent: true,
        opacity: 0.8,
      });
      const iris = new THREE.Mesh(irisGeometry, irisMaterial);
      iris.position.z = 0.01;
      eyeGroup.add(iris);

      // Pupil
      const pupilGeometry = new THREE.CircleGeometry(0.15, 32);
      const pupilMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
      const pupil = new THREE.Mesh(pupilGeometry, pupilMaterial);
      pupil.position.z = 0.02;
      eyeGroup.add(pupil);

      // Pupil highlight
      const highlightGeometry = new THREE.CircleGeometry(0.05, 16);
      const highlightMaterial = new THREE.MeshBasicMaterial({ color: COLORS.white });
      const highlight = new THREE.Mesh(highlightGeometry, highlightMaterial);
      highlight.position.set(0.05, 0.05, 0.03);
      eyeGroup.add(highlight);

      // Eye rays (emanating light)
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const rayGeometry = new THREE.CylinderGeometry(0.02, 0.02, 0.5, 8);
        const rayMaterial = new THREE.MeshBasicMaterial({
          color: COLORS.gold,
          transparent: true,
          opacity: 0.6,
        });
        const ray = new THREE.Mesh(rayGeometry, rayMaterial);
        ray.position.set(Math.cos(angle) * 0.9, Math.sin(angle) * 0.9, 0);
        ray.rotation.z = angle - Math.PI / 2;
        eyeGroup.add(ray);
      }

      eyeGroup.position.y = 1.2;
      group.add(eyeGroup);

      // Glowing aura around eye
      const auraGeometry = new THREE.RingGeometry(0.7, 1.2, 32);
      const auraMaterial = new THREE.MeshBasicMaterial({
        color: COLORS.gold,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide,
      });
      const aura = new THREE.Mesh(auraGeometry, auraMaterial);
      aura.position.y = 1.2;
      group.add(aura);

      // Base rays of light from pyramid base
      for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
        const rayGeometry = new THREE.ConeGeometry(0.1, 2, 8);
        const rayMaterial = new THREE.MeshBasicMaterial({
          color: COLORS.gold,
          transparent: true,
          opacity: 0.3,
        });
        const ray = new THREE.Mesh(rayGeometry, rayMaterial);
        ray.position.set(Math.cos(angle) * 3, -2, Math.sin(angle) * 3);
        ray.rotation.x = Math.PI;
        group.add(ray);
      }
    }

    function createMetatronCube(group: THREE.Group) {
      const size = 2;

      // Inner circles (13 circles of Metatron's Cube)
      const circlePositions = [
        [0, 0, 0], // Center
        [0, size, 0], [0, -size, 0], // Vertical
        [size * 0.866, size * 0.5, 0], [size * 0.866, -size * 0.5, 0], // Upper right
        [-size * 0.866, size * 0.5, 0], [-size * 0.866, -size * 0.5, 0], // Upper left
        [0, size * 0.5, size * 0.866], [0, -size * 0.5, size * 0.866], // Front
        [0, size * 0.5, -size * 0.866], [0, -size * 0.5, -size * 0.866], // Back
        [size * 0.866, 0, 0], [-size * 0.866, 0, 0], // Sides
      ];

      circlePositions.forEach(([x, y, z], i) => {
        const circleGeometry = new THREE.TorusGeometry(0.3, 0.02, 8, 32);
        const circleMaterial = new THREE.MeshBasicMaterial({
          color: i === 0 ? COLORS.gold : COLORS.primary,
          transparent: true,
          opacity: 0.8,
        });
        const circle = new THREE.Mesh(circleGeometry, circleMaterial);
        circle.position.set(x, y, z);
        group.add(circle);
      });

      // Connecting lines
      const lineMaterial = new THREE.LineBasicMaterial({
        color: COLORS.secondary,
        transparent: true,
        opacity: 0.4,
      });

      // Connect all points
      for (let i = 0; i < circlePositions.length; i++) {
        for (let j = i + 1; j < circlePositions.length; j++) {
          const points = [
            new THREE.Vector3(...circlePositions[i]),
            new THREE.Vector3(...circlePositions[j]),
          ];
          const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
          const line = new THREE.Line(lineGeometry, lineMaterial);
          group.add(line);
        }
      }
    }

    function createFlowerOfLife(group: THREE.Group) {
      const radius = 0.5;

      // Center circle
      group.add(createCircle(0, 0, radius));

      // First ring (6 circles)
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        group.add(createCircle(x, y, radius));
      }

      // Second ring (12 circles)
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 + Math.PI / 12;
        const x = Math.cos(angle) * radius * 2;
        const y = Math.sin(angle) * radius * 2;
        group.add(createCircle(x, y, radius));
      }

      // Outer containing circle
      const outerCircle = new THREE.TorusGeometry(radius * 3, 0.03, 8, 64);
      const outerMaterial = new THREE.MeshBasicMaterial({ color: COLORS.gold });
      const outer = new THREE.Mesh(outerCircle, outerMaterial);
      group.add(outer);

      function createCircle(x: number, y: number, r: number): THREE.Mesh {
        const geometry = new THREE.TorusGeometry(r, 0.02, 8, 32);
        const material = new THREE.MeshBasicMaterial({
          color: COLORS.primary,
          transparent: true,
          opacity: 0.7,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(x, y, 0);
        return mesh;
      }

      // Scale up
      group.scale.set(1.5, 1.5, 1.5);
    }

    function createTesseract(group: THREE.Group) {
      const size = 1.5;
      const innerSize = size * 0.6;

      // Outer cube
      const outerGeometry = new THREE.BoxGeometry(size * 2, size * 2, size * 2);
      const outerEdges = new THREE.EdgesGeometry(outerGeometry);
      const outerMaterial = new THREE.LineBasicMaterial({ color: COLORS.primary });
      group.add(new THREE.LineSegments(outerEdges, outerMaterial));

      // Inner cube
      const innerGeometry = new THREE.BoxGeometry(innerSize * 2, innerSize * 2, innerSize * 2);
      const innerEdges = new THREE.EdgesGeometry(innerGeometry);
      const innerMaterial = new THREE.LineBasicMaterial({ color: COLORS.accent });
      group.add(new THREE.LineSegments(innerEdges, innerMaterial));

      // Connecting lines between cubes
      const outerCorners = [
        [-size, -size, -size], [size, -size, -size], [-size, size, -size], [size, size, -size],
        [-size, -size, size], [size, -size, size], [-size, size, size], [size, size, size],
      ];

      const innerCorners = [
        [-innerSize, -innerSize, -innerSize], [innerSize, -innerSize, -innerSize],
        [-innerSize, innerSize, -innerSize], [innerSize, innerSize, -innerSize],
        [-innerSize, -innerSize, innerSize], [innerSize, -innerSize, innerSize],
        [-innerSize, innerSize, innerSize], [innerSize, innerSize, innerSize],
      ];

      const lineMaterial = new THREE.LineBasicMaterial({
        color: COLORS.secondary,
        transparent: true,
        opacity: 0.5,
      });

      for (let i = 0; i < 8; i++) {
        const points = [
          new THREE.Vector3(...outerCorners[i]),
          new THREE.Vector3(...innerCorners[i]),
        ];
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        group.add(new THREE.Line(lineGeometry, lineMaterial));
      }
    }

    function createIcosahedron(group: THREE.Group) {
      // Main icosahedron
      const icoGeometry = new THREE.IcosahedronGeometry(2, 0);
      const icoEdges = new THREE.EdgesGeometry(icoGeometry);
      const icoMaterial = new THREE.LineBasicMaterial({ color: COLORS.primary });
      group.add(new THREE.LineSegments(icoEdges, icoMaterial));

      // Inner icosahedron
      const innerIcoGeometry = new THREE.IcosahedronGeometry(1.2, 0);
      const innerIcoMaterial = new THREE.MeshBasicMaterial({
        color: COLORS.accent,
        transparent: true,
        opacity: 0.3,
        wireframe: true,
      });
      group.add(new THREE.Mesh(innerIcoGeometry, innerIcoMaterial));

      // Vertices as spheres
      const vertices = icoGeometry.attributes.position;
      const uniqueVertices = new Set<string>();
      for (let i = 0; i < vertices.count; i++) {
        const x = vertices.getX(i);
        const y = vertices.getY(i);
        const z = vertices.getZ(i);
        const key = `${x.toFixed(2)},${y.toFixed(2)},${z.toFixed(2)}`;
        if (!uniqueVertices.has(key)) {
          uniqueVertices.add(key);
          const sphereGeometry = new THREE.SphereGeometry(0.1, 16, 16);
          const sphereMaterial = new THREE.MeshBasicMaterial({ color: COLORS.gold });
          const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
          sphere.position.set(x, y, z);
          group.add(sphere);
        }
      }
    }

    createHologram();

    // Animation loop
    let time = 0;
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      time += 0.016;

      controls.update();

      // Animate based on type
      if (hologramGroup) {
        // General rotation for most types
        if (!['wave', 'galaxy'].includes(type.toLowerCase())) {
          hologramGroup.rotation.y += 0.005;
        }

        // Wave animation - multiple wave patterns
        if (type.toLowerCase() === 'wave') {
          hologramGroup.children.forEach((child) => {
            if (child instanceof THREE.Mesh && child.geometry.attributes.position) {
              const positions = child.geometry.attributes.position;
              const original = child.userData.originalPositions;
              const waveType = child.userData.waveType;

              if (original) {
                for (let i = 0; i < positions.count; i++) {
                  const x = original[i * 3];
                  const y = original[i * 3 + 1];
                  let z = 0;

                  if (waveType === 'main') {
                    // Main wave - multiple sine waves
                    const wave1 = Math.sin(x * 1.5 + time * 3) * 0.4;
                    const wave2 = Math.cos(y * 1.5 + time * 2) * 0.3;
                    const wave3 = Math.sin((x + y) * 1.2 + time * 2.5) * 0.25;
                    z = wave1 + wave2 + wave3;
                  } else if (waveType === 'secondary') {
                    // Cross-hatched pattern
                    const wave1 = Math.sin(x * 2 - time * 2) * 0.3;
                    const wave2 = Math.sin(y * 2 + time * 2.5) * 0.3;
                    z = wave1 + wave2;
                  } else if (waveType === 'ripple') {
                    // Ripple from center
                    const dist = Math.sqrt(x * x + y * y);
                    z = Math.sin(dist * 2 - time * 4) * 0.5 * Math.exp(-dist * 0.1);
                  }

                  positions.setZ(i, z);
                }
                positions.needsUpdate = true;
              }
            }
          });
        }

        // DNA rotation
        if (type.toLowerCase() === 'dna') {
          hologramGroup.rotation.y += 0.01;
        }

        // Galaxy rotation
        if (type.toLowerCase() === 'galaxy') {
          hologramGroup.rotation.y += 0.002;
        }

        // Text floating animation
        if (type.toLowerCase() === 'text') {
          hologramGroup.children.forEach((child) => {
            if (child instanceof THREE.Sprite && child.userData.baseY !== undefined) {
              child.position.y = child.userData.baseY + Math.sin(time * 2 + child.userData.offset) * 0.3;
            }
          });
        }

        // Illuminati eye pulsing
        if (['illuminati', 'eye', 'allseeingeye'].includes(type.toLowerCase())) {
          hologramGroup.children.forEach((child) => {
            if (child instanceof THREE.Group) {
              const scale = 1 + Math.sin(time * 2) * 0.05;
              child.scale.set(scale, scale, scale);
            }
          });
        }

        // Sacred geometry rotation
        if (['sacred', 'geometry', 'sacredgeometry'].includes(type.toLowerCase())) {
          hologramGroup.children.forEach((child, i) => {
            if (child instanceof THREE.LineSegments) {
              child.rotation.y += i === 0 ? 0.01 : -0.01;
            }
          });
        }

        // Tesseract inner cube rotation
        if (['tesseract', 'hypercube'].includes(type.toLowerCase())) {
          const inner = hologramGroup.children[1];
          if (inner) {
            inner.rotation.x += 0.01;
            inner.rotation.z += 0.007;
          }
        }
      }

      // Rotate ambient particles
      particles.rotation.y += 0.0005;

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!camera || !renderer) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationRef.current);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [type, text]);

  return (
    <div className="hologram-container">
      <div ref={containerRef} className="hologram-canvas" />
      <div className="hologram-ui">
        <div className="hologram-title">{(type || 'hologram').toUpperCase()}</div>
        <div className="hologram-controls">
          <span>🖱️ Drag to rotate</span>
          <span>🔍 Scroll to zoom</span>
          <span>⎋ ESC to exit</span>
        </div>
        <button className="hologram-close" onClick={handleClose}>
          ✕ CLOSE
        </button>
      </div>
      <style>{`
        .hologram-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 1000;
          background: radial-gradient(ellipse at center, #0a0a20 0%, #050510 100%);
        }
        .hologram-canvas {
          width: 100%;
          height: 100%;
        }
        .hologram-ui {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          pointer-events: none;
        }
        .hologram-title {
          font-family: 'Courier New', monospace;
          font-size: 24px;
          font-weight: bold;
          color: #00ff88;
          text-shadow: 0 0 10px #00ff88;
          letter-spacing: 4px;
        }
        .hologram-controls {
          display: flex;
          gap: 20px;
          font-family: 'Courier New', monospace;
          font-size: 14px;
          color: #00ffff;
          opacity: 0.8;
        }
        .hologram-close {
          pointer-events: auto;
          background: transparent;
          border: 1px solid #ff00ff;
          color: #ff00ff;
          padding: 10px 20px;
          font-family: 'Courier New', monospace;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .hologram-close:hover {
          background: #ff00ff;
          color: #000;
          box-shadow: 0 0 20px #ff00ff;
        }
      `}</style>
    </div>
  );
};

export default HologramViewer;
