import * as THREE from 'three';
import { POIItem, TimeOfDayMode, CategoryType } from '../../types/map';
import { GARDENS_POIS } from '../../data/gardensData';
import { createGroundLandscapingCanvas, exactLandmassPolygon } from './GroundLandscapingTexture';

export const WORLD_WIDTH = 220;
export const WORLD_DEPTH = 150;

export function normToWorld(nx: number, ny: number): THREE.Vector3 {
  return new THREE.Vector3((nx - 0.5) * WORLD_WIDTH, 0, (ny - 0.5) * WORLD_DEPTH);
}

// Exact Bay South Garden + Marina Blvd + Marina Gardens Drive cutout outline matching reference map
export const MAIN_LANDMASS_OUTLINE: [number, number][] = exactLandmassPolygon;

// Dragonfly Lake & Koi Pond water channel polygon
export const DRAGONFLY_LAKE_OUTLINE: [number, number][] = [
  [0.402, 0.068],
  [0.418, 0.078],
  [0.402, 0.165],
  [0.425, 0.215],
  [0.495, 0.265],
  [0.445, 0.275],
  [0.375, 0.265],
  [0.352, 0.335],
  [0.335, 0.445],
  [0.255, 0.515],
  [0.182, 0.545],
  [0.195, 0.520],
  [0.245, 0.475],
  [0.285, 0.375],
  [0.335, 0.295],
  [0.365, 0.215],
  [0.388, 0.145],
];

// Eastern Kingfisher Lake, Water Lily Pond & Lotus Pond water system
export const KINGFISHER_LAKE_OUTLINE: [number, number][] = [
  [0.665, 0.378],
  [0.735, 0.378],
  [0.785, 0.405],
  [0.848, 0.455],
  [0.845, 0.518],
  [0.785, 0.518],
  [0.735, 0.475],
  [0.665, 0.438],
];

// Winding pedestrian pathway network (normalized coordinates)
export const PATHWAY_NETWORK: [number, number][][] = [
  // Waterfront Promenade (NW to SE)
  [
    [0.332, 0.042], [0.415, 0.082], [0.505, 0.135], [0.615, 0.195], [0.725, 0.275], [0.835, 0.365], [0.925, 0.455], [0.985, 0.525]
  ],
  // Scented Walk (North-West to South-West)
  [
    [0.388, 0.058], [0.365, 0.175], [0.335, 0.275], [0.295, 0.345], [0.245, 0.425], [0.192, 0.485], [0.115, 0.555], [0.035, 0.665]
  ],
  // Central Spine: Meadow Bridge -> Planet -> World of Plants -> Main Entrance
  [
    [0.228, 0.495], [0.295, 0.512], [0.355, 0.482], [0.415, 0.455], [0.485, 0.455], [0.545, 0.425], [0.595, 0.365], [0.622, 0.415]
  ],
  // The Meadow Amphitheatre Bowl Loop
  [
    [0.228, 0.495], [0.285, 0.515], [0.318, 0.568], [0.305, 0.642], [0.248, 0.688], [0.175, 0.692], [0.145, 0.645], [0.185, 0.565], [0.228, 0.495]
  ],
  // East Gardens Walk (Drop-off -> Lily Ponds -> Children's Garden -> Satay by the Bay -> Spiral Loop)
  [
    [0.622, 0.415], [0.665, 0.408], [0.738, 0.408], [0.765, 0.385], [0.815, 0.395], [0.865, 0.465], [0.915, 0.525], [0.965, 0.605]
  ],
];

// Roadway network (empty so no moving road cars are spawned, per user request)
export const ROAD_NETWORK: [number, number][][] = [];

// Deterministic pseudo-random helper for dense botanical placement
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

// Generate lush botanical 3D tree coordinates strictly inside the peninsula green zones
export const DENSE_TREE_SPECIFICATIONS: { nx: number; ny: number; scale: number; type: 'canopy' | 'palm' | 'flowering' }[] = (() => {
  const list: { nx: number; ny: number; scale: number; type: 'canopy' | 'palm' | 'flowering' }[] = [];
  const zones: { cx: number; cy: number; rx: number; ry: number; count: number; type: 'canopy' | 'palm' | 'flowering' }[] = [
    // Active Garden & West Lawn (kept safely east of the West Seawall)
    { cx: 0.34, cy: 0.14, rx: 0.025, ry: 0.045, count: 14, type: 'canopy' },
    { cx: 0.30, cy: 0.24, rx: 0.022, ry: 0.035, count: 10, type: 'palm' },
    // Heritage Gardens (Indian, Chinese, Malay, Colonial)
    { cx: 0.38, cy: 0.35, rx: 0.038, ry: 0.055, count: 20, type: 'flowering' },
    { cx: 0.51, cy: 0.27, rx: 0.025, ry: 0.025, count: 10, type: 'canopy' },
    // Serene Garden & Southwest Groves (kept clear of The Meadow center bowl)
    { cx: 0.11, cy: 0.62, rx: 0.045, ry: 0.065, count: 22, type: 'canopy' },
    { cx: 0.18, cy: 0.74, rx: 0.040, ry: 0.045, count: 14, type: 'palm' },
    // The Meadow Eastern Fringe & World of Plants
    { cx: 0.38, cy: 0.53, rx: 0.045, ry: 0.040, count: 18, type: 'canopy' },
    { cx: 0.49, cy: 0.52, rx: 0.050, ry: 0.040, count: 20, type: 'palm' },
    { cx: 0.57, cy: 0.43, rx: 0.025, ry: 0.040, count: 12, type: 'flowering' },
    // East Gardens: Children's Garden, Kingfisher Wetlands & Satay by the Bay
    { cx: 0.74, cy: 0.34, rx: 0.035, ry: 0.035, count: 16, type: 'palm' },
    { cx: 0.83, cy: 0.43, rx: 0.045, ry: 0.045, count: 18, type: 'canopy' },
    { cx: 0.90, cy: 0.55, rx: 0.040, ry: 0.045, count: 16, type: 'flowering' },
  ];

  let seed = 1;
  zones.forEach((z) => {
    for (let i = 0; i < z.count; i++) {
      const ang = seededRandom(seed++) * Math.PI * 2;
      const rad = Math.sqrt(seededRandom(seed++));
      const nx = z.cx + Math.cos(ang) * z.rx * rad;
      const ny = z.cy + Math.sin(ang) * z.ry * rad;
      const scale = 0.72 + seededRandom(seed++) * 0.5;
      const type = i % 5 === 0 ? 'flowering' : i % 3 === 0 ? 'palm' : z.type;
      list.push({ nx, ny, scale, type });
    }
  });
  return list;
})();

export interface LiveWorldResult {
  group: THREE.Group;
  poiHitMap: Map<string, THREE.Object3D>;
  update: (elapsed: number, delta: number, selectedId: string | null, hoveredId: string | null, cat: CategoryType, timeOfDay: TimeOfDayMode) => void;
  dispose: () => void;
}

/**
 * Builds the complete 3D Architectural Gardens by the Bay environment
 * with the clean reference map placed on top of the 3D extruded Bay South terrain
 * and all 3D buildings, 18 Supertrees, OCBC Skyway, Conservatories, and Marina Bay boats aligned 1:1.
 */
