import * as THREE from 'three';
import { POIItem } from '../../types/map';

// Reusable materials cache
interface MaterialsCache {
  glassDome: THREE.MeshPhysicalMaterial;
  steelRib: THREE.MeshStandardMaterial;
  supertreeTrunk: THREE.MeshStandardMaterial;
  supertreeFoliage: THREE.MeshStandardMaterial;
  supertreeCrown: THREE.MeshStandardMaterial;
  supertreeGlowDay: THREE.MeshBasicMaterial;
  supertreeGlowNight: THREE.MeshBasicMaterial;
  skywayWalkway: THREE.MeshStandardMaterial;
  skywayRailing: THREE.MeshStandardMaterial;
  planetBronze: THREE.MeshStandardMaterial;
  canopyRoof: THREE.MeshStandardMaterial;
  chineseRed: THREE.MeshStandardMaterial;
  malayTimber: THREE.MeshStandardMaterial;
  beaconIdle: THREE.MeshBasicMaterial;
  beaconHover: THREE.MeshBasicMaterial;
  beaconSelected: THREE.MeshBasicMaterial;
}

export function createMaterials(isSoftwareGl: boolean): MaterialsCache {
  return {
    glassDome: new THREE.MeshPhysicalMaterial({
      color: 0x88ccff,
      metalness: 0.1,
      roughness: 0.15,
      transmission: isSoftwareGl ? 0 : 0.65,
      transparent: true,
      opacity: isSoftwareGl ? 0.6 : 0.85,
      ior: 1.5,
      thickness: 0.8,
      reflectivity: 0.9,
      depthWrite: true,
    }),
    steelRib: new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.85,
      roughness: 0.25,
    }),
    supertreeTrunk: new THREE.MeshStandardMaterial({
      color: 0x582645, // Deep magenta-purple concrete trunk
      metalness: 0.3,
      roughness: 0.7,
    }),
    supertreeFoliage: new THREE.MeshStandardMaterial({
      color: 0x2d6a4f,
      roughness: 0.8,
      metalness: 0.1,
    }),
    supertreeCrown: new THREE.MeshStandardMaterial({
      color: 0x9333ea,
      metalness: 0.6,
      roughness: 0.3,
    }),
    supertreeGlowDay: new THREE.MeshBasicMaterial({
      color: 0xffd166,
      transparent: true,
      opacity: 0.4,
    }),
    supertreeGlowNight: new THREE.MeshBasicMaterial({
      color: 0xf43f5e,
      transparent: true,
      opacity: 0.95,
    }),
    skywayWalkway: new THREE.MeshStandardMaterial({
      color: 0xf97316, // Vibrant orange walkway
      metalness: 0.4,
      roughness: 0.4,
    }),
    skywayRailing: new THREE.MeshStandardMaterial({
      color: 0xfde047,
      metalness: 0.8,
      roughness: 0.2,
    }),
    planetBronze: new THREE.MeshStandardMaterial({
      color: 0xf1f5f9, // Marc Quinn white painted sculpture
      roughness: 0.35,
      metalness: 0.15,
    }),
    canopyRoof: new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.3,
      metalness: 0.4,
      transparent: true,
      opacity: 0.9,
    }),
    chineseRed: new THREE.MeshStandardMaterial({
      color: 0xdc2626,
      roughness: 0.4,
      metalness: 0.2,
    }),
    malayTimber: new THREE.MeshStandardMaterial({
      color: 0x78350f,
      roughness: 0.85,
      metalness: 0.1,
    }),
    beaconIdle: new THREE.MeshBasicMaterial({
      color: 0x10b981,
      transparent: true,
      opacity: 0.85,
    }),
    beaconHover: new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      transparent: true,
      opacity: 1.0,
    }),
    beaconSelected: new THREE.MeshBasicMaterial({
      color: 0xec4899,
      transparent: true,
      opacity: 1.0,
    }),
  };
}

/**
 * Creates an architectural procedural Supertree (3-8 parts Group)
 */
