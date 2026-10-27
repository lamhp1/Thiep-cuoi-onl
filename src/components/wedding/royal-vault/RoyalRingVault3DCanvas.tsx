import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { playVaultUnlockSound, playLaserSparkle, playRingRotateSparkle } from './royalVaultSounds';

interface RoyalRingVault3DCanvasProps {
  isOpen: boolean;
  onToggleOpen: () => void;
  guestName: string;
  groomName: string;
  brideName: string;
  weddingDate: string;
  onExploreWedding: () => void;
}

export function RoyalRingVault3DCanvas({
  isOpen,
  onToggleOpen,
  guestName,
  groomName,
  brideName,
  weddingDate,
  onExploreWedding,
}: RoyalRingVault3DCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  // View modes: 'overview' | 'closeup-rings' | 'closeup-plaque'
  const [viewMode, setViewMode] = useState<'overview' | 'closeup-rings' | 'closeup-plaque'>('overview');
  const [isAutoSpin, setIsAutoSpin] = useState<boolean>(true);
  const [activeGuestName, setActiveGuestName] = useState<string>(guestName || 'Quý Khách Quý & Người Thương');
  const [isEditingGuest, setIsEditingGuest] = useState(false);
  const [editInput, setEditInput] = useState(activeGuestName);
  const [isControlsCollapsed, setIsControlsCollapsed] = useState(false);

  // Refs for 3D state & mutable animation values
  const sceneStateRef = useRef<{
    isOpen: boolean;
    viewMode: 'overview' | 'closeup-rings' | 'closeup-plaque';
    isAutoSpin: boolean;
    updatePlaqueTexture: (name: string) => void;
    pulseLaser: () => void;
  }>({
    isOpen,
    viewMode,
    isAutoSpin,
    updatePlaqueTexture: () => {},
    pulseLaser: () => {},
  });

  // Keep state sync
  useEffect(() => {
    sceneStateRef.current.isOpen = isOpen;
    sceneStateRef.current.viewMode = viewMode;
    sceneStateRef.current.isAutoSpin = isAutoSpin;
  }, [isOpen, viewMode, isAutoSpin]);

  useEffect(() => {
    if (guestName) {
      setActiveGuestName(guestName);
      setEditInput(guestName);
      sceneStateRef.current.updatePlaqueTexture(guestName);
    }
  }, [guestName]);

  const handleSaveCustomName = (e: React.FormEvent) => {
    e.preventDefault();
    if (editInput.trim()) {
      setActiveGuestName(editInput.trim());
      sceneStateRef.current.updatePlaqueTexture(editInput.trim());
      sceneStateRef.current.pulseLaser();
      playLaserSparkle();
      setIsEditingGuest(false);
    }
  };

  const handleTriggerOpen = useCallback(() => {
    playVaultUnlockSound();
    onToggleOpen();
  }, [onToggleOpen]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // --- 1. Scene, Camera, Renderer Setup ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x09070c);
    scene.fog = new THREE.FogExp2(0x09070c, 0.05);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 50);
    camera.position.set(0, 3.2, 5.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // Studio Environment map using RoomEnvironment
    try {
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
      pmremGenerator.dispose();
    } catch (err) {
      console.warn('RoomEnvironment setup warning:', err);
    }

    // --- 2. Studio Lighting Rig ---
    // Warm Key Light
    const keyLight = new THREE.DirectionalLight(0xffecd2, 3.0);
    keyLight.position.set(4, 7, 5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0004;
    keyLight.shadow.normalBias = 0.02;
    scene.add(keyLight);

    // Cool Rim Light
    const rimLight = new THREE.DirectionalLight(0xb4d8ff, 2.2);
    rimLight.position.set(-4, 5, -4);
    scene.add(rimLight);

    // Soft Bottom Fill & Ambient
    const hemiLight = new THREE.HemisphereLight(0xfff5ea, 0x181020, 0.9);
    scene.add(hemiLight);

    // Dynamic Prismatic Spotlights for Diamond Chromatic Caustics
    const diamondLightA = new THREE.PointLight(0xffd57e, 1.8, 6);
    diamondLightA.position.set(0.6, 2.0, 0.8);
    scene.add(diamondLightA);

    const diamondLightB = new THREE.PointLight(0x7ef4ff, 1.6, 6);
    diamondLightB.position.set(-0.6, 1.8, -0.6);
    scene.add(diamondLightB);

    const diamondLightC = new THREE.PointLight(0xff8bd8, 1.5, 6);
    diamondLightC.position.set(0.1, 2.4, 0.4);
    scene.add(diamondLightC);

    // --- 3. Ground Mirror & Contact Shadow ---
    const groundGeo = new THREE.PlaneGeometry(30, 30);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x070509,
      roughness: 0.28,
      metalness: 0.65,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.01;
    ground.receiveShadow = true;
    scene.add(ground);

    // Soft Radial Contact Shadow below the vault
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d');
    if (sCtx) {
      const grad = sCtx.createRadialGradient(128, 128, 10, 128, 128, 120);
      grad.addColorStop(0, 'rgba(0,0,0,0.85)');
      grad.addColorStop(0.5, 'rgba(0,0,0,0.35)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 256, 256);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(6, 6),
      new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, opacity: 0.85, depthWrite: false })
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = 0.005;
    scene.add(shadowPlane);

    // --- 4. Royal Vault Master Group ---
    const vaultGroup = new THREE.Group();
    scene.add(vaultGroup);

    // Materials
    // Royal Rose Gold
    const roseGoldMat = new THREE.MeshPhysicalMaterial({
      color: 0xe5a88e,
      metalness: 0.94,
      roughness: 0.16,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1,
    });

    // Platinum White Gold
    const platinumMat = new THREE.MeshPhysicalMaterial({
      color: 0xe8eef5,
      metalness: 0.96,
      roughness: 0.14,
      clearcoat: 1.0,
    });

    // Beveled Crystal Glass
    const crystalGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.94,
      opacity: 1,
      transparent: true,
      roughness: 0.04,
      ior: 1.54,
      thickness: 0.8,
      specularIntensity: 1.0,
      clearcoat: 1.0,
    });

    // Obsidian Velvet Cushion
    const velvetMat = new THREE.MeshStandardMaterial({
      color: 0x120d18,
      roughness: 0.88,
      metalness: 0.08,
    });

    // Solitaire Brilliant Diamond Material
    const diamondMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.97,
      transparent: true,
      roughness: 0.02,
      metalness: 0.02,
      ior: 2.417, // Diamond refractive index
      thickness: 1.2,
      dispersion: 0.05,
      clearcoat: 1.0,
    });

    // --- A. Vault Base & Chassis ---
    const baseGroup = new THREE.Group();
    vaultGroup.add(baseGroup);

    // Base Crystal Box Floor
    const baseBoxGeo = new THREE.BoxGeometry(3.6, 0.45, 3.2);
    const baseBox = new THREE.Mesh(baseBoxGeo, crystalGlassMat);
    baseBox.position.y = 0.225;
    baseBox.castShadow = true;
    baseBox.receiveShadow = true;
    baseGroup.add(baseBox);

    // Rose Gold Rim Trim around base
    const baseRimGeo = new THREE.BoxGeometry(3.7, 0.12, 3.3);
    const baseRim = new THREE.Mesh(baseRimGeo, roseGoldMat);
    baseRim.position.y = 0.06;
    baseRim.castShadow = true;
    baseGroup.add(baseRim);

    // 4 Corner Gold Pillars
    const pillarGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.2, 16);
    const cornerPositions = [
      [1.75, 0.65, 1.55],
      [-1.75, 0.65, 1.55],
      [1.75, 0.65, -1.55],
      [-1.75, 0.65, -1.55],
    ];
    cornerPositions.forEach(([x, y, z]) => {
      const pillar = new THREE.Mesh(pillarGeo, roseGoldMat);
      pillar.position.set(x, y, z);
      pillar.castShadow = true;
      baseGroup.add(pillar);
    });

    // Glass side walls
    const wallFrontGeo = new THREE.BoxGeometry(3.5, 1.1, 0.08);
    const wallFront = new THREE.Mesh(wallFrontGeo, crystalGlassMat);
    wallFront.position.set(0, 0.65, 1.55);
    baseGroup.add(wallFront);

    const wallLeftGeo = new THREE.BoxGeometry(0.08, 1.1, 3.1);
    const wallLeft = new THREE.Mesh(wallLeftGeo, crystalGlassMat);
    wallLeft.position.set(-1.75, 0.65, 0);
    baseGroup.add(wallLeft);

    const wallRight = new THREE.Mesh(wallLeftGeo, crystalGlassMat);
    wallRight.position.set(1.75, 0.65, 0);
    baseGroup.add(wallRight);

    const wallBack = new THREE.Mesh(wallFrontGeo, crystalGlassMat);
    wallBack.position.set(0, 0.65, -1.55);
    baseGroup.add(wallBack);

    // Velvet Cushion Base (Plush Pillow)
    const cushionGeo = new THREE.CylinderGeometry(1.15, 1.3, 0.45, 32);
    const cushion = new THREE.Mesh(cushionGeo, velvetMat);
    cushion.position.set(0, 0.35, -0.22);
    cushion.receiveShadow = true;
    baseGroup.add(cushion);

    // Rose gold filigree ring around cushion (tightly fitted around velvet cushion, safely behind the plaque)
    const cushionRingGeo = new THREE.TorusGeometry(1.18, 0.035, 16, 48);
    const cushionRing = new THREE.Mesh(cushionRingGeo, roseGoldMat);
    cushionRing.rotation.x = Math.PI / 2;
    cushionRing.position.set(0, 0.38, -0.22);
    baseGroup.add(cushionRing);

    // --- B. Laser Engraved VIP Plaque ---
    const plaqueCanvas = document.createElement('canvas');
    plaqueCanvas.width = 1280;
    plaqueCanvas.height = 540;
    const plaqueCtx = plaqueCanvas.getContext('2d')!;

    const renderPlaqueTexture = (name: string) => {
      plaqueCtx.fillStyle = '#110D15';
      plaqueCtx.fillRect(0, 0, 1280, 540);

      // Gold hairline borders
      plaqueCtx.strokeStyle = '#e5a88e';
      plaqueCtx.lineWidth = 6;
      plaqueCtx.strokeRect(18, 18, 1244, 504);
      plaqueCtx.strokeStyle = 'rgba(229, 168, 142, 0.45)';
      plaqueCtx.lineWidth = 2;
      plaqueCtx.strokeRect(28, 28, 1224, 484);

      // Corner ornamental diamonds
      plaqueCtx.fillStyle = '#fce4be';
      const drawDiamond = (cx: number, cy: number) => {
        plaqueCtx.beginPath();
        plaqueCtx.moveTo(cx, cy - 10);
        plaqueCtx.lineTo(cx + 10, cy);
        plaqueCtx.lineTo(cx, cy + 10);
        plaqueCtx.lineTo(cx - 10, cy);
        plaqueCtx.closePath();
        plaqueCtx.fill();
      };
      drawDiamond(46, 46);
      drawDiamond(1234, 46);
      drawDiamond(46, 494);
      drawDiamond(1234, 494);

      // Header: L'AMOUR ROYAL VAULT • VIP INVITATION
      plaqueCtx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
      plaqueCtx.fillStyle = '#e5a88e';
      plaqueCtx.textAlign = 'center';
      plaqueCtx.letterSpacing = '8px';
      plaqueCtx.fillText("✦ L'AMOUR ROYAL VAULT • KHÁCH MỜI DANH DỰ ✦", 640, 80);

      // Main Engraved VIP Guest Name (Adaptive sizing to never overflow or get clipped)
      const cleanGuest = name.trim();
      const guestFontSize = cleanGuest.length > 28 ? 38 : cleanGuest.length > 20 ? 44 : 50;
      plaqueCtx.font = `bold ${guestFontSize}px "Playfair Display", serif`;
      plaqueCtx.fillStyle = '#fff8ee';
      plaqueCtx.letterSpacing = '2px';
      plaqueCtx.shadowColor = 'rgba(229, 168, 142, 0.9)';
      plaqueCtx.shadowBlur = 16;
      plaqueCtx.fillText(cleanGuest, 640, 175);
      plaqueCtx.shadowBlur = 0;

      // Divider line with gold diamond center
      plaqueCtx.strokeStyle = 'rgba(229, 168, 142, 0.65)';
      plaqueCtx.lineWidth = 2;
      plaqueCtx.beginPath();
      plaqueCtx.moveTo(260, 230);
      plaqueCtx.lineTo(1020, 230);
      plaqueCtx.stroke();
      drawDiamond(640, 230);

      // Couple Monogram & Wedding Date
      plaqueCtx.font = 'italic bold 36px "Playfair Display", serif';
      plaqueCtx.fillStyle = '#fce4be';
      plaqueCtx.letterSpacing = '4px';
      plaqueCtx.fillText(`${groomName}  &  ${brideName}`, 640, 305);

      plaqueCtx.font = '22px "Plus Jakarta Sans", sans-serif';
      plaqueCtx.fillStyle = '#e8b498';
      plaqueCtx.letterSpacing = '6px';
      plaqueCtx.fillText(`• NGÀY CHUNG ĐÔI: ${weddingDate} •`, 640, 375);

      plaqueCtx.font = 'bold 19px "Plus Jakarta Sans", sans-serif';
      plaqueCtx.fillStyle = '#d49b82';
      plaqueCtx.letterSpacing = '5px';
      plaqueCtx.fillText('TRÂN TRỌNG KÍNH MỜI QUÝ KHÁCH', 640, 440);
    };

    renderPlaqueTexture(activeGuestName);
    const plaqueTexture = new THREE.CanvasTexture(plaqueCanvas);
    plaqueTexture.colorSpace = THREE.SRGBColorSpace;
    plaqueTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    const plaqueMat = new THREE.MeshPhysicalMaterial({
      map: plaqueTexture,
      metalness: 0.82,
      roughness: 0.18,
      clearcoat: 0.85,
      emissive: 0x3d2118,
      emissiveIntensity: 0.25,
    });

    // Elevated cleanly above the rim and front glass wall, completely unobstructed
    const plaqueGroup = new THREE.Group();
    plaqueGroup.position.set(0, 0.82, 0.95);
    plaqueGroup.rotation.x = -Math.PI / 7; // Upward tilt for perfect readability
    baseGroup.add(plaqueGroup);

    const plaqueGeo = new THREE.BoxGeometry(2.45, 0.95, 0.04);
    const plaqueMesh = new THREE.Mesh(plaqueGeo, plaqueMat);
    plaqueMesh.castShadow = true;
    plaqueGroup.add(plaqueMesh);

    // Rose gold frame trim around the plaque
    const plaqueTrimGeo = new THREE.BoxGeometry(2.49, 0.99, 0.02);
    const plaqueTrim = new THREE.Mesh(plaqueTrimGeo, roseGoldMat);
    plaqueTrim.position.z = -0.015;
    plaqueGroup.add(plaqueTrim);

    // Two elegant rose gold easel legs supporting the plaque
    const legGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.45, 12);
    const legL = new THREE.Mesh(legGeo, roseGoldMat);
    legL.position.set(-0.9, -0.36, -0.05);
    legL.rotation.x = Math.PI / 12;
    plaqueGroup.add(legL);

    const legR = new THREE.Mesh(legGeo, roseGoldMat);
    legR.position.set(0.9, -0.36, -0.05);
    legR.rotation.x = Math.PI / 12;
    plaqueGroup.add(legR);

    // Glowing Laser Beam Line over the plaque
    const laserLineGeo = new THREE.PlaneGeometry(2.25, 0.035);
    const laserLineMat = new THREE.MeshBasicMaterial({
      color: 0xffd277,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const laserLineMesh = new THREE.Mesh(laserLineGeo, laserLineMat);
    laserLineMesh.position.set(0, 0, 0.026);
    plaqueGroup.add(laserLineMesh);

    sceneStateRef.current.updatePlaqueTexture = (newName: string) => {
      renderPlaqueTexture(newName);
      plaqueTexture.needsUpdate = true;
    };

    let laserPulseTime = 0;
    sceneStateRef.current.pulseLaser = () => {
      laserPulseTime = 1.0;
    };

    // --- C. Vault Hinged Lid Group ---
    // Pivot at back hinge: [0, 1.2, -1.55]
    const lidHingeGroup = new THREE.Group();
    lidHingeGroup.position.set(0, 1.2, -1.55);
    vaultGroup.add(lidHingeGroup);

    const lidMeshGroup = new THREE.Group();
    lidMeshGroup.position.set(0, 0, 1.55); // offset relative to hinge
    lidHingeGroup.add(lidMeshGroup);

    // Lid Crystal Roof (Beveled pyramid top)
    const lidRoofGeo = new THREE.CylinderGeometry(0.9, 1.8, 0.5, 4, 1);
    const lidRoof = new THREE.Mesh(lidRoofGeo, crystalGlassMat);
    lidRoof.position.set(0, 0.25, 0);
    lidRoof.rotation.y = Math.PI / 4;
    lidRoof.castShadow = true;
    lidMeshGroup.add(lidRoof);

    // Lid Frame Trim
    const lidFrameGeo = new THREE.BoxGeometry(3.7, 0.12, 3.3);
    const lidFrame = new THREE.Mesh(lidFrameGeo, roseGoldMat);
    lidFrame.position.set(0, 0.02, 0);
    lidFrame.castShadow = true;
    lidMeshGroup.add(lidFrame);

    // Top Crown Finial on Lid
    const finialRingGeo = new THREE.TorusGeometry(0.24, 0.035, 16, 32);
    const finialRing = new THREE.Mesh(finialRingGeo, roseGoldMat);
    finialRing.position.set(0, 0.62, 0);
    finialRing.castShadow = true;
    lidMeshGroup.add(finialRing);

    const finialDiamondGeo = new THREE.OctahedronGeometry(0.16);
    const finialDiamond = new THREE.Mesh(finialDiamondGeo, diamondMat);
    finialDiamond.position.set(0, 0.62, 0);
    lidMeshGroup.add(finialDiamond);

    // Front Clasp Lock
    const claspGeo = new THREE.BoxGeometry(0.35, 0.45, 0.12);
    const claspMesh = new THREE.Mesh(claspGeo, roseGoldMat);
    claspMesh.position.set(0, -0.15, 1.62);
    claspMesh.castShadow = true;
    lidMeshGroup.add(claspMesh);

    // --- D. Dual Solitaire Diamond Rings Group (Elevated on cushion) ---
    const ringsGroup = new THREE.Group();
    ringsGroup.position.set(0, 0.65, -0.22);
    vaultGroup.add(ringsGroup);

    // 1. Groom's Ring (Wider brushed band in rose gold)
    const groomBandGeo = new THREE.TorusGeometry(0.52, 0.075, 24, 52);
    const groomBand = new THREE.Mesh(groomBandGeo, roseGoldMat);
    groomBand.position.set(-0.35, 0, 0);
    groomBand.rotation.y = -Math.PI / 8;
    groomBand.rotation.x = Math.PI / 2.8;
    groomBand.castShadow = true;
    ringsGroup.add(groomBand);

    // Inner groom rim in platinum
    const groomInnerGeo = new THREE.TorusGeometry(0.50, 0.03, 16, 48);
    const groomInner = new THREE.Mesh(groomInnerGeo, platinumMat);
    groomInner.position.copy(groomBand.position);
    groomInner.rotation.copy(groomBand.rotation);
    ringsGroup.add(groomInner);

    // 2. Bride's Solitaire Diamond Ring
    const brideRingGroup = new THREE.Group();
    brideRingGroup.position.set(0.38, 0.08, 0);
    brideRingGroup.rotation.y = Math.PI / 8;
    brideRingGroup.rotation.x = Math.PI / 2.6;
    ringsGroup.add(brideRingGroup);

    const brideBandGeo = new THREE.TorusGeometry(0.46, 0.055, 24, 48);
    const brideBand = new THREE.Mesh(brideBandGeo, roseGoldMat);
    brideBand.castShadow = true;
    brideRingGroup.add(brideBand);

    // 6-Prong Crown Setting on Bride's Ring
    const crownGroup = new THREE.Group();
    crownGroup.position.set(0, 0.51, 0);
    brideRingGroup.add(crownGroup);

    const prongGeo = new THREE.CylinderGeometry(0.018, 0.012, 0.22, 12);
    for (let i = 0; i < 6; i++) {
      const angle = (i * Math.PI * 2) / 6;
      const prong = new THREE.Mesh(prongGeo, platinumMat);
      prong.position.set(Math.cos(angle) * 0.14, 0.08, Math.sin(angle) * 0.14);
      prong.rotation.z = -Math.cos(angle) * 0.25;
      prong.rotation.x = Math.sin(angle) * 0.25;
      crownGroup.add(prong);
    }

    // Brilliant Solitaire Diamond (Faceted Polyhedron)
    // Double-cone faceted cut
    const diamondTopGeo = new THREE.CylinderGeometry(0.24, 0.32, 0.14, 10);
    const diamondTop = new THREE.Mesh(diamondTopGeo, diamondMat);
    diamondTop.position.set(0, 0.14, 0);
    crownGroup.add(diamondTop);

    const diamondBottomGeo = new THREE.ConeGeometry(0.32, 0.34, 10);
    const diamondBottom = new THREE.Mesh(diamondBottomGeo, diamondMat);
    diamondBottom.position.set(0, -0.09, 0);
    diamondBottom.rotation.x = Math.PI;
    crownGroup.add(diamondBottom);

    // --- E. Blooming Rose Petals (Curved side/back floral wreath) ---
    const petalsGroup = new THREE.Group();
    petalsGroup.position.set(0, 0.52, -0.22);
    vaultGroup.add(petalsGroup);

    const petalGeo = new THREE.CylinderGeometry(0.22, 0.05, 0.45, 12, 1, true);
    const petalMat = new THREE.MeshStandardMaterial({
      color: 0x8a1d32, // Royal Burgundy velvet rose
      roughness: 0.65,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });

    const petalMeshes: { mesh: THREE.Mesh; baseAngle: number; radius: number; rotY: number; delay: number }[] = [];
    const petalCount = 20;
    for (let i = 0; i < petalCount; i++) {
      const angle = (i / petalCount) * Math.PI * 2;
      // Skip the front arc where the plaque sits so petals never obstruct the VIP text
      if (Math.sin(angle) > 0.15) continue;

      const pMesh = new THREE.Mesh(petalGeo, petalMat);
      const rad = 0.88 + (i % 2) * 0.24;
      pMesh.position.set(Math.cos(angle) * rad, 0, Math.sin(angle) * rad);
      pMesh.rotation.y = angle;
      pMesh.rotation.z = 0.35 + (i % 2) * 0.2;
      pMesh.scale.set(0.01, 0.01, 0.01);
      petalsGroup.add(pMesh);
      petalMeshes.push({
        mesh: pMesh,
        baseAngle: angle,
        radius: rad,
        rotY: angle,
        delay: (i / petalCount) * 0.4,
      });
    }

    // --- F. Swirling Gold Dust Particle System (400 particles) ---
    const particleCount = 420;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    const particleVel = new Float32Array(particleCount * 3);
    const particleLife = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = 0.4 + Math.random() * 1.6;
      particlePos[i * 3] = Math.cos(theta) * r;
      particlePos[i * 3 + 1] = 0.5 + Math.random() * 0.4;
      particlePos[i * 3 + 2] = Math.sin(theta) * r;

      particleVel[i * 3] = (Math.random() - 0.5) * 0.015;
      particleVel[i * 3 + 1] = 0.01 + Math.random() * 0.025;
      particleVel[i * 3 + 2] = (Math.random() - 0.5) * 0.015;

      particleLife[i] = Math.random();
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));

    // Particle Texture Canvas (Soft glowing round star)
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 64;
    pCanvas.height = 64;
    const pCtx = pCanvas.getContext('2d')!;
    const pGrad = pCtx.createRadialGradient(32, 32, 2, 32, 32, 30);
    pGrad.addColorStop(0, '#ffffff');
    pGrad.addColorStop(0.3, '#ffdf95');
    pGrad.addColorStop(0.7, 'rgba(255, 185, 75, 0.4)');
    pGrad.addColorStop(1, 'rgba(255, 185, 75, 0)');
    pCtx.fillStyle = pGrad;
    pCtx.fillRect(0, 0, 64, 64);
    const pTex = new THREE.CanvasTexture(pCanvas);

    const particleMat = new THREE.PointsMaterial({
      map: pTex,
      size: 0.16,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: 0xffe29a,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    particles.visible = false;
    scene.add(particles);

    // --- 5. Interactive Mouse / Touch Drag Orbit ---
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotY = 0;
    let targetRotX = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevMouseX = clientX;
      prevMouseY = clientY;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - prevMouseX;
      const deltaY = clientY - prevMouseY;
      prevMouseX = clientX;
      prevMouseY = clientY;

      targetRotY += deltaX * 0.007;
      targetRotX = Math.max(-0.4, Math.min(0.6, targetRotX + deltaY * 0.005));

      if (Math.abs(deltaX) > 4) {
        playRingRotateSparkle();
      }
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    container.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // --- 6. Responsive Resize Handling ---
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Pre-warm shaders
    renderer.compile(scene, camera);

    // --- 7. Animation Game Loop ---
    let animId = 0;
    let clock = new THREE.Clock();

    const targetCameraPos = new THREE.Vector3();
    const targetCameraLook = new THREE.Vector3();

    const tick = () => {
      animId = requestAnimationFrame(tick);
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsed = clock.getElapsedTime();

      const { isOpen: curIsOpen, viewMode: curView, isAutoSpin: curAutoSpin } = sceneStateRef.current;

      // Auto-spin subtle rotation
      if (curAutoSpin && !isDragging) {
        targetRotY += 0.25 * delta;
      }

      // Smooth damping on vault rotation
      vaultGroup.rotation.y = THREE.MathUtils.damp(vaultGroup.rotation.y, targetRotY, 6, delta);
      vaultGroup.rotation.x = THREE.MathUtils.damp(vaultGroup.rotation.x, targetRotX, 6, delta);

      // Hinged Lid kinematics: open to approx -112 deg (-1.95 rad) or closed (0 rad)
      const targetLidAngle = curIsOpen ? -1.95 : 0;
      lidHingeGroup.rotation.x = THREE.MathUtils.damp(lidHingeGroup.rotation.x, targetLidAngle, 4.5, delta);

      // Rings Elevation when open: rises from y = 0.65 to 1.05
      const targetRingY = curIsOpen ? 1.05 : 0.65;
      ringsGroup.position.y = THREE.MathUtils.damp(ringsGroup.position.y, targetRingY, 4.0, delta);

      // Diamond & Rings floating bobbing
      if (curIsOpen) {
        ringsGroup.position.y += Math.sin(elapsed * 2.2) * 0.0015;
        brideRingGroup.rotation.y = Math.PI / 8 + Math.sin(elapsed * 1.5) * 0.12;
      }

      // Blooming Petals unfolding
      const targetPetalScale = curIsOpen ? 1.0 : 0.01;
      petalMeshes.forEach((p, idx) => {
        const curScale = p.mesh.scale.x;
        const newScale = THREE.MathUtils.damp(curScale, targetPetalScale, 3.5, delta);
        p.mesh.scale.set(newScale, newScale, newScale);
        if (curIsOpen) {
          p.mesh.rotation.y = p.rotY + Math.sin(elapsed + idx) * 0.08;
          p.mesh.position.y = Math.sin(elapsed * 1.8 + idx) * 0.02;
        }
      });

      // Swirling Gold Dust Particles
      particles.visible = curIsOpen;
      if (curIsOpen) {
        const positions = particleGeo.attributes.position.array as Float32Array;
        for (let i = 0; i < particleCount; i++) {
          positions[i * 3 + 1] += particleVel[i * 3 + 1];
          // Swirling vortex math
          const angle = elapsed * 1.2 + (i % 8);
          positions[i * 3] += Math.cos(angle) * 0.008;
          positions[i * 3 + 2] += Math.sin(angle) * 0.008;

          // Reset particle if too high
          if (positions[i * 3 + 1] > 3.5) {
            positions[i * 3 + 1] = 0.6;
            const theta = Math.random() * Math.PI * 2;
            const r = 0.3 + Math.random() * 1.2;
            positions[i * 3] = Math.cos(theta) * r;
            positions[i * 3 + 2] = Math.sin(theta) * r;
          }
        }
        particleGeo.attributes.position.needsUpdate = true;
      }

      // Orbiting Prismatic Caustic Lights around the Diamond
      const orbitSpeed = elapsed * 1.8;
      diamondLightA.position.set(Math.cos(orbitSpeed) * 1.2, 1.4 + Math.sin(orbitSpeed * 2) * 0.3, Math.sin(orbitSpeed) * 1.2);
      diamondLightB.position.set(Math.cos(orbitSpeed + 2.1) * 1.2, 1.6 + Math.cos(orbitSpeed * 1.5) * 0.3, Math.sin(orbitSpeed + 2.1) * 1.2);
      diamondLightC.position.set(Math.cos(orbitSpeed + 4.2) * 1.2, 1.5, Math.sin(orbitSpeed + 4.2) * 1.2);

      // Laser Line Scanning Pulse (local to plaqueGroup)
      if (laserPulseTime > 0) {
        laserPulseTime = Math.max(0, laserPulseTime - delta * 0.8);
        laserLineMat.opacity = 0.95 * Math.sin(laserPulseTime * Math.PI);
        laserLineMesh.position.y = -0.32 + (1.0 - laserPulseTime) * 0.64;
      } else {
        laserLineMat.opacity = 0.12 + Math.sin(elapsed * 4) * 0.08;
        laserLineMesh.position.y = 0;
      }

      // Camera view presets interpolation
      if (curView === 'overview') {
        targetCameraPos.set(0, 2.9, 5.1);
        targetCameraLook.set(0, 0.85, 0.25);
      } else if (curView === 'closeup-rings') {
        targetCameraPos.set(0, 1.85, 2.2);
        targetCameraLook.set(0, 1.05, -0.22);
      } else if (curView === 'closeup-plaque') {
        targetCameraPos.set(0, 1.35, 2.35);
        targetCameraLook.set(0, 0.82, 0.95);
      }

      camera.position.lerp(targetCameraPos, 5 * delta);
      camera.lookAt(targetCameraLook);

      renderer.render(scene, camera);
    };

    tick();

    // Clean up on unmount
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      container.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);

      renderer.dispose();
      groundGeo.dispose();
      groundMat.dispose();
      roseGoldMat.dispose();
      platinumMat.dispose();
      crystalGlassMat.dispose();
      velvetMat.dispose();
      diamondMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []); // Run once on mount

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-[#09070c]">
      {/* 3D WebGL Canvas Mount */}
      <div ref={mountRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" />

      {/* Floating Open Prompt Pill (Positioned safely above bottom controls, leaving 3D scene 100% visible) */}
      {!isOpen && (
        <div className="absolute bottom-20 sm:bottom-24 inset-x-0 mx-auto flex justify-center pointer-events-none z-30 px-4">
          <button
            onClick={handleTriggerOpen}
            className="pointer-events-auto group px-6 py-2.5 rounded-full bg-gradient-to-r from-[#dca389] via-[#f7d6c5] to-[#dca389] text-[#221319] font-serif font-bold text-xs sm:text-sm tracking-wider shadow-[0_0_35px_rgba(229,168,142,0.7)] hover:shadow-[0_0_55px_rgba(255,225,190,0.95)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2.5 animate-bounce"
          >
            <span className="text-base">💍</span>
            <span>Chạm để Mở Hộp Nhẫn Hoàng Gia</span>
          </button>
        </div>
      )}

      {/* Collapsible Bottom Control Dock with hide/show toggle */}
      <div className="absolute bottom-4 inset-x-0 mx-auto max-w-2xl px-3 pointer-events-none flex flex-col items-center gap-2 z-30">
        {isControlsCollapsed ? (
          <button
            onClick={() => setIsControlsCollapsed(false)}
            className="pointer-events-auto px-4 py-1.5 rounded-full bg-black/80 border border-[#e5a88e]/40 text-[#e5a88e] text-xs font-serif backdrop-blur-md hover:bg-black/95 transition-all shadow-xl flex items-center gap-1.5"
          >
            <span>⚙️</span>
            <span>Hiện thanh điều khiển 3D</span>
          </button>
        ) : (
          <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-2xl bg-black/85 border border-[#e5a88e]/35 backdrop-blur-xl shadow-2xl">
            {/* 1. Toggle Open / Close */}
            <button
              onClick={handleTriggerOpen}
              className="px-3 sm:px-3.5 py-1.5 text-xs font-serif font-semibold rounded-xl bg-gradient-to-r from-[#dca389] to-[#c7886d] text-[#1e1017] hover:brightness-110 active:scale-95 transition-all shadow-md flex items-center gap-1"
            >
              <span>{isOpen ? 'Đóng Nắp Hộp' : 'Mở Nắp Hộp'}</span>
            </button>

            {/* 2. View Mode Pills */}
            <div className="flex items-center gap-1 bg-white/10 p-0.5 rounded-xl">
              <button
                onClick={() => setViewMode('overview')}
                className={`px-2.5 py-1 text-xs rounded-lg transition-all ${
                  viewMode === 'overview' ? 'bg-[#e5a88e] text-black font-semibold shadow-sm' : 'text-[#f5efe6] hover:text-white'
                }`}
              >
                Toàn cảnh
              </button>
              <button
                onClick={() => setViewMode('closeup-rings')}
                className={`px-2.5 py-1 text-xs rounded-lg transition-all ${
                  viewMode === 'closeup-rings' ? 'bg-[#e5a88e] text-black font-semibold shadow-sm' : 'text-[#f5efe6] hover:text-white'
                }`}
              >
                Cận cảnh nhẫn
              </button>
              <button
                onClick={() => setViewMode('closeup-plaque')}
                className={`px-2.5 py-1 text-xs rounded-lg transition-all ${
                  viewMode === 'closeup-plaque' ? 'bg-[#e5a88e] text-black font-semibold shadow-sm' : 'text-[#f5efe6] hover:text-white'
                }`}
              >
                Khắc tên laser
              </button>
            </div>

            {/* 3. Auto Spin Switch */}
            <button
              onClick={() => setIsAutoSpin(!isAutoSpin)}
              className={`px-2.5 py-1 text-xs rounded-xl border transition-all ${
                isAutoSpin
                  ? 'border-[#e5a88e] text-[#e5a88e] bg-[#e5a88e]/10'
                  : 'border-white/20 text-white/70 hover:text-white'
              }`}
            >
              {isAutoSpin ? '360° On' : '360° Off'}
            </button>

            {/* 4. Custom Laser Engrave Name button */}
            <button
              onClick={() => setIsEditingGuest(true)}
              className="px-2.5 py-1 text-xs rounded-xl border border-amber-400/50 text-amber-300 hover:bg-amber-400/20 active:scale-95 transition-all flex items-center gap-1"
            >
              <span>⚡</span>
              <span>Đổi tên Laser</span>
            </button>

            {/* 5. Collapse toggle */}
            <button
              onClick={() => setIsControlsCollapsed(true)}
              className="px-2 py-1 text-xs rounded-xl text-white/50 hover:text-white/80 transition-all"
              title="Thu gọn điều khiển"
            >
              ✕
            </button>

            {/* 6. Explore Full Wedding Invitation CTA */}
            <button
              onClick={onExploreWedding}
              className="px-4 py-1.5 text-xs font-serif font-bold rounded-xl bg-white text-[#190f14] hover:bg-amber-100 active:scale-95 transition-all shadow-[0_0_15px_rgba(255,255,255,0.4)] flex items-center gap-1"
            >
              <span>Vào Thiệp</span>
              <span>→</span>
            </button>
          </div>
        )}

        {/* Quiet Hint */}
        {!isControlsCollapsed && (
          <p className="text-[10px] text-white/50 tracking-wider">
            Mẹo: Kéo xoay 360° để ngắm ánh sáng kim cương • Nhấp đúp vào hộp để mở
          </p>
        )}
      </div>

      {/* Edit Laser Name Modal */}
      {isEditingGuest && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="w-full max-w-md p-6 rounded-2xl bg-[#141018] border border-[#e5a88e]/40 shadow-2xl text-white">
            <h3 className="text-lg font-serif font-bold text-[#e5a88e] mb-1">
              Khắc Tên Laser Khách VIP 3D
            </h3>
            <p className="text-xs text-white/70 mb-4">
              Nhập tên khách mời hoặc đại gia đình để tia laser vàng hồng chiếu sáng khắc trực tiếp lên bệ hoàng gia 3D:
            </p>
            <form onSubmit={handleSaveCustomName} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={editInput}
                  onChange={(e) => setEditInput(e.target.value)}
                  placeholder="Ví dụ: Anh Nguyễn Văn A & Người Thương"
                  maxLength={40}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 border border-[#e5a88e]/50 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#e5a88e] focus:ring-1 focus:ring-[#e5a88e]"
                  autoFocus
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingGuest(false)}
                  className="px-4 py-2 text-xs rounded-lg text-white/70 hover:text-white"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-serif font-bold rounded-lg bg-gradient-to-r from-[#e5a88e] to-[#c7886d] text-[#1e1017] hover:brightness-110 shadow-lg"
                >
                  Chiếu Laser Khắc Tên
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