export function createGardens3DWorld(isSoftwareGl: boolean): LiveWorldResult {
  const group = new THREE.Group();
  const poiHitMap = new Map<string, THREE.Object3D>();
  const disposableGeoms: THREE.BufferGeometry[] = [];
  const disposableMats: THREE.Material[] = [];
  const disposableTexs: THREE.Texture[] = [];

  const trackGeom = <T extends THREE.BufferGeometry>(g: T): T => {
    disposableGeoms.push(g);
    return g;
  };
  const trackMat = <T extends THREE.Material>(m: T): T => {
    disposableMats.push(m);
    return m;
  };

  // ============================================================================
  // 1. ROYAL PURPLE EXHIBITION SURROUND & NORTH-EAST MARINA BAY WATER BASIN
  // ============================================================================
  const purpleBaseGeom = trackGeom(new THREE.PlaneGeometry(1800, 1800));
  purpleBaseGeom.rotateX(-Math.PI / 2);
  const purpleBaseMat = trackMat(new THREE.MeshStandardMaterial({
    color: 0x3d1452,
    roughness: 0.85,
    metalness: 0.1,
  }));
  const purpleBaseMesh = new THREE.Mesh(purpleBaseGeom, purpleBaseMat);
  purpleBaseMesh.position.y = -0.35;
  purpleBaseMesh.receiveShadow = true;
  group.add(purpleBaseMesh);

  // Seamless Animated Water Texture for North-East Marina Bay
  const waterCanvas = document.createElement('canvas');
  waterCanvas.width = 256;
  waterCanvas.height = 256;
  const wCtx = waterCanvas.getContext('2d');
  if (wCtx) {
    wCtx.fillStyle = '#0095d9';
    wCtx.fillRect(0, 0, 256, 256);
    wCtx.strokeStyle = 'rgba(224, 242, 254, 0.24)';
    wCtx.lineWidth = 2;
    for (let y = 16; y < 256; y += 32) {
      wCtx.beginPath();
      for (let x = 0; x <= 256; x += 8) {
        const wy = y + Math.sin((x / 256) * Math.PI * 4) * 4;
        if (x === 0) wCtx.moveTo(x, wy);
        else wCtx.lineTo(x, wy);
      }
      wCtx.stroke();
    }
  }
  const waterTex = new THREE.CanvasTexture(waterCanvas);
  waterTex.colorSpace = THREE.SRGBColorSpace;
  waterTex.wrapS = THREE.RepeatWrapping;
  waterTex.wrapT = THREE.RepeatWrapping;
  waterTex.repeat.set(16, 12);
  disposableTexs.push(waterTex);

  // North-East Marina Reservoir Water Polygon aligned with exact coastline
  const marinaWaterOutline: [number, number][] = [
    [0.332, 0.034],
    [0.332, -0.350],
    [1.350, -0.350],
    [1.350, 0.560],
    [0.998, 0.538],
    [0.950, 0.468],
    [0.890, 0.420],
    [0.810, 0.332],
    [0.730, 0.268],
    [0.650, 0.214],
    [0.590, 0.178],
    [0.490, 0.122],
    [0.410, 0.076],
  ];
  const marinaWaterShape = new THREE.Shape();
  marinaWaterOutline.forEach(([nx, ny], idx) => {
    const x = (nx - 0.5) * WORLD_WIDTH;
    const z = (ny - 0.5) * WORLD_DEPTH;
    if (idx === 0) marinaWaterShape.moveTo(x, -z);
    else marinaWaterShape.lineTo(x, -z);
  });
  marinaWaterShape.closePath();

  const seaPlinthGeom = trackGeom(new THREE.ExtrudeGeometry(marinaWaterShape, {
    depth: 0.35,
    bevelEnabled: false,
  }));
  seaPlinthGeom.rotateX(-Math.PI / 2);
  const seaPosAttr = seaPlinthGeom.attributes.position;
  const seaUvAttr = seaPlinthGeom.attributes.uv;
  for (let i = 0; i < seaPosAttr.count; i++) {
    const vx = seaPosAttr.getX(i);
    const vz = seaPosAttr.getZ(i);
    seaUvAttr.setXY(i, vx / 45, vz / 45);
  }
  seaUvAttr.needsUpdate = true;

  const seaPlinthMat = trackMat(new THREE.MeshStandardMaterial({
    map: waterTex,
    color: 0xffffff,
    roughness: 0.16,
    metalness: 0.45,
  }));
  const seaPlinth = new THREE.Mesh(seaPlinthGeom, seaPlinthMat);
  seaPlinth.position.y = -0.15;
  seaPlinth.receiveShadow = true;
  group.add(seaPlinth);

  // White Foaming Shoreline Wave Ribbon along the Waterfront Promenade
  const shorelinePts = [
    [0.332, 0.034],
    [0.490, 0.122],
    [0.590, 0.178],
    [0.730, 0.268],
    [0.850, 0.375],
    [0.998, 0.538],
  ].map(([nx, ny]) => {
    const p = normToWorld(nx, ny);
    return new THREE.Vector3(p.x, 0.32, p.z);
  });
  const shorelineCurve = new THREE.CatmullRomCurve3(shorelinePts);
  const shorelineFoamMesh = new THREE.Mesh(
    trackGeom(new THREE.TubeGeometry(shorelineCurve, 64, 1.35, 8, false)),
    trackMat(new THREE.MeshBasicMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.75 }))
  );
  shorelineFoamMesh.scale.set(1, 0.15, 1);
  group.add(shorelineFoamMesh);

  // ============================================================================
  // 2. SCULPTED 3D BAY SOUTH PENINSULA LANDMASS WITH 1:1 ALIGNED MAP TEXTURE
  // ============================================================================
  const groundTexDay = new THREE.CanvasTexture(
    createGroundLandscapingCanvas(() => {
      groundTexDay.needsUpdate = true;
    })
  );
  groundTexDay.colorSpace = THREE.SRGBColorSpace;
  groundTexDay.anisotropy = 8;
  disposableTexs.push(groundTexDay);

  const landShape = new THREE.Shape();
  MAIN_LANDMASS_OUTLINE.forEach(([nx, ny], idx) => {
    const x = (nx - 0.5) * WORLD_WIDTH;
    const z = (ny - 0.5) * WORLD_DEPTH;
    if (idx === 0) landShape.moveTo(x, -z);
    else landShape.lineTo(x, -z);
  });
  landShape.closePath();

  const landExtrudeGeom = trackGeom(new THREE.ExtrudeGeometry(landShape, {
    depth: 1.65,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.45,
    bevelThickness: 0.35,
  }));
  landExtrudeGeom.rotateX(-Math.PI / 2);

  // Map planar normalized UVs (0..1) across WORLD_WIDTH x WORLD_DEPTH so the clean map image aligns 1:1
  const posAttr = landExtrudeGeom.attributes.position;
  const uvAttr = landExtrudeGeom.attributes.uv;
  for (let i = 0; i < posAttr.count; i++) {
    const vx = posAttr.getX(i);
    const vz = posAttr.getZ(i);
    const nx = vx / WORLD_WIDTH + 0.5;
    const ny = vz / WORLD_DEPTH + 0.5;
    uvAttr.setXY(i, nx, 1.0 - ny);
  }
  uvAttr.needsUpdate = true;

  const landMat = trackMat(new THREE.MeshStandardMaterial({
    map: groundTexDay,
    color: 0xffffff,
    roughness: 0.72,
    metalness: 0.05,
  }));
  const seawallMat = trackMat(new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    roughness: 0.55,
    metalness: 0.2,
  }));

  const landMesh = new THREE.Mesh(landExtrudeGeom, [landMat, seawallMat]);
  landMesh.position.y = -0.2;
  landMesh.receiveShadow = true;
  group.add(landMesh);

  // ============================================================================
  // 3. FLOATING 3D WATER LILY PADS IN VICTORIA LILY POND & LOTUS POND
  // ============================================================================
  const lilyPadGeom = trackGeom(new THREE.CylinderGeometry(0.75, 0.75, 0.08, 12, 1, false, 0, Math.PI * 1.85));
  const lilyPadMat = trackMat(new THREE.MeshStandardMaterial({ color: 0x4ade80, roughness: 0.6 }));
  const lilyPositions: [number, number][] = [
    [0.68, 0.39], [0.70, 0.40], [0.72, 0.39], [0.79, 0.49], [0.81, 0.50], [0.83, 0.49],
  ];
  lilyPositions.forEach(([nx, ny]) => {
    const p = normToWorld(nx, ny);
    const pad = new THREE.Mesh(lilyPadGeom, lilyPadMat);
    pad.position.set(p.x, 1.88, p.z);
    group.add(pad);
  });

  // ============================================================================
  // 4. ARCHITECTURAL LANDMARKS & BUILDINGS (Interactive 3D Meshes Aligned to Map)
  // ============================================================================
  const glassDomeMat = trackMat(new THREE.MeshPhysicalMaterial({
    color: 0xbae6fd,
    metalness: 0.15,
    roughness: 0.12,
    transmission: isSoftwareGl ? 0 : 0.72,
    transparent: true,
    opacity: isSoftwareGl ? 0.68 : 0.88,
    ior: 1.48,
    thickness: 0.9,
  }));

  const steelRibMat = trackMat(new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    metalness: 0.85,
    roughness: 0.22,
  }));

  const supertreeTrunkMat = trackMat(new THREE.MeshStandardMaterial({
    color: 0x6b215c,
    roughness: 0.65,
    metalness: 0.25,
  }));

  const supertreeFoliageMat = trackMat(new THREE.MeshStandardMaterial({
    color: 0x16a34a,
    roughness: 0.75,
  }));

  const supertreeCrownMat = trackMat(new THREE.MeshStandardMaterial({
    color: 0x9333ea,
    metalness: 0.55,
    roughness: 0.3,
  }));

  const glowRingMat = trackMat(new THREE.MeshBasicMaterial({
    color: 0xfbbf24,
    transparent: true,
    opacity: 0.65,
  }));

  const bindPoi = (poiId: string, obj: THREE.Object3D) => {
    const poi = GARDENS_POIS.find((p) => p.id === poiId);
    if (poi) {
      obj.userData = { poiId: poi.id, poi };
      obj.traverse((child) => {
        child.userData = { poiId: poi.id, poi };
      });
      poiHitMap.set(poi.id, obj);
    }
  };

  // --- A. FLOWER DOME (#3) - Aligned to (0.556, 0.199) ---
  const flowerDomeGroup = new THREE.Group();
  const fdPos = normToWorld(0.556, 0.199);
  flowerDomeGroup.position.set(fdPos.x, 1.8, fdPos.z);
  flowerDomeGroup.rotation.y = -Math.PI / 6;

  const fdInterior = new THREE.Mesh(
    trackGeom(new THREE.CylinderGeometry(14, 15, 1.2, 24)),
    trackMat(new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.7 }))
  );
  fdInterior.scale.set(1.25, 1, 0.95);
  fdInterior.position.y = 0.6;
  flowerDomeGroup.add(fdInterior);

  const fdShellGeom = trackGeom(new THREE.SphereGeometry(14, 28, 20, 0, Math.PI * 2, 0, Math.PI * 0.48));
  fdShellGeom.scale(1.32, 0.82, 0.98);
  const fdShell = new THREE.Mesh(fdShellGeom, glassDomeMat);
  fdShell.castShadow = true;
  flowerDomeGroup.add(fdShell);

  for (let i = 0; i < 12; i++) {
    const ang = (i / 12) * Math.PI * 2;
    const ribCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0, 11.5, 0),
      new THREE.Vector3(Math.cos(ang) * 14, 9.5, Math.sin(ang) * 10.5),
      new THREE.Vector3(Math.cos(ang) * 18.5, 0, Math.sin(ang) * 13.8)
    );
    const ribMesh = new THREE.Mesh(
      trackGeom(new THREE.TubeGeometry(ribCurve, 14, 0.24, 6, false)),
      steelRibMat
    );
    flowerDomeGroup.add(ribMesh);
  }
  bindPoi('flower-dome', flowerDomeGroup);
  group.add(flowerDomeGroup);

  // --- B. CLOUD FOREST (#4) & LIVE INDOOR WATERFALL - Aligned to (0.663, 0.263) ---
  const cloudForestGroup = new THREE.Group();
  const cfPos = normToWorld(0.663, 0.263);
  cloudForestGroup.position.set(cfPos.x, 1.8, cfPos.z);
  cloudForestGroup.rotation.y = -Math.PI / 4;

  const mountainGeom = trackGeom(new THREE.ConeGeometry(8.5, 17.5, 18));
  const mountainMesh = new THREE.Mesh(mountainGeom, supertreeFoliageMat);
  mountainMesh.position.set(0, 8.75, 0);
  cloudForestGroup.add(mountainMesh);

  const cwCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-6, 4, 5),
    new THREE.Vector3(6, 7, 4),
    new THREE.Vector3(5, 11, -5),
    new THREE.Vector3(-4, 14, -3),
    new THREE.Vector3(0, 16, 2),
  ]);
  const cwMesh = new THREE.Mesh(
    trackGeom(new THREE.TubeGeometry(cwCurve, 24, 0.35, 6, false)),
    steelRibMat
  );
  cloudForestGroup.add(cwMesh);

  const waterfallDrops: THREE.Mesh[] = [];
  const dropGeom = trackGeom(new THREE.SphereGeometry(0.42, 8, 8));
  const dropMat = trackMat(new THREE.MeshBasicMaterial({
    color: 0xe0f2fe,
    transparent: true,
    opacity: 0.85,
  }));
  for (let d = 0; d < 18; d++) {
    const drop = new THREE.Mesh(dropGeom, dropMat);
    drop.position.set(2.5 + (Math.random() - 0.5) * 1.2, (d / 18) * 15, 2.5 + (Math.random() - 0.5) * 1.2);
    cloudForestGroup.add(drop);
    waterfallDrops.push(drop);
  }

  const cfShellGeom = trackGeom(new THREE.SphereGeometry(14.5, 28, 22, 0, Math.PI * 2, 0, Math.PI * 0.56));
  cfShellGeom.scale(1.08, 1.38, 0.94);
  const cfShell = new THREE.Mesh(cfShellGeom, glassDomeMat);
  cfShell.castShadow = true;
  cloudForestGroup.add(cfShell);

  for (let i = 0; i < 12; i++) {
    const ang = (i / 12) * Math.PI * 2;
    const ribCurve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(0, 20.0, 0),
      new THREE.Vector3(Math.cos(ang) * 12.5, 14, Math.sin(ang) * 11),
      new THREE.Vector3(Math.cos(ang) * 15.6, 0, Math.sin(ang) * 13.6)
    );
    const ribMesh = new THREE.Mesh(
      trackGeom(new THREE.TubeGeometry(ribCurve, 14, 0.24, 6, false)),
      steelRibMat
    );
    cloudForestGroup.add(ribMesh);
  }
  bindPoi('cloud-forest', cloudForestGroup);
  group.add(cloudForestGroup);

  // --- C. THE CANOPY (#2), FLORAL CLOCK (#5) & DINING PAVILIONS ---
  const canopyGroup = new THREE.Group();
  const canPos = normToWorld(0.585, 0.275);
  canopyGroup.position.set(canPos.x, 1.8, canPos.z);
  const canopyRoof = new THREE.Mesh(
    trackGeom(new THREE.CylinderGeometry(5.5, 6.2, 0.5, 24)),
    steelRibMat
  );
  canopyRoof.position.y = 2.8;
  canopyRoof.scale.set(1.2, 1, 0.75);
  canopyGroup.add(canopyRoof);
  bindPoi('the-canopy', canopyGroup);
  group.add(canopyGroup);

  const clockGroup = new THREE.Group();
  const clkPos = normToWorld(0.575, 0.298);
  clockGroup.position.set(clkPos.x, 1.85, clkPos.z);
  const clockBed = new THREE.Mesh(
    trackGeom(new THREE.CylinderGeometry(3.0, 3.2, 0.28, 24)),
    trackMat(new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.6 }))
  );
  clockGroup.add(clockBed);
  const clockHand = new THREE.Mesh(
    trackGeom(new THREE.BoxGeometry(0.3, 0.2, 2.4)),
    steelRibMat
  );
  clockHand.position.y = 0.25;
  clockGroup.add(clockHand);
  bindPoi('floral-clock', clockGroup);
  group.add(clockGroup);

  // --- D. SUPERTREE GROVE (#6), OCBC SKYWAY (#7), OBSERVATORY (#8), GOLDEN (#1) & SILVER (#25) ---
  const buildSupertreeModel = (height: number, crownRadius: number, isObservatory = false) => {
    const tree = new THREE.Group();
    const base = new THREE.Mesh(
      trackGeom(new THREE.CylinderGeometry(1.3, 1.8, 0.8, 16)),
      supertreeTrunkMat
    );
    base.position.y = 0.4;
    tree.add(base);

    const trunkGeom = trackGeom(new THREE.CylinderGeometry(1.05, 1.25, height * 0.84, 16));
    trunkGeom.scale(0.85, 1, 0.85);
    const trunk = new THREE.Mesh(trunkGeom, supertreeTrunkMat);
    trunk.position.y = (height * 0.84) / 2 + 0.5;
    trunk.castShadow = true;
    tree.add(trunk);

    const bandCount = Math.floor(height / 3.0);
    for (let i = 0; i < bandCount; i++) {
      const band = new THREE.Mesh(
        trackGeom(new THREE.TorusGeometry(1.1, 0.22, 6, 16)),
        supertreeFoliageMat
      );
      band.rotation.x = Math.PI / 2;
      band.position.y = 2.0 + i * 2.7;
      tree.add(band);
    }

    const crown = new THREE.Mesh(
      trackGeom(new THREE.CylinderGeometry(crownRadius, 1.15, height * 0.28, 16, 1, true)),
      supertreeCrownMat
    );
    crown.position.y = height * 0.88;
    crown.castShadow = true;
    tree.add(crown);

    for (let b = 0; b < 8; b++) {
      const ang = (b / 8) * Math.PI * 2;
      const bCurve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0, height * 0.74, 0),
        new THREE.Vector3(Math.cos(ang) * crownRadius * 0.6, height * 0.88, Math.sin(ang) * crownRadius * 0.6),
        new THREE.Vector3(Math.cos(ang) * crownRadius, height + 0.4, Math.sin(ang) * crownRadius)
      );
      const bMesh = new THREE.Mesh(
        trackGeom(new THREE.TubeGeometry(bCurve, 8, 0.1, 6, false)),
        steelRibMat
      );
      tree.add(bMesh);
    }

    const glowRing = new THREE.Mesh(
      trackGeom(new THREE.TorusGeometry(crownRadius * 0.48, 0.14, 6, 20)),
      glowRingMat
    );
    glowRing.rotation.x = Math.PI / 2;
    glowRing.position.y = height * 0.96;
    tree.add(glowRing);

    if (isObservatory) {
      const deck = new THREE.Mesh(
        trackGeom(new THREE.CylinderGeometry(crownRadius * 0.72, crownRadius * 0.62, 1.2, 18)),
        steelRibMat
      );
      deck.position.y = height + 1.0;
      tree.add(deck);
      const spire = new THREE.Mesh(
        trackGeom(new THREE.CylinderGeometry(0.1, 0.22, 3.8, 8)),
        steelRibMat
      );
      spire.position.y = height + 3.4;
      tree.add(spire);
    }
    return tree;
  };

  const stPlazaPos = normToWorld(0.456, 0.362);
  const stGroveGroup = new THREE.Group();
  stGroveGroup.position.set(stPlazaPos.x, 1.85, stPlazaPos.z);

  const obsTree = buildSupertreeModel(22, 7.8, true);
  bindPoi('supertree-observatory', obsTree);
  stGroveGroup.add(obsTree);

  const stOffsets: [number, number, number, number][] = [
    [-8, -3, 15, 5.4],
    [9, -4, 16, 5.8],
    [-4, 8, 13, 4.9],
    [6, 9, 15, 5.6],
    [-11, 5, 12, 4.6],
    [11, 4, 13, 5.0],
    [-5, -9, 14, 5.2],
    [4, -10, 15, 5.6],
    [-13, -6, 11, 4.4],
  ];
  stOffsets.forEach(([ox, oz, h, cr]) => {
    const t = buildSupertreeModel(h, cr, false);
    t.position.set(ox, 0, oz);
    bindPoi('supertree-grove', t);
    stGroveGroup.add(t);
  });

  const skywayCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-8, 10, -3),
    new THREE.Vector3(-4, 10.5, 8),
    new THREE.Vector3(6, 11, 9),
    new THREE.Vector3(11, 10.5, 4),
    new THREE.Vector3(9, 10, -4),
    new THREE.Vector3(4, 10, -10),
  ]);
  const skywayMesh = new THREE.Mesh(
    trackGeom(new THREE.TubeGeometry(skywayCurve, 48, 0.65, 8, false)),
    trackMat(new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.35, metalness: 0.45 }))
  );
  skywayMesh.castShadow = true;
  bindPoi('ocbc-skyway', skywayMesh);
  stGroveGroup.add(skywayMesh);
  group.add(stGroveGroup);

  // Golden Garden (#1) - Aligned to (0.629, 0.376)
  const goldenGroup = new THREE.Group();
  const goldPos = normToWorld(0.629, 0.376);
  goldenGroup.position.set(goldPos.x, 1.85, goldPos.z);
  goldenGroup.add(buildSupertreeModel(14, 5.2));
  const gt2 = buildSupertreeModel(11.5, 4.4);
  gt2.position.set(4.2, 0, 2.8);
  goldenGroup.add(gt2);
  const gt3 = buildSupertreeModel(12.5, 4.8);
  gt3.position.set(-3.5, 0, 3.0);
  goldenGroup.add(gt3);
  bindPoi('golden-garden', goldenGroup);
  group.add(goldenGroup);

  // Silver Garden (#25) - Aligned to (0.458, 0.160)
  const silverGroup = new THREE.Group();
  const silvPos = normToWorld(0.458, 0.160);
  silverGroup.position.set(silvPos.x, 1.85, silvPos.z);
  silverGroup.add(buildSupertreeModel(13.5, 5.0));
  const st2 = buildSupertreeModel(11, 4.2);
  st2.position.set(-4.2, 0, 2.2);
  silverGroup.add(st2);
  const st3 = buildSupertreeModel(12, 4.5);
  st3.position.set(3.6, 0, 2.6);
  silverGroup.add(st3);
  bindPoi('silver-garden', silverGroup);
  group.add(silverGroup);

  // --- E. HERITAGE GARDENS (#15–18), IMBA THEATRE (#37), BAYFRONT & OTHERS ---

  // Chinese Garden (#16) - Red Moongate Arch at (0.401, 0.284)
  const chineseGroup = new THREE.Group();
  const cgPos = normToWorld(0.401, 0.284);
  chineseGroup.position.set(cgPos.x, 1.85, cgPos.z);
  const moongate = new THREE.Mesh(
    trackGeom(new THREE.TorusGeometry(2.6, 0.45, 10, 24, Math.PI * 1.6)),
    trackMat(new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.4 }))
  );
  moongate.position.y = 2.4;
  chineseGroup.add(moongate);
  bindPoi('chinese-garden', chineseGroup);
  group.add(chineseGroup);

  // Malay Garden (#17) - Pitched Timber Kampong House at (0.381, 0.338)
  const malayGroup = new THREE.Group();
  const mgPos = normToWorld(0.381, 0.338);
  malayGroup.position.set(mgPos.x, 1.85, mgPos.z);
  const kampongBase = new THREE.Mesh(
    trackGeom(new THREE.BoxGeometry(4.2, 2.2, 3.2)),
    trackMat(new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.8 }))
  );
  kampongBase.position.y = 1.4;
  malayGroup.add(kampongBase);
  const kampongRoof = new THREE.Mesh(
    trackGeom(new THREE.ConeGeometry(3.6, 2.4, 4)),
    trackMat(new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.85 }))
  );
  kampongRoof.position.y = 3.6;
  kampongRoof.rotation.y = Math.PI / 4;
  malayGroup.add(kampongRoof);
  bindPoi('malay-garden', malayGroup);
  group.add(malayGroup);

  // Colonial Garden (#18) - White Victorian Gazebo at (0.352, 0.402)
  const colonialGroup = new THREE.Group();
  const colPos = normToWorld(0.352, 0.402);
  colonialGroup.position.set(colPos.x, 1.85, colPos.z);
  const gazebo = new THREE.Mesh(
    trackGeom(new THREE.CylinderGeometry(2.4, 2.4, 3.0, 8)),
    steelRibMat
  );
  gazebo.position.y = 1.5;
  colonialGroup.add(gazebo);
  bindPoi('colonial-garden', colonialGroup);
  group.add(colonialGroup);

  // Understorey Conical Beehive Pavilion (#12) at (0.541, 0.527)
  const understoreyGroup = new THREE.Group();
  const usPos = normToWorld(0.541, 0.527);
  understoreyGroup.position.set(usPos.x, 1.85, usPos.z);
  const beehive = new THREE.Mesh(
    trackGeom(new THREE.ConeGeometry(4.2, 5.2, 20)),
    trackMat(new THREE.MeshStandardMaterial({ color: 0xa16207, roughness: 0.75 }))
  );
  beehive.position.y = 2.6;
  understoreyGroup.add(beehive);
  bindPoi('understorey', understoreyGroup);
  group.add(understoreyGroup);

  // #9 Discovery - Curved Brown Timber Fallen Log Pavilion at (0.378, 0.545)
  const discoveryGroup = new THREE.Group();
  const discPos = normToWorld(0.378, 0.545);
  discoveryGroup.position.set(discPos.x, 1.85, discPos.z);
  const logCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-3.5, 0.8, -0.5),
    new THREE.Vector3(0, 1.4, 1.0),
    new THREE.Vector3(3.5, 0.9, -0.4),
  ]);
  const logMesh = new THREE.Mesh(
    trackGeom(new THREE.TubeGeometry(logCurve, 16, 0.85, 8, false)),
    trackMat(new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.85 }))
  );
  discoveryGroup.add(logMesh);
  bindPoi('world-of-plants', discoveryGroup);
  group.add(discoveryGroup);

  // #10 Web of Life - Giant 3D Green Topiary Monitor Lizard / Chameleon Sculpture at (0.432, 0.545)
  const lizardGroup = new THREE.Group();
  const lizPos = normToWorld(0.432, 0.545);
  lizardGroup.position.set(lizPos.x, 1.85, lizPos.z);
  const topiaryMat = trackMat(new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.8 }));
  const lizBody = new THREE.Mesh(trackGeom(new THREE.CapsuleGeometry(1.1, 2.8, 8, 12)), topiaryMat);
  lizBody.position.set(0, 1.8, 0);
  lizBody.rotation.z = Math.PI / 4;
  lizardGroup.add(lizBody);
  const lizHead = new THREE.Mesh(trackGeom(new THREE.ConeGeometry(1.0, 2.2, 8)), topiaryMat);
  lizHead.position.set(-1.2, 3.2, 0);
  lizHead.rotation.z = Math.PI / 3;
  lizardGroup.add(lizHead);
  group.add(lizardGroup);

  // #37 IMBA Theatre (West Lawn) at (0.312, 0.248)
  const imbaPos = normToWorld(0.312, 0.248);
  const imbaGroup = new THREE.Group();
  imbaGroup.position.set(imbaPos.x, 1.85, imbaPos.z);
  const imbaBody = new THREE.Mesh(
    trackGeom(new THREE.BoxGeometry(6.8, 2.4, 4.8)),
    trackMat(new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.45 }))
  );
  imbaBody.position.y = 1.2;
  imbaGroup.add(imbaBody);
  const imbaRoof = new THREE.Mesh(
    trackGeom(new THREE.BoxGeometry(6.2, 0.3, 4.2)),
    trackMat(new THREE.MeshStandardMaterial({ color: 0x4ade80, roughness: 0.75 }))
  );
  imbaRoof.position.y = 2.5;
  imbaGroup.add(imbaRoof);
  group.add(imbaGroup);

  // Marc Quinn "Planet" Floating Baby Sculpture (#19) at (0.277, 0.495)
  const planetGroup = new THREE.Group();
  const plPos = normToWorld(0.277, 0.495);
  planetGroup.position.set(plPos.x, 1.85, plPos.z);
  planetGroup.rotation.y = -Math.PI / 5;
  const whiteBronze = trackMat(new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.28, metalness: 0.15 }));
  const babyHead = new THREE.Mesh(trackGeom(new THREE.SphereGeometry(1.5, 16, 16)), whiteBronze);
  babyHead.position.set(-2.6, 1.9, 0);
  planetGroup.add(babyHead);
  const babyBody = new THREE.Mesh(trackGeom(new THREE.CapsuleGeometry(1.3, 3.2, 12, 16)), whiteBronze);
  babyBody.rotation.z = Math.PI / 2.2;
  babyBody.position.set(0.2, 1.8, 0);
  planetGroup.add(babyBody);
  bindPoi('planet-sculpture', planetGroup);
  group.add(planetGroup);

  // SG50 Lattice / Bayfront Pavilion (#33) at (0.191, 0.435)
  const sg50Group = new THREE.Group();
  const sg50Pos = normToWorld(0.191, 0.435);
  sg50Group.position.set(sg50Pos.x, 1.85, sg50Pos.z);
  const latticeDome = new THREE.Mesh(
    trackGeom(new THREE.IcosahedronGeometry(4.8, 2)),
    trackMat(new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 0.85, roughness: 0.25 }))
  );
  latticeDome.scale.set(1.2, 0.62, 1.0);
  latticeDome.position.y = 1.5;
  sg50Group.add(latticeDome);
  bindPoi('bayfront-pavilion', sg50Group);
  group.add(sg50Group);

  // Floral Fantasy (#26) at (0.255, 0.365)
  const ffPos = normToWorld(0.255, 0.365);
  const ffBuilding = new THREE.Mesh(
    trackGeom(new THREE.BoxGeometry(5.5, 2.0, 3.8)),
    trackMat(new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.45 }))
  );
  ffBuilding.position.set(ffPos.x, 2.8, ffPos.z);
  bindPoi('floral-fantasy', ffBuilding);
  group.add(ffBuilding);

  // Dragonfly Bridge (#Bridge) at (0.324, 0.336) & MBS Overpass (#Link) with Rotunda at (0.285, 0.312)
  const dfBridgePos = normToWorld(0.324, 0.336);
  const dfBridge = new THREE.Mesh(
    trackGeom(new THREE.BoxGeometry(10.5, 0.55, 2.4)),
    trackMat(new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.6 }))
  );
  dfBridge.position.set(dfBridgePos.x, 2.15, dfBridgePos.z);
  dfBridge.rotation.y = -0.25;
  bindPoi('dragonfly-bridge', dfBridge);
  group.add(dfBridge);

  const mbsPos = normToWorld(0.225, 0.285);
  const mbsOverpass = new THREE.Mesh(
    trackGeom(new THREE.BoxGeometry(22, 0.85, 2.8)),
    steelRibMat
  );
  mbsOverpass.position.set(mbsPos.x, 5.2, mbsPos.z);
  mbsOverpass.rotation.y = -Math.PI / 5.5;
  bindPoi('mbs-overpass', mbsOverpass);
  group.add(mbsOverpass);

  const rotundaPos = normToWorld(0.285, 0.312);
  const rotunda = new THREE.Mesh(
    trackGeom(new THREE.CylinderGeometry(3.4, 3.8, 3.8, 20)),
    steelRibMat
  );
  rotunda.position.set(rotundaPos.x, 3.6, rotundaPos.z);
  group.add(rotunda);

  // Sun Pavilion (#22) at (0.690, 0.355) & Children's Garden (#23) at (0.763, 0.406)
  const sunPavPos = normToWorld(0.690, 0.355);
  const sunPavMesh = new THREE.Mesh(
    trackGeom(new THREE.BoxGeometry(5.0, 2.0, 3.5)),
    glassDomeMat
  );
  sunPavMesh.position.set(sunPavPos.x, 2.8, sunPavPos.z);
  bindPoi('sun-pavilion', sunPavMesh);
  group.add(sunPavMesh);

  const childGroup = new THREE.Group();
  const chPos = normToWorld(0.763, 0.406);
  childGroup.position.set(chPos.x, 1.85, chPos.z);
  const splashPad = new THREE.Mesh(
    trackGeom(new THREE.CylinderGeometry(5.2, 5.5, 0.25, 24)),
    trackMat(new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.3 }))
  );
  childGroup.add(splashPad);

  const splashJets: THREE.Mesh[] = [];
  const jetGeom = trackGeom(new THREE.CylinderGeometry(0.15, 0.35, 3.5, 8));
  const jetMat = trackMat(new THREE.MeshBasicMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.85 }));
  for (let j = 0; j < 6; j++) {
    const ang = (j / 6) * Math.PI * 2;
    const jet = new THREE.Mesh(jetGeom, jetMat);
    jet.position.set(Math.cos(ang) * 3.0, 1.8, Math.sin(ang) * 3.0);
    childGroup.add(jet);
    splashJets.push(jet);
  }
  bindPoi('far-east-children-garden', childGroup);
  group.add(childGroup);

  // Satay by the Bay (#g) - Three Sculptural Curved Shell Roofs at (0.890, 0.511)
  const satayGroup = new THREE.Group();
  const satPos = normToWorld(0.890, 0.511);
  satayGroup.position.set(satPos.x, 1.85, satPos.z);
  for (let s = -1; s <= 1; s++) {
    const pav = new THREE.Mesh(
      trackGeom(new THREE.SphereGeometry(2.6, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.45)),
      steelRibMat
    );
    pav.scale.set(1.2, 0.8, 0.9);
    pav.position.set(s * 3.8, 1.2, s * 1.1);
    satayGroup.add(pav);
  }
  bindPoi('satay-by-the-bay', satayGroup);
  group.add(satayGroup);

  // ============================================================================
  // 5. DENSE MULTI-SPECIES BOTANICAL 3D TREES (InstancedMesh)
  // ============================================================================
  const treeCount = DENSE_TREE_SPECIFICATIONS.length;
  const instTrunkGeom = trackGeom(new THREE.CylinderGeometry(0.2, 0.38, 2.2, 6));
  const instCrownGeom = trackGeom(new THREE.DodecahedronGeometry(1.45, 1));
  const instTrunkMat = trackMat(new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 }));
  const instCrownMat = trackMat(new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.75 }));

  const instancedTrunks = new THREE.InstancedMesh(instTrunkGeom, instTrunkMat, treeCount);
  const instancedCrowns = new THREE.InstancedMesh(instCrownGeom, instCrownMat, treeCount);
  instancedCrowns.castShadow = !isSoftwareGl;
  instancedCrowns.receiveShadow = true;

  const dummy = new THREE.Object3D();
  const treeColor = new THREE.Color();

  DENSE_TREE_SPECIFICATIONS.forEach((spec, idx) => {
    const p = normToWorld(spec.nx, spec.ny);
    const sc = spec.scale;

    dummy.position.set(p.x, 1.85 + 1.1 * sc, p.z);
    dummy.scale.set(sc, sc, sc);
    dummy.rotation.set(0, idx * 1.1, 0);
    dummy.updateMatrix();
    instancedTrunks.setMatrixAt(idx, dummy.matrix);

    dummy.position.set(p.x, 1.85 + 2.5 * sc, p.z);
    if (spec.type === 'palm') {
      dummy.scale.set(sc * 1.25, sc * 0.65, sc * 1.25);
      treeColor.setHex(0x16a34a);
    } else if (spec.type === 'flowering') {
      dummy.scale.set(sc * 1.05, sc * 0.95, sc * 1.05);
      treeColor.setHex(idx % 2 === 0 ? 0x10b981 : 0x84cc16);
    } else {
      dummy.scale.set(sc * 1.1, sc * 0.95, sc * 1.1);
      treeColor.setHex(0x15803d);
    }
    dummy.updateMatrix();
    instancedCrowns.setMatrixAt(idx, dummy.matrix);
    instancedCrowns.setColorAt(idx, treeColor);
  });

  instancedTrunks.computeBoundingSphere();
  instancedCrowns.computeBoundingSphere();
  if (instancedCrowns.instanceColor) instancedCrowns.instanceColor.needsUpdate = true;
  group.add(instancedTrunks);
  group.add(instancedCrowns);

  // ============================================================================
  // 6. LIVE 3D MARINA BAY SIGHTSEEING CRUISE BOATS & BUMBOATS (NO CARS)
  // ============================================================================
  const boatHullWhiteMat = trackMat(new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.15 }));
  const boatKeelNavyMat = trackMat(new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4, metalness: 0.3 }));
  const boatTeakDeckMat = trackMat(new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.65 }));
  const boatWindowGlassMat = trackMat(new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.1, metalness: 0.85 }));
  const boatStripeMat = trackMat(new THREE.MeshStandardMaterial({ color: 0xe11d48, roughness: 0.3 }));
  const wakeFoamMat = trackMat(new THREE.MeshBasicMaterial({ color: 0xe0f2fe, transparent: true, opacity: 0.62 }));

  const buildCruiseBoatModel = (isBumboat: boolean): THREE.Group => {
    const boat = new THREE.Group();

    const keel = new THREE.Mesh(
      trackGeom(new THREE.BoxGeometry(1.75, 0.28, 3.8)),
      boatKeelNavyMat
    );
    keel.position.set(0, 0.14, -0.2);
    boat.add(keel);

    const upperHull = new THREE.Mesh(
      trackGeom(new THREE.BoxGeometry(1.88, 0.34, 4.0)),
      isBumboat ? boatTeakDeckMat : boatHullWhiteMat
    );
    upperHull.position.set(0, 0.38, -0.1);
    upperHull.castShadow = true;
    boat.add(upperHull);

    const bowGeom = trackGeom(new THREE.ConeGeometry(1.33, 2.2, 4));
    bowGeom.rotateY(Math.PI / 4);
    bowGeom.rotateX(Math.PI / 2);
    bowGeom.scale(1.0, 0.36, 1.0);
    const bowMesh = new THREE.Mesh(bowGeom, isBumboat ? boatTeakDeckMat : boatHullWhiteMat);
    bowMesh.position.set(0, 0.36, 2.95);
    bowMesh.castShadow = true;
    boat.add(bowMesh);

    const stripe = new THREE.Mesh(
      trackGeom(new THREE.BoxGeometry(1.94, 0.09, 3.9)),
      boatStripeMat
    );
    stripe.position.set(0, 0.26, -0.05);
    boat.add(stripe);

    const aftDeck = new THREE.Mesh(
      trackGeom(new THREE.BoxGeometry(1.62, 0.08, 1.4)),
      boatTeakDeckMat
    );
    aftDeck.position.set(0, 0.56, -1.35);
    boat.add(aftDeck);

    const cabin = new THREE.Mesh(
      trackGeom(new THREE.BoxGeometry(1.38, 0.46, 2.35)),
      boatHullWhiteMat
    );
    cabin.position.set(0, 0.72, 0.25);
    cabin.castShadow = true;
    boat.add(cabin);

    const windowBand = new THREE.Mesh(
      trackGeom(new THREE.BoxGeometry(1.44, 0.22, 2.15)),
      boatWindowGlassMat
    );
    windowBand.position.set(0, 0.78, 0.30);
    boat.add(windowBand);

    const sunRoof = new THREE.Mesh(
      trackGeom(new THREE.BoxGeometry(1.46, 0.10, 2.55)),
      boatHullWhiteMat
    );
    sunRoof.position.set(0, 0.98, 0.15);
    boat.add(sunRoof);

    const mast = new THREE.Mesh(
      trackGeom(new THREE.CylinderGeometry(0.05, 0.06, 0.65, 6)),
      boatHullWhiteMat
    );
    mast.position.set(0, 1.30, 0.55);
    mast.rotation.x = -0.25;
    boat.add(mast);

    const wakeLeft = new THREE.Mesh(
      trackGeom(new THREE.BoxGeometry(0.24, 0.04, 3.8)),
      wakeFoamMat
    );
    wakeLeft.position.set(-0.75, 0.05, -3.7);
    wakeLeft.rotation.y = 0.24;
    boat.add(wakeLeft);

    const wakeRight = new THREE.Mesh(
      trackGeom(new THREE.BoxGeometry(0.24, 0.04, 3.8)),
      wakeFoamMat
    );
    wakeRight.position.set(0.75, 0.05, -3.7);
    wakeRight.rotation.y = -0.24;
    boat.add(wakeRight);

    const wakeCenter = new THREE.Mesh(
      trackGeom(new THREE.BoxGeometry(0.45, 0.04, 2.8)),
      wakeFoamMat
    );
    wakeCenter.position.set(0, 0.05, -3.3);
    boat.add(wakeCenter);

    return boat;
  };

  // North-East Marina Bay Shipping Lanes
  const boatLanes: THREE.CatmullRomCurve3[] = [
    new THREE.CatmullRomCurve3(
      [
        [0.44, -0.02],
        [0.62, 0.08],
        [0.80, 0.21],
        [0.98, 0.37],
      ].map(([nx, ny]) => {
        const p = normToWorld(nx, ny);
        return new THREE.Vector3(p.x, 0.2, p.z);
      })
    ),
    new THREE.CatmullRomCurve3(
      [
        [1.02, 0.31],
        [0.84, 0.15],
        [0.66, 0.01],
        [0.48, -0.08],
      ].map(([nx, ny]) => {
        const p = normToWorld(nx, ny);
        return new THREE.Vector3(p.x, 0.2, p.z);
      })
    ),
  ];

  const boats: { mesh: THREE.Group; curve: THREE.CatmullRomCurve3; speed: number; offset: number }[] = [];
  for (let b = 0; b < 4; b++) {
    const boatGroup = buildCruiseBoatModel(b % 2 === 1);
    group.add(boatGroup);
    boats.push({
      mesh: boatGroup,
      curve: boatLanes[b % boatLanes.length],
      speed: 0.028 + (b % 2) * 0.009,
      offset: (b * 0.27) % 1,
    });
  }

  // ============================================================================
  // 7. INTERACTIVE 3D NUMBERED ARCHITECTURAL PINS & 3D FOOD PAVILIONS FOR POIS
  // ============================================================================
  const beaconMap = new Map<
    string,
    { group: THREE.Group; badge: THREE.Sprite; ring: THREE.Mesh; baseHeight: number; baseScale: number; aspect: number; poi: POIItem }
  >();

  const shortDiningLabels: Record<string, string> = {
    'satay-by-the-bay': '🍢 Satay by the Bay',
    'jurassic-nest': '🦖 Jurassic Nest Food Hall',
    'supertree-food-hall': '🍕 Supertree Bistro',
    'shake-shack': '🍔 Shake Shack',
    'mcdonalds-canopy': "🍟 McDonald's",
    'starbucks-conservatories': '☕ Starbucks',
    'tunglok-seafood': '🦀 TungLok Seafood',
    'marguerite-hortus': '🍽️ Marguerite & Hortus',
    'conservatory-sweet-cafe': '🍦 Gelato & Patisserie',
    'childrens-garden-cafe': "🧇 Children's Café",
    'waterfront-bistro': '🥐 Waterfront Bistro',
    'bayfront-cafe': '☕ Bayfront Café',
  };

  const patioDeckGeom = trackGeom(new THREE.CylinderGeometry(2.6, 2.8, 0.25, 16));
  const patioDeckMat = trackMat(new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.6 }));
  const cafeRoofGeom = trackGeom(new THREE.ConeGeometry(2.1, 1.35, 12));
  const cafeRoofMat = trackMat(new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.45 }));
  const cafeWallGeom = trackGeom(new THREE.CylinderGeometry(1.55, 1.55, 1.4, 12));
  const cafeWallMat = trackMat(new THREE.MeshStandardMaterial({ color: 0xfffbeb, roughness: 0.5 }));
  const umbrellaTopGeom = trackGeom(new THREE.ConeGeometry(1.05, 0.55, 8));
  const umbrellaPoleGeom = trackGeom(new THREE.CylinderGeometry(0.08, 0.08, 1.3, 6));
  const umbrellaMatRed = trackMat(new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.5 }));
  const umbrellaMatAmber = trackMat(new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.5 }));

  GARDENS_POIS.forEach((poi) => {
    const bGroup = new THREE.Group();
    const pos = normToWorld(poi.mapCoord.x, poi.mapCoord.y);
    bGroup.position.set(pos.x, 1.88, pos.z);
    bGroup.userData = { poiId: poi.id, poi };

    const isDining = poi.category === 'dining';
    const colorHex =
      poi.category === 'conservatory' ? 0x06b6d4 :
      poi.category === 'supertree' ? 0xa855f7 :
      isDining ? 0xea580c :
      poi.category === 'facility' ? 0x3b82f6 : 0x10b981;

    // Build 3D Outdoor Food Pavilion & Café Parasol Umbrellas for Dining POIs
    if (isDining) {
      const deck = new THREE.Mesh(patioDeckGeom, patioDeckMat);
      deck.position.y = 0.12;
      deck.receiveShadow = true;
      bGroup.add(deck);

      const wall = new THREE.Mesh(cafeWallGeom, cafeWallMat);
      wall.position.y = 0.85;
      wall.castShadow = true;
      bGroup.add(wall);

      const roof = new THREE.Mesh(cafeRoofGeom, cafeRoofMat);
      roof.position.y = 2.15;
      roof.castShadow = true;
      bGroup.add(roof);

      [-1.7, 1.7].forEach((ox, idx) => {
        const pole = new THREE.Mesh(umbrellaPoleGeom, steelRibMat);
        pole.position.set(ox, 0.75, 0.8);
        bGroup.add(pole);

        const umb = new THREE.Mesh(umbrellaTopGeom, idx === 0 ? umbrellaMatRed : umbrellaMatAmber);
        umb.position.set(ox, 1.45, 0.8);
        umb.castShadow = true;
        bGroup.add(umb);
      });
    }

    const ring = new THREE.Mesh(
      trackGeom(new THREE.RingGeometry(isDining ? 2.6 : 1.2, isDining ? 3.2 : 1.75, 24)),
      trackMat(new THREE.MeshBasicMaterial({ color: colorHex, side: THREE.DoubleSide, transparent: true, opacity: 0.82 }))
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.08;
    bGroup.add(ring);

    const badgeCanvas = document.createElement('canvas');
    badgeCanvas.width = isDining ? 384 : 128;
    badgeCanvas.height = isDining ? 160 : 128;
    const ctx = badgeCanvas.getContext('2d');
    if (ctx) {
      if (isDining) {
        const label = shortDiningLabels[poi.id] || `🍴 ${poi.name}`;
        // Top pill with restaurant name
        ctx.fillStyle = 'rgba(124, 45, 18, 0.94)';
        ctx.strokeStyle = '#fdba74';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.roundRect(12, 8, 360, 58, 22);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#fff7ed';
        ctx.font = 'bold 26px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, 192, 38);

        // Circular badge below pill
        ctx.fillStyle = '#ea580c';
        ctx.strokeStyle = '#fef3c7';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(192, 114, 38, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 34px sans-serif';
        ctx.fillText((poi.numberKey || 'F').toUpperCase(), 192, 115);
      } else {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        ctx.beginPath();
        ctx.arc(64, 64, 60, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#' + new THREE.Color(colorHex).getHexString();
        ctx.beginPath();
        ctx.arc(64, 64, 50, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 7;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 44px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(poi.numberKey || '★', 64, 66);
      }
    }
    const badgeTex = new THREE.CanvasTexture(badgeCanvas);
    badgeTex.colorSpace = THREE.SRGBColorSpace;
    disposableTexs.push(badgeTex);

    const isTall = poi.category === 'conservatory' || poi.category === 'supertree';
    const baseHeight = isTall ? 22.5 : isDining ? 11.2 : 7.2;
    const baseScale = isDining ? 6.2 : 4.8;
    const aspect = isDining ? 384 / 160 : 1.0;

    const badgeMat = trackMat(new THREE.SpriteMaterial({
      map: badgeTex,
      transparent: true,
      depthTest: false,
    }));
    const badge = new THREE.Sprite(badgeMat);
    badge.position.y = baseHeight;
    badge.scale.set(baseScale * aspect, baseScale, 1);
    badge.renderOrder = isDining ? 28 : 20;
    badge.userData = { poiId: poi.id, poi };
    bGroup.add(badge);

    const stem = new THREE.Mesh(
      trackGeom(new THREE.CylinderGeometry(0.08, 0.08, baseHeight - 0.8, 6)),
      trackMat(new THREE.MeshBasicMaterial({ color: isDining ? 0xfed7aa : 0xffffff, transparent: true, opacity: 0.6 }))
    );
    stem.position.y = (baseHeight - 0.8) / 2;
    bGroup.add(stem);

    const hitBox = new THREE.Mesh(
      trackGeom(new THREE.CylinderGeometry(4.5, 4.5, baseHeight + 3, 10)),
      trackMat(new THREE.MeshBasicMaterial({ visible: false }))
    );
    hitBox.position.y = (baseHeight + 3) / 2;
    hitBox.userData = { poiId: poi.id, poi };
    bGroup.add(hitBox);

    group.add(bGroup);
    beaconMap.set(poi.id, { group: bGroup, badge, ring, baseHeight, baseScale, aspect, poi });
  });

  // ============================================================================
  // 8. PER-FRAME LIVE WORLD ANIMATION UPDATE
  // ============================================================================
  const _scaleTarget = new THREE.Vector3();

  const update = (
    elapsed: number,
    delta: number,
    selectedId: string | null,
    hoveredId: string | null,
    cat: CategoryType,
    timeOfDay: TimeOfDayMode
  ) => {
    waterTex.offset.x = (elapsed * 0.03) % 1;
    waterTex.offset.y = (elapsed * 0.02) % 1;

    waterfallDrops.forEach((drop, idx) => {
      drop.position.y -= delta * 9.5;
      if (drop.position.y < 0.5) {
        drop.position.y = 15.5;
      }
      drop.scale.setScalar(0.8 + Math.sin(elapsed * 6 + idx) * 0.25);
    });

    clockHand.rotation.y = -elapsed * 0.4;

    splashJets.forEach((jet, i) => {
      const hScale = 0.5 + 0.6 * Math.abs(Math.sin(elapsed * 3.2 + i * 0.9));
      jet.scale.set(1, hScale, 1);
      jet.position.y = 1.75 * hScale;
    });

    boats.forEach((b, idx) => {
      const t = (elapsed * b.speed + b.offset) % 1;
      const pos = b.curve.getPointAt(t);
      const tangent = b.curve.getTangentAt(t);
      const bobY = 0.22 + Math.sin(elapsed * 2.8 + idx * 1.4) * 0.04;
      b.mesh.position.set(pos.x, bobY, pos.z);
      b.mesh.rotation.y = Math.atan2(tangent.x, tangent.z);
    });

    if (timeOfDay === 'night') {
      const r = 0.6 + 0.4 * Math.sin(elapsed * 2.0);
      const b = 0.6 + 0.4 * Math.cos(elapsed * 1.7);
      glowRingMat.color.setRGB(r, 0.2, b);
      glowRingMat.opacity = 0.98;
      purpleBaseMat.color.setHex(0x130722);
      seaPlinthMat.color.setHex(0x1e293b);
      landMat.color.setHex(0x64748b);
      supertreeTrunkMat.emissive.setHex(0x831843);
      supertreeTrunkMat.emissiveIntensity = 0.85;
      glassDomeMat.emissive.setHex(0x0891b2);
      glassDomeMat.emissiveIntensity = 0.55;
    } else if (timeOfDay === 'sunset') {
      glowRingMat.color.setHex(0xf97316);
      glowRingMat.opacity = 0.85;
      purpleBaseMat.color.setHex(0x2e1042);
      seaPlinthMat.color.setHex(0xfdba74);
      landMat.color.setHex(0xfed7aa);
      supertreeTrunkMat.emissive.setHex(0x581c87);
      supertreeTrunkMat.emissiveIntensity = 0.5;
      glassDomeMat.emissive.setHex(0xf59e0b);
      glassDomeMat.emissiveIntensity = 0.25;
    } else {
      glowRingMat.color.setHex(0xfbbf24);
      glowRingMat.opacity = 0.55;
      purpleBaseMat.color.setHex(0x3d1452);
      seaPlinthMat.color.setHex(0xffffff);
      landMat.color.setHex(0xffffff);
      supertreeTrunkMat.emissive.setHex(0x4a044e);
      supertreeTrunkMat.emissiveIntensity = 0.25;
      glassDomeMat.emissive.setHex(0x000000);
      glassDomeMat.emissiveIntensity = 0.0;
    }

    beaconMap.forEach((item, id) => {
      const isSel = selectedId === id;
      const isHov = hoveredId === id;
      const matches = cat === 'all' || item.poi.category === cat;
      item.group.visible = matches || isSel || isHov;

      const floatOffset = Math.sin(elapsed * 2.8 + (id.charCodeAt(0) % 10)) * 0.35;
      item.badge.position.y = item.baseHeight + (isSel ? 1.8 : isHov ? 1.0 : 0) + floatOffset;

      const mult = isSel ? 1.45 : isHov ? 1.25 : 1.0;
      const targetS = item.baseScale * mult;
      _scaleTarget.set(targetS * item.aspect, targetS, 1);
      item.badge.scale.lerp(_scaleTarget, Math.min(1, delta * 10));

      const ringSc = isSel ? 1.5 + Math.sin(elapsed * 5) * 0.2 : isHov ? 1.25 : 1.0;
      item.ring.scale.set(ringSc, ringSc, 1);
    });
  };

  const dispose = () => {
    disposableGeoms.forEach((g) => g.dispose());
    disposableMats.forEach((m) => m.dispose());
    disposableTexs.forEach((t) => t.dispose());
  };

  return { group, poiHitMap, update, dispose };
}