export function createSupertree(
  materials: MaterialsCache,
  height = 14,
  crownRadius = 5.5,
  isObservatory = false
): THREE.Group {
  const tree = new THREE.Group();

  // 1. Concrete Base Planter
  const baseGeom = new THREE.CylinderGeometry(1.4, 1.8, 0.8, 16);
  const baseMesh = new THREE.Mesh(baseGeom, materials.supertreeTrunk);
  baseMesh.position.y = 0.4;
  baseMesh.castShadow = true;
  tree.add(baseMesh);

  // 2. Slender Hyperbolic Trunk (tapered waist in middle, flaring at top)
  const trunkCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0.6, 0),
    new THREE.Vector3(0, height * 0.4, 0),
    new THREE.Vector3(0, height * 0.75, 0),
    new THREE.Vector3(0, height * 0.92, 0),
  ]);

  const trunkGeom = new THREE.CylinderGeometry(1.2, 1.3, height * 0.85, 16);
  trunkGeom.scale(0.85, 1, 0.85);
  const trunkMesh = new THREE.Mesh(trunkGeom, materials.supertreeTrunk);
  trunkMesh.position.y = (height * 0.85) / 2 + 0.5;
  trunkMesh.castShadow = true;
  tree.add(trunkMesh);

  // 3. Vertical Living Garden Bands (epiphytic orchids & bromeliads)
  const bandCount = Math.floor(height / 3.2);
  for (let i = 0; i < bandCount; i++) {
    const ringY = 2.0 + i * 2.8;
    const ringGeom = new THREE.TorusGeometry(1.15, 0.22, 6, 16);
    const ringMesh = new THREE.Mesh(ringGeom, materials.supertreeFoliage);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.y = ringY;
    ringMesh.castShadow = true;
    tree.add(ringMesh);
  }

  // 4. Graceful Flared Canopy Crown (inverted open cone lattice)
  const crownGeom = new THREE.CylinderGeometry(crownRadius, 1.2, height * 0.28, 16, 1, true);
  const crownMesh = new THREE.Mesh(crownGeom, materials.supertreeCrown);
  crownMesh.position.y = height * 0.88;
  crownMesh.castShadow = true;
  tree.add(crownMesh);

  // Radial steel branch struts
  const branchCount = 8;
  for (let b = 0; b < branchCount; b++) {
    const ang = (b / branchCount) * Math.PI * 2;
    const branchCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0, height * 0.75, 0),
      new THREE.Vector3(Math.cos(ang) * (crownRadius * 0.6), height * 0.88, Math.sin(ang) * (crownRadius * 0.6)),
      new THREE.Vector3(Math.cos(ang) * crownRadius, height + 0.5, Math.sin(ang) * crownRadius)
    );
    const branchGeom = new THREE.TubeGeometry(branchCurve, 8, 0.12, 6, false);
    const branchMesh = new THREE.Mesh(branchGeom, materials.steelRib);
    tree.add(branchMesh);
  }

  // 5. Crown Core Light Ring (Illuminates in Garden Rhapsody Night Show)
  const lightRingGeom = new THREE.TorusGeometry(crownRadius * 0.45, 0.12, 6, 20);
  const lightRing = new THREE.Mesh(lightRingGeom, materials.supertreeGlowDay);
  lightRing.rotation.x = Math.PI / 2;
  lightRing.position.y = height * 0.95;
  lightRing.name = 'nightGlow';
  tree.add(lightRing);

  // 6. Supertree Observatory Deck (on tallest tree)
  if (isObservatory) {
    const deckGeom = new THREE.CylinderGeometry(crownRadius * 0.75, crownRadius * 0.65, 1.2, 16);
    const deckMesh = new THREE.Mesh(deckGeom, materials.canopyRoof);
    deckMesh.position.y = height + 1.0;
    deckMesh.castShadow = true;
    tree.add(deckMesh);

    // Observation deck glass railings
    const railingGeom = new THREE.CylinderGeometry(crownRadius * 0.78, crownRadius * 0.78, 0.6, 16, 1, true);
    const railingMesh = new THREE.Mesh(railingGeom, materials.glassDome);
    railingMesh.position.y = height + 1.8;
    tree.add(railingMesh);

    // Crowning beacon antenna
    const antennaGeom = new THREE.CylinderGeometry(0.1, 0.2, 3.5, 6);
    const antennaMesh = new THREE.Mesh(antennaGeom, materials.steelRib);
    antennaMesh.position.y = height + 3.2;
    tree.add(antennaMesh);
  }

  return tree;
}

