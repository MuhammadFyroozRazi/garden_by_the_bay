import * as THREE from 'three';

export interface TerrainResult {
  group: THREE.Group;
  updateWater: (time: number) => void;
  dispose: () => void;
}

export function createTerrainAndWater(
  sceneWidth = 220,
  sceneDepth = 150,
  isSoftwareGl = false
): TerrainResult {
  const group = new THREE.Group();

  // Load the authentic Gardens by the Bay reference map
  const textureLoader = new THREE.TextureLoader();
  const mapTexture = textureLoader.load('/assets/aistudio/GB-Map-15-02-2026_382aa696.jpg');
  mapTexture.colorSpace = THREE.SRGBColorSpace;
  mapTexture.anisotropy = isSoftwareGl ? 1 : 16;
  mapTexture.generateMipmaps = true;

  // 1. Elevated Architectural Ground Plinth
  const groundGeom = new THREE.BoxGeometry(sceneWidth, 4.0, sceneDepth, 32, 1, 32);

  const sideMat = new THREE.MeshStandardMaterial({
    color: 0x111827, // Sleek dark museum pedestal finish
    roughness: 0.6,
    metalness: 0.3,
  });

  const topMat = new THREE.MeshStandardMaterial({
    map: mapTexture,
    roughness: 0.7,
    metalness: 0.05,
  });

  // Box faces: [px, nx, py (top), ny, pz, nz]
  const groundMesh = new THREE.Mesh(groundGeom, [sideMat, sideMat, topMat, sideMat, sideMat, sideMat]);
  groundMesh.position.y = -2.0; // Top face at y = 0
  groundMesh.receiveShadow = true;
  group.add(groundMesh);

  // 2. Beveled Museum Pedestal Base Frame
  const plinthGeom = new THREE.BoxGeometry(sceneWidth + 12, 2.5, sceneDepth + 12);
  const plinthMat = new THREE.MeshStandardMaterial({
    color: 0x030712,
    roughness: 0.3,
    metalness: 0.8,
  });
  const plinthMesh = new THREE.Mesh(plinthGeom, plinthMat);
  plinthMesh.position.y = -4.5;
  plinthMesh.receiveShadow = true;
  group.add(plinthMesh);

  // 3. Subtle Animated Water Shimmer for Marina Bay / Singapore Strait (North-East)
  const waterCanvas = document.createElement('canvas');
  waterCanvas.width = 128;
  waterCanvas.height = 128;
  const wCtx = waterCanvas.getContext('2d');
  if (wCtx) {
    const imgData = wCtx.createImageData(128, 128);
    for (let i = 0; i < imgData.data.length; i += 4) {
      const u = (i / 4) % 128;
      const v = Math.floor((i / 4) / 128);
      const val = 128 + Math.sin(u * 0.12) * 35 + Math.cos(v * 0.12) * 35;
      imgData.data[i] = 128;
      imgData.data[i + 1] = Math.floor(val);
      imgData.data[i + 2] = 255;
      imgData.data[i + 3] = 255;
    }
    wCtx.putImageData(imgData, 0, 0);
  }
  const waterNormals = new THREE.CanvasTexture(waterCanvas);
  waterNormals.wrapS = THREE.RepeatWrapping;
  waterNormals.wrapT = THREE.RepeatWrapping;
  waterNormals.repeat.set(8, 5);

  const bayWaterGeom = new THREE.PlaneGeometry(sceneWidth * 0.52, sceneDepth * 0.38);
  const bayWaterMat = new THREE.MeshStandardMaterial({
    color: 0x0284c7,
    roughness: 0.1,
    metalness: 0.8,
    transparent: true,
    opacity: 0.35,
    normalMap: waterNormals,
  });
  const bayWaterMesh = new THREE.Mesh(bayWaterGeom, bayWaterMat);
  bayWaterMesh.rotation.x = -Math.PI / 2;
  bayWaterMesh.position.set(sceneWidth * 0.26, 0.06, -sceneDepth * 0.33);
  group.add(bayWaterMesh);

  // 4. Curated Architectural Trees (strictly in designated garden groves, NEVER over legend)
  // Each tree is a 2-part architectural model: tapered dark trunk + soft geometric canopy
  const treePositions: [number, number, number][] = [
    // Serene Garden (tranquil Japanese stone garden, bottom-left)
    [-76, 16, 0.9], [-82, 22, 1.1], [-70, 24, 0.85], [-66, 18, 1.0],
    // The Meadow outer perimeter (lawn border)
    [-52, 22, 1.1], [-45, 12, 1.2], [-58, 5, 1.0], [-64, -2, 1.15],
    // Colonial & Malay Heritage gardens
    [-34, -18, 0.95], [-26, -22, 1.05], [-28, -12, 0.9], [-38, -10, 1.1],
    // Dragonfly Lake fringe
    [-46, -30, 0.9], [-54, -25, 1.1], [-18, -35, 1.0],
    // Kingfisher Wetlands & Lotus Pond
    [64, -6, 1.0], [72, -12, 1.15], [58, 2, 0.9], [76, 5, 1.2],
    // Satay by the Bay coastal fringe
    [84, -2, 1.1], [88, -12, 1.0], [78, -20, 1.2],
  ];

  const trunkGeom = new THREE.CylinderGeometry(0.18, 0.35, 2.0, 6);
  const foliageGeom = new THREE.DodecahedronGeometry(1.2, 1);
  const trunkMat = new THREE.MeshStandardMaterial({ color: 0x451a03, roughness: 0.9 });
  const foliageMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.75, metalness: 0.1 });

  treePositions.forEach(([x, z, scale]) => {
    const treeGroup = new THREE.Group();
    const trunk = new THREE.Mesh(trunkGeom, trunkMat);
    trunk.position.y = 1.0 * scale;
    trunk.scale.set(scale, scale, scale);
    trunk.castShadow = true;
    treeGroup.add(trunk);

    const foliage = new THREE.Mesh(foliageGeom, foliageMat);
    foliage.position.y = 2.4 * scale;
    foliage.scale.set(scale, scale * 1.1, scale);
    foliage.castShadow = true;
    treeGroup.add(foliage);

    treeGroup.position.set(x, 0, z);
    group.add(treeGroup);
  });

  const updateWater = (time: number) => {
    waterNormals.offset.x = (time * 0.015) % 1;
    waterNormals.offset.y = (time * 0.01) % 1;
  };

  const dispose = () => {
    mapTexture.dispose();
    waterNormals.dispose();
    groundGeom.dispose();
    topMat.dispose();
    sideMat.dispose();
    plinthGeom.dispose();
    plinthMat.dispose();
    bayWaterGeom.dispose();
    bayWaterMat.dispose();
    trunkGeom.dispose();
    foliageGeom.dispose();
    trunkMat.dispose();
    foliageMat.dispose();
  };

  return { group, updateWater, dispose };
}