/**
 * Creates Flower Dome Conservatory (ribbed biomorphic glass structure)
 */
export function createFlowerDome(materials: MaterialsCache): THREE.Group {
  const dome = new THREE.Group();

  // Biomorphic glass shell
  const shellGeom = new THREE.SphereGeometry(14, 24, 18, 0, Math.PI * 1.85, 0, Math.PI * 0.48);
  shellGeom.scale(1.3, 0.85, 1.0);
  const shellMesh = new THREE.Mesh(shellGeom, materials.glassDome);
  shellMesh.castShadow = true;
  shellMesh.receiveShadow = true;
  dome.add(shellMesh);

  // Ribbed structural arches
  const archCount = 12;
  for (let i = 0; i < archCount; i++) {
    const angle = (i / archCount) * Math.PI * 1.85;
    const ribCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(Math.cos(angle) * 16, 12, Math.sin(angle) * 13),
      new THREE.Vector3(Math.cos(angle) * 17, 0, Math.sin(angle) * 13)
    );
    const ribGeom = new THREE.TubeGeometry(ribCurve, 16, 0.25, 8, false);
    const ribMesh = new THREE.Mesh(ribGeom, materials.steelRib);
    dome.add(ribMesh);
  }

  // Base foundation ring
  const baseGeom = new THREE.CylinderGeometry(17.5, 18.2, 1.2, 32);
  const baseMesh = new THREE.Mesh(baseGeom, materials.steelRib);
  baseMesh.position.y = -0.5;
  baseMesh.receiveShadow = true;
  dome.add(baseMesh);

  return dome;
}

/**
 * Creates Cloud Forest Conservatory (taller mountain glass dome with interior mountain)
 */
export function createCloudForest(materials: MaterialsCache): THREE.Group {
  const dome = new THREE.Group();

  // Glass shell (taller and more upright)
  const shellGeom = new THREE.SphereGeometry(15, 24, 20, 0, Math.PI * 1.85, 0, Math.PI * 0.58);
  shellGeom.scale(1.1, 1.35, 0.95);
  const shellMesh = new THREE.Mesh(shellGeom, materials.glassDome);
  shellMesh.castShadow = true;
  shellMesh.receiveShadow = true;
  dome.add(shellMesh);

  // Interior Cloud Mountain visible through glass
  const mountainGeom = new THREE.ConeGeometry(8, 16, 16);
  mountainGeom.scale(1.0, 1.0, 0.8);
  const mountainMesh = new THREE.Mesh(mountainGeom, materials.supertreeFoliage);
  mountainMesh.position.set(0, 8, 0);
  dome.add(mountainMesh);

  // Waterfall white accent strip down the mountain
  const waterfallGeom = new THREE.PlaneGeometry(1.6, 14);
  const waterfallMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.85,
    side: THREE.DoubleSide,
  });
  const waterfallMesh = new THREE.Mesh(waterfallGeom, waterfallMat);
  waterfallMesh.position.set(3.8, 7.5, 3.2);
  waterfallMesh.rotation.y = Math.PI / 4;
  dome.add(waterfallMesh);

  // Ribbed structural arches
  const archCount = 14;
  for (let i = 0; i < archCount; i++) {
    const angle = (i / archCount) * Math.PI * 1.85;
    const ribCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(Math.cos(angle) * 14.5, 18, Math.sin(angle) * 13),
      new THREE.Vector3(Math.cos(angle) * 16, 0, Math.sin(angle) * 14)
    );
    const ribGeom = new THREE.TubeGeometry(ribCurve, 16, 0.28, 8, false);
    const ribMesh = new THREE.Mesh(ribGeom, materials.steelRib);
    dome.add(ribMesh);
  }

  // Base
  const baseGeom = new THREE.CylinderGeometry(16.5, 17.2, 1.2, 32);
  const baseMesh = new THREE.Mesh(baseGeom, materials.steelRib);
  baseMesh.position.y = -0.5;
  dome.add(baseMesh);

  return dome;
}

/**
 * Creates the OCBC Skyway (curved aerial walkway connecting Supertrees)
 */
export function createOCBCSkyway(materials: MaterialsCache): THREE.Group {
  const skyway = new THREE.Group();

  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-12, 10, -4),
    new THREE.Vector3(-4, 11, 4),
    new THREE.Vector3(4, 11, 2),
    new THREE.Vector3(10, 10, -6),
    new THREE.Vector3(14, 10, -14),
  ]);

  // Walkway deck
  const tubeGeom = new THREE.TubeGeometry(curve, 32, 0.7, 8, false);
  const tubeMesh = new THREE.Mesh(tubeGeom, materials.skywayWalkway);
  tubeMesh.castShadow = true;
  skyway.add(tubeMesh);

  // Suspended support cable posts
  const points = curve.getPoints(8);
  points.forEach((pt, idx) => {
    if (idx % 2 === 0) {
      const cableGeom = new THREE.CylinderGeometry(0.08, 0.08, pt.y, 6);
      const cableMesh = new THREE.Mesh(cableGeom, materials.skywayRailing);
      cableMesh.position.set(pt.x, pt.y / 2, pt.z);
      skyway.add(cableMesh);
    }
  });

  return skyway;
}

/**
 * Creates Marc Quinn's "Planet" sculpture (giant sleeping baby)
 */
export function createPlanetSculpture(materials: MaterialsCache): THREE.Group {
  const babyGroup = new THREE.Group();

  // Head
  const headGeom = new THREE.SphereGeometry(1.6, 16, 16);
  headGeom.scale(1.1, 0.9, 1.0);
  const headMesh = new THREE.Mesh(headGeom, materials.planetBronze);
  headMesh.position.set(-2.8, 1.8, 0);
  babyGroup.add(headMesh);

  // Torso / body (elongated sleeping pose)
  const bodyGeom = new THREE.CylinderGeometry(1.3, 1.7, 4.2, 16);
  bodyGeom.rotateZ(Math.PI / 2.3);
  const bodyMesh = new THREE.Mesh(bodyGeom, materials.planetBronze);
  bodyMesh.position.set(0, 1.7, 0);
  babyGroup.add(bodyMesh);

  // Legs tucked in
  const legGeom = new THREE.SphereGeometry(1.5, 12, 12);
  legGeom.scale(1.4, 0.8, 1.0);
  const legMesh = new THREE.Mesh(legGeom, materials.planetBronze);
  legMesh.position.set(2.8, 1.4, 0.3);
  babyGroup.add(legMesh);

  // Cantilevered single arm resting on ground (the iconic balancing point)
  const armGeom = new THREE.CylinderGeometry(0.5, 0.5, 2.2, 10);
  armGeom.rotateX(Math.PI / 4);
  const armMesh = new THREE.Mesh(armGeom, materials.planetBronze);
  armMesh.position.set(-1.0, 0.8, 0.8);
  babyGroup.add(armMesh);

  // Ground shadow/contact pad
  const shadowGeom = new THREE.CircleGeometry(4.5, 24);
  const shadowMat = new THREE.MeshBasicMaterial({
    color: 0x14532d,
    transparent: true,
    opacity: 0.45,
  });
  const shadowMesh = new THREE.Mesh(shadowGeom, shadowMat);
  shadowMesh.rotation.x = -Math.PI / 2;
  shadowMesh.position.y = 0.05;
  babyGroup.add(shadowMesh);

  return babyGroup;
}

/**
 * Creates SG50 Lattice / Bayfront Pavilion
 */
export function createSG50Lattice(materials: MaterialsCache): THREE.Group {
  const pavilion = new THREE.Group();

  const domeGeom = new THREE.IcosahedronGeometry(5.5, 2);
  // Cut lower half
  const domeMat = new THREE.MeshStandardMaterial({
    color: 0xe2e8f0,
    metalness: 0.9,
    roughness: 0.2,
    wireframe: false,
  });
  const domeMesh = new THREE.Mesh(domeGeom, domeMat);
  domeMesh.scale.set(1.2, 0.8, 1.0);
  domeMesh.position.y = 2.5;
  domeMesh.castShadow = true;
  pavilion.add(domeMesh);

  return pavilion;
}

/**
 * Creates the Marina Bay Sands Overpass link
 */
export function createMBSOverpass(materials: MaterialsCache): THREE.Group {
  const overpass = new THREE.Group();

  // Elevated roadway/walkway
  const bridgeGeom = new THREE.BoxGeometry(22, 1.2, 3.5);
  const bridgeMesh = new THREE.Mesh(bridgeGeom, materials.canopyRoof);
  bridgeMesh.position.set(0, 7.5, 0);
  bridgeMesh.rotation.y = -Math.PI / 5;
  bridgeMesh.castShadow = true;
  overpass.add(bridgeMesh);

  // Glass safety balustrades
  const glassGeom = new THREE.BoxGeometry(22, 1.4, 0.1);
  const glass1 = new THREE.Mesh(glassGeom, materials.glassDome);
  glass1.position.set(0, 8.4, 1.7);
  glass1.rotation.y = -Math.PI / 5;
  overpass.add(glass1);

  // Concrete pillars
  const pillarGeom = new THREE.CylinderGeometry(0.8, 0.8, 7.5, 12);
  [-6, 0, 6].forEach((xOffset) => {
    const pillar = new THREE.Mesh(pillarGeom, materials.steelRib);
    pillar.position.set(xOffset * 0.85, 3.75, xOffset * 0.45);
    overpass.add(pillar);
  });

  return overpass;
}

/**
 * Creates refined interactive 3D beacon indicator pins with numbered circular badges
 */
export function createInteractiveBeacon(poi: POIItem, materials: MaterialsCache): THREE.Group {
  const beacon = new THREE.Group();
  beacon.name = `poi-beacon-${poi.id}`;
  beacon.userData = { poiId: poi.id, poi };

  const colorHex =
    poi.category === 'conservatory' ? 0x06b6d4 :
    poi.category === 'supertree' ? 0xa855f7 :
    poi.category === 'dining' ? 0xf97316 :
    poi.category === 'facility' ? 0x3b82f6 : 0x10b981;

  // 1. Ground halo ring
  const ringGeom = new THREE.RingGeometry(1.2, 1.6, 24);
  const ringMat = new THREE.MeshBasicMaterial({
    color: colorHex,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.5,
  });
  const ringMesh = new THREE.Mesh(ringGeom, ringMat);
  ringMesh.rotation.x = -Math.PI / 2;
  ringMesh.position.y = 0.15;
  beacon.add(ringMesh);

  // 2. High-res procedural numbered circular badge
  const badgeCanvas = document.createElement('canvas');
  badgeCanvas.width = 128;
  badgeCanvas.height = 128;
  const ctx = badgeCanvas.getContext('2d');
  if (ctx) {
    // Circle background with crisp border
    ctx.fillStyle = '#' + new THREE.Color(colorHex).getHexString();
    ctx.beginPath();
    ctx.arc(64, 64, 56, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 8;
    ctx.stroke();

    // Text / number
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 50px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(poi.numberKey || '★', 64, 66);
  }

  const badgeTexture = new THREE.CanvasTexture(badgeCanvas);
  badgeTexture.colorSpace = THREE.SRGBColorSpace;

  const badgeGeom = new THREE.PlaneGeometry(2.4, 2.4);
  const badgeMat = new THREE.MeshBasicMaterial({
    map: badgeTexture,
    transparent: true,
    opacity: 0.95,
    side: THREE.DoubleSide,
  });
  const badgeMesh = new THREE.Mesh(badgeGeom, badgeMat);
  badgeMesh.position.y = 3.6;
  badgeMesh.rotation.x = -Math.PI / 6; // Angled towards elevated camera
  badgeMesh.name = 'floatingDiamond';
  beacon.add(badgeMesh);

  // 3. Subtle vertical stem
  const stemGeom = new THREE.CylinderGeometry(0.06, 0.06, 3.4, 6);
  const stemMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.45,
  });
  const stemMesh = new THREE.Mesh(stemGeom, stemMat);
  stemMesh.position.y = 1.7;
  beacon.add(stemMesh);

  // 4. Generous hit area for easy touch / mouse click
  const hitGeom = new THREE.CylinderGeometry(3.8, 3.8, 6, 12);
  const hitMat = new THREE.MeshBasicMaterial({
    visible: false,
  });
  const hitMesh = new THREE.Mesh(hitGeom, hitMat);
  hitMesh.position.y = 3;
  hitMesh.userData = { poiId: poi.id, poi };
  beacon.add(hitMesh);

  return beacon;
}
