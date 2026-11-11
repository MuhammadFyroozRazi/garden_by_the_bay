import * as THREE from 'three';
import { POIItem, TimeOfDayMode, CategoryType } from '../../types/map';
import { GARDENS_POIS } from '../../data/gardensData';
import {
  WORLD_WIDTH,
  WORLD_DEPTH,
  normToWorld,
  MAIN_LANDMASS_OUTLINE,
  DRAGONFLY_LAKE_OUTLINE,
  KINGFISHER_LAKE_OUTLINE,
  PATHWAY_NETWORK,
  ROAD_NETWORK,
  DENSE_TREE_SPECIFICATIONS,
} from './Gardens3DWorld';
import { loadReferenceMapImage } from './GroundLandscapingTexture';

interface ProjectedPoint {
  x: number;
  y: number;
  z: number;
  dist: number;
  visible: boolean;
}

interface Canvas3DEngineOptions {
  container: HTMLDivElement;
  camera: THREE.PerspectiveCamera;
  targetCamPos: React.MutableRefObject<THREE.Vector3>;
  targetLookAt: React.MutableRefObject<THREE.Vector3>;
  isTransitioningCamera: React.MutableRefObject<boolean>;
  getSelectedPoi: () => POIItem | null;
  getHoveredPoi: () => POIItem | null;
  getTimeOfDay: () => TimeOfDayMode;
  getSelectedCategory: () => CategoryType;
  getActiveRoute: () => { fromId: string; toId: string } | null;
  onSelectPoi: (poi: POIItem | null) => void;
  onHoverPoi: (poi: POIItem | null) => void;
}

/**
 * 3D-Projected Architectural & Living Environment Engine with Perspective-Mapped Reference Terrain
 * Renders the sculpted 3D Bay South peninsula with the clean reference map image perspective-projected
 * onto the 3D terrain surface, topped with 3D conservatories, 18 Supertrees, OCBC Skyway, 3D trees, and Marina Bay boats.
 */
export function startCanvas3DFallbackEngine(opts: Canvas3DEngineOptions): () => void {
  const {
    container,
    camera,
    targetCamPos,
    targetLookAt,
    isTransitioningCamera,
    getSelectedPoi,
    getHoveredPoi,
    getTimeOfDay,
    getSelectedCategory,
    getActiveRoute,
    onSelectPoi,
    onHoverPoi,
  } = opts;

  let refMapImg: HTMLImageElement | null = null;
  loadReferenceMapImage((img) => {
    refMapImg = img;
  });

  const canvas = document.createElement('canvas');
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.display = 'block';
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let width = container.clientWidth || window.innerWidth;
  let height = container.clientHeight || window.innerHeight;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  const updateSize = () => {
    width = container.clientWidth || window.innerWidth;
    height = container.clientHeight || window.innerHeight;
    canvas.width = Math.max(1, Math.floor(width * dpr));
    canvas.height = Math.max(1, Math.floor(height * dpr));
    camera.aspect = width / Math.max(1, height);
    camera.updateProjectionMatrix();
  };
  updateSize();

  const currentLookAt = new THREE.Vector3(0, 0, -5);
  camera.position.set(0, 115, 125);
  camera.lookAt(currentLookAt);

  const _v3 = new THREE.Vector3();
  const project3D = (wx: number, wy: number, wz: number): ProjectedPoint => {
    _v3.set(wx, wy, wz);
    const dist = _v3.distanceTo(camera.position);
    _v3.project(camera);
    const visible = _v3.z >= -1 && _v3.z <= 1.05;
    return {
      x: (_v3.x * 0.5 + 0.5) * width,
      y: (-_v3.y * 0.5 + 0.5) * height,
      z: _v3.z,
      dist,
      visible,
    };
  };

  // Precompute road curves (empty when road cars are disabled)
  const roadCurves = ROAD_NETWORK.map((pts) =>
    new THREE.CatmullRomCurve3(
      pts.map(([nx, ny]) => {
        const p = normToWorld(nx, ny);
        return new THREE.Vector3(p.x, 1.9, p.z);
      })
    )
  );

  // Supertree specs aligned 1:1 with reference map
  const supertreeSpecs: { x: number; z: number; h: number; cr: number; isObs?: boolean; poiId: string }[] = [];
  const stCenter = normToWorld(0.456, 0.362);
  supertreeSpecs.push({ x: stCenter.x, z: stCenter.z, h: 22, cr: 7.8, isObs: true, poiId: 'supertree-observatory' });
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
    supertreeSpecs.push({ x: stCenter.x + ox, z: stCenter.z + oz, h, cr, poiId: 'supertree-grove' });
  });
  const goldenPos = normToWorld(0.629, 0.376);
  supertreeSpecs.push({ x: goldenPos.x, z: goldenPos.z, h: 14, cr: 5.2, poiId: 'golden-garden' });
  supertreeSpecs.push({ x: goldenPos.x + 4.2, z: goldenPos.z + 2.8, h: 11.5, cr: 4.4, poiId: 'golden-garden' });
  supertreeSpecs.push({ x: goldenPos.x - 3.5, z: goldenPos.z + 3.0, h: 12.5, cr: 4.8, poiId: 'golden-garden' });

  const silverPos = normToWorld(0.458, 0.160);
  supertreeSpecs.push({ x: silverPos.x, z: silverPos.z, h: 13.5, cr: 5.0, poiId: 'silver-garden' });
  supertreeSpecs.push({ x: silverPos.x - 4.2, z: silverPos.z + 2.2, h: 11, cr: 4.2, poiId: 'silver-garden' });
  supertreeSpecs.push({ x: silverPos.x + 3.6, z: silverPos.z + 2.6, h: 12, cr: 4.5, poiId: 'silver-garden' });

  // Botanical tree clusters
  const treeCoords: [number, number, number][] = [
    [0.14, 0.58, 1.1], [0.17, 0.63, 1.0], [0.12, 0.65, 1.2], [0.20, 0.72, 1.1],
    [0.31, 0.18, 1.0], [0.34, 0.12, 1.2], [0.28, 0.24, 0.95],
    [0.41, 0.26, 1.0], [0.36, 0.36, 1.1], [0.42, 0.49, 1.15], [0.48, 0.52, 1.05],
    [0.56, 0.44, 1.2], [0.52, 0.48, 1.0],
    [0.72, 0.32, 1.1], [0.80, 0.37, 1.2], [0.83, 0.42, 1.0], [0.76, 0.52, 1.15],
    [0.88, 0.55, 1.1], [0.91, 0.48, 1.0],
  ];

  // Track interactive hit regions (both 3D buildings and beacons)
  const hitTargets: { x: number; y: number; r: number; poi: POIItem }[] = [];

  // Pointer orbit / pan / zoom controls
  let isDragging = false;
  let isPanning = false;
  let dragMoved = false;
  let lastPointerX = 0;
  let lastPointerY = 0;

  const handleMouseDown = (e: MouseEvent) => {
    isDragging = true;
    isPanning = e.button === 2 || e.shiftKey;
    dragMoved = false;
    lastPointerX = e.clientX;
    lastPointerY = e.clientY;
    isTransitioningCamera.current = false;
  };

  const handleMouseMove = (e: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    if (isDragging) {
      const dx = e.clientX - lastPointerX;
      const dy = e.clientY - lastPointerY;
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) dragMoved = true;
      lastPointerX = e.clientX;
      lastPointerY = e.clientY;

      const offset = camera.position.clone().sub(currentLookAt);
      const spherical = new THREE.Spherical().setFromVector3(offset);

      if (isPanning) {
        const panSpeed = spherical.radius * 0.0018;
        const right = new THREE.Vector3().setFromMatrixColumn(camera.matrix, 0);
        const forward = new THREE.Vector3().setFromMatrixColumn(camera.matrix, 0).cross(new THREE.Vector3(0, 1, 0)).normalize();
        currentLookAt.addScaledVector(right, -dx * panSpeed);
        currentLookAt.addScaledVector(forward, dy * panSpeed);
        currentLookAt.x = THREE.MathUtils.clamp(currentLookAt.x, -100, 100);
        currentLookAt.z = THREE.MathUtils.clamp(currentLookAt.z, -70, 70);
        camera.position.copy(currentLookAt).add(offset);
      } else {
        spherical.theta -= dx * 0.006;
        spherical.phi = THREE.MathUtils.clamp(spherical.phi - dy * 0.005, 0.25, Math.PI / 2.25);
        offset.setFromSpherical(spherical);
        camera.position.copy(currentLookAt).add(offset);
      }
      camera.lookAt(currentLookAt);
      targetCamPos.current.copy(camera.position);
      targetLookAt.current.copy(currentLookAt);
      return;
    }

    let hovered: POIItem | null = null;
    let bestDist = Infinity;
    for (const b of hitTargets) {
      const d = Math.hypot(mx - b.x, my - b.y);
      if (d <= b.r && d < bestDist) {
        bestDist = d;
        hovered = b.poi;
      }
    }
    onHoverPoi(hovered);
    canvas.style.cursor = hovered ? 'pointer' : isDragging ? 'grabbing' : 'grab';
  };

  const handleMouseUp = (e: MouseEvent) => {
    if (!dragMoved && e.button === 0) {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      let clicked: POIItem | null = null;
      let bestDist = Infinity;
      for (const b of hitTargets) {
        const d = Math.hypot(mx - b.x, my - b.y);
        if (d <= b.r && d < bestDist) {
          bestDist = d;
          clicked = b.poi;
        }
      }
      if (clicked) {
        onSelectPoi(clicked);
      }
    }
    isDragging = false;
  };

  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();
    isTransitioningCamera.current = false;
    const offset = camera.position.clone().sub(currentLookAt);
    const len = offset.length();
    const nextLen = THREE.MathUtils.clamp(len * (1 + e.deltaY * 0.001), 35, 250);
    offset.setLength(nextLen);
    camera.position.copy(currentLookAt).add(offset);
    camera.lookAt(currentLookAt);
    targetCamPos.current.copy(camera.position);
  };

  const handleContextMenu = (e: MouseEvent) => e.preventDefault();

  const handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 1) {
      isDragging = true;
      dragMoved = false;
      lastPointerX = e.touches[0].clientX;
      lastPointerY = e.touches[0].clientY;
      isTransitioningCamera.current = false;
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length === 1 && isDragging) {
      const dx = e.touches[0].clientX - lastPointerX;
      const dy = e.touches[0].clientY - lastPointerY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) dragMoved = true;
      lastPointerX = e.touches[0].clientX;
      lastPointerY = e.touches[0].clientY;

      const offset = camera.position.clone().sub(currentLookAt);
      const spherical = new THREE.Spherical().setFromVector3(offset);
      spherical.theta -= dx * 0.006;
      spherical.phi = THREE.MathUtils.clamp(spherical.phi - dy * 0.005, 0.25, Math.PI / 2.25);
      offset.setFromSpherical(spherical);
      camera.position.copy(currentLookAt).add(offset);
      camera.lookAt(currentLookAt);
    }
  };

  const handleTouchEnd = () => {
    isDragging = false;
  };

  canvas.addEventListener('mousedown', handleMouseDown);
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseup', handleMouseUp);
  canvas.addEventListener('wheel', handleWheel, { passive: false });
  canvas.addEventListener('contextmenu', handleContextMenu);
  canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
  canvas.addEventListener('touchmove', handleTouchMove, { passive: true });
  canvas.addEventListener('touchend', handleTouchEnd);
  window.addEventListener('resize', updateSize);

  let frameId = 0;
  let lastTime = performance.now();

  const renderLoop = (now: number) => {
    const delta = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;
    const elapsed = now / 1000;

    // 1. Update Camera Interpolation
    if (isTransitioningCamera.current) {
      camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCamPos.current.x, 4.0, delta);
      camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamPos.current.y, 4.0, delta);
      camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCamPos.current.z, 4.0, delta);

      currentLookAt.x = THREE.MathUtils.damp(currentLookAt.x, targetLookAt.current.x, 4.5, delta);
      currentLookAt.y = THREE.MathUtils.damp(currentLookAt.y, targetLookAt.current.y, 4.5, delta);
      currentLookAt.z = THREE.MathUtils.damp(currentLookAt.z, targetLookAt.current.z, 4.5, delta);

      if (
        camera.position.distanceTo(targetCamPos.current) < 0.8 &&
        currentLookAt.distanceTo(targetLookAt.current) < 0.5
      ) {
        isTransitioningCamera.current = false;
      }
    }
    camera.lookAt(currentLookAt);
    camera.updateMatrixWorld();

    if (ctx) {
      ctx.save();
      ctx.scale(dpr, dpr);

      const timeOfDay = getTimeOfDay();
      const selectedPoi = getSelectedPoi();
      const hoveredPoi = getHoveredPoi();
      const selectedCat = getSelectedCategory();
      const activeRoute = getActiveRoute();

      hitTargets.length = 0;

      // 2. Royal Purple Exhibition Surround (Matches Reference Map Background)
      const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
      if (timeOfDay === 'day') {
        bgGrad.addColorStop(0, '#2e0f40');
        bgGrad.addColorStop(1, '#3d1452');
      } else if (timeOfDay === 'sunset') {
        bgGrad.addColorStop(0, '#1f1024');
        bgGrad.addColorStop(0.6, '#3b1510');
        bgGrad.addColorStop(1, '#270c36');
      } else {
        bgGrad.addColorStop(0, '#070312');
        bgGrad.addColorStop(1, '#120724');
      }
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // 3. Draw North-East Marina Reservoir Water Basin (Strictly on the NE Waterfront Promenade side)
      const neWaterOutline: [number, number][] = [
        [0.320, 0.030],
        [0.320, -0.300],
        [1.300, -0.300],
        [1.300, 0.560],
        [0.995, 0.535],
        [0.835, 0.365],
        [0.695, 0.235],
        [0.585, 0.165],
        [0.465, 0.105],
      ];
      const seaPts = neWaterOutline.map(([nx, ny]) => {
        const p = normToWorld(nx, ny);
        return project3D(p.x, 0.1, p.z);
      });
      ctx.fillStyle = timeOfDay === 'night' ? '#082f49' : timeOfDay === 'sunset' ? '#0369a1' : '#0095d9';
      ctx.beginPath();
      seaPts.forEach((pt, i) => {
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.closePath();
      ctx.fill();

      // White shoreline wave foam along the Waterfront Promenade
      ctx.strokeStyle = 'rgba(224, 242, 254, 0.78)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      [
        [0.330, 0.032],
        [0.465, 0.100],
        [0.585, 0.160],
        [0.695, 0.230],
        [0.835, 0.360],
        [0.995, 0.525],
      ].forEach(([nx, ny], idx) => {
        const p = normToWorld(nx, ny);
        const proj = project3D(p.x, 0.3, p.z);
        if (idx === 0) ctx.moveTo(proj.x, proj.y);
        else ctx.lineTo(proj.x, proj.y);
      });
      ctx.stroke();

      // Animated Water Wave Ripples in North-East Marina Bay
      ctx.strokeStyle = timeOfDay === 'night' ? 'rgba(56, 189, 248, 0.16)' : 'rgba(224, 242, 254, 0.28)';
      ctx.lineWidth = 1.4;
      for (let wz = -65; wz <= -10; wz += 12) {
        const shift = ((elapsed * 4 + wz) % 20) - 10;
        const pStart = project3D(-10 + shift, 0.2, wz);
        const pEnd = project3D(110 + shift, 0.2, wz);
        if (pStart.visible && pEnd.visible) {
          ctx.beginPath();
          ctx.moveTo(pStart.x, pStart.y);
          ctx.lineTo(pEnd.x, pEnd.y);
          ctx.stroke();
        }
      }

      // 4. Draw 3D Sculpted Extruded Bay South Peninsula Landmass
      const landTopPts = MAIN_LANDMASS_OUTLINE.map(([nx, ny]) => {
        const p = normToWorld(nx, ny);
        return project3D(p.x, 1.8, p.z);
      });
      const landBasePts = MAIN_LANDMASS_OUTLINE.map(([nx, ny]) => {
        const p = normToWorld(nx, ny);
        return project3D(p.x, 0, p.z);
      });

      // Extruded Stone Seawall Cliff Edges
      ctx.fillStyle = '#94a3b8';
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1;
      for (let i = 0; i < landTopPts.length; i++) {
        const next = (i + 1) % landTopPts.length;
        ctx.beginPath();
        ctx.moveTo(landTopPts[i].x, landTopPts[i].y);
        ctx.lineTo(landTopPts[next].x, landTopPts[next].y);
        ctx.lineTo(landBasePts[next].x, landBasePts[next].y);
        ctx.lineTo(landBasePts[i].x, landBasePts[i].y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }

      const getScaleAt = (wx: number, wy: number, wz: number): number => {
        const p1 = project3D(wx, wy, wz);
        const p2 = project3D(wx, wy + 1, wz);
        return Math.max(0.5, Math.hypot(p2.x - p1.x, p2.y - p1.y));
      };

      // Lush 3D Botanical Landmass Top Surface + 3D Perspective-Mapped Reference Terrain Image
      const landGrad = ctx.createLinearGradient(0, height * 0.2, 0, height * 0.85);
      if (timeOfDay === 'day') {
        landGrad.addColorStop(0, '#5bb84d');
        landGrad.addColorStop(0.5, '#46a748');
        landGrad.addColorStop(1, '#25793e');
      } else if (timeOfDay === 'sunset') {
        landGrad.addColorStop(0, '#16a34a');
        landGrad.addColorStop(1, '#14532d');
      } else {
        landGrad.addColorStop(0, '#064e3b');
        landGrad.addColorStop(1, '#022c22');
      }
      ctx.fillStyle = landGrad;
      ctx.beginPath();
      landTopPts.forEach((pt, i) => {
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.closePath();
      ctx.fill();

      // Project the reference map image (/assets/aistudio/Gemini_Generated_Image_4zsrqx4zsrqx4zsr_aa5db8df.png)
      // directly onto the 3D terrain top surface (y = 1.80) using a 3D perspective mesh grid clipped to landTopPts
      if (refMapImg && refMapImg.complete && refMapImg.naturalWidth > 0) {
        const imgW = refMapImg.naturalWidth;
        const imgH = refMapImg.naturalHeight;
        const cols = 16;
        const rows = 12;

        const gridProj: ProjectedPoint[][] = [];
        for (let r = 0; r <= rows; r++) {
          const rowPts: ProjectedPoint[] = [];
          const ny = r / rows;
          for (let c = 0; c <= cols; c++) {
            const nx = c / cols;
            const w = normToWorld(nx, ny);
            rowPts.push(project3D(w.x, 1.8, w.z));
          }
          gridProj.push(rowPts);
        }

        ctx.save();
        ctx.beginPath();
        landTopPts.forEach((pt, i) => {
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.closePath();
        ctx.clip();

        const du = imgW / cols;
        const dv = imgH / rows;

        const drawTexTri = (
          x0: number, y0: number,
          x1: number, y1: number,
          x2: number, y2: number,
          ta: number, tb: number, tc: number, td: number, te: number, tf: number
        ) => {
          const cx = (x0 + x1 + x2) / 3;
          const cy = (y0 + y1 + y2) / 3;
          const expand = (px: number, py: number): [number, number] => {
            const dx = px - cx;
            const dy = py - cy;
            const len = Math.hypot(dx, dy) || 1;
            return [px + (dx / len) * 0.75, py + (dy / len) * 0.75];
          };
          const [ex0, ey0] = expand(x0, y0);
          const [ex1, ey1] = expand(x1, y1);
          const [ex2, ey2] = expand(x2, y2);

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(ex0, ey0);
          ctx.lineTo(ex1, ey1);
          ctx.lineTo(ex2, ey2);
          ctx.closePath();
          ctx.clip();
          ctx.transform(ta, tb, tc, td, te, tf);
          ctx.drawImage(refMapImg!, 0, 0);
          ctx.restore();
        };

        for (let r = 0; r < rows; r++) {
          const v0 = r * dv;
          const v1 = (r + 1) * dv;
          for (let c = 0; c < cols; c++) {
            const p00 = gridProj[r][c];
            const p10 = gridProj[r][c + 1];
            const p01 = gridProj[r + 1][c];
            const p11 = gridProj[r + 1][c + 1];
            if (!p00.visible || !p10.visible || !p01.visible || !p11.visible) continue;

            const u0 = c * du;
            const u1 = (c + 1) * du;

            // Upper-left triangle: (u0,v0)->p00, (u1,v0)->p10, (u0,v1)->p01
            const ta1 = (p10.x - p00.x) / du;
            const tb1 = (p10.y - p00.y) / du;
            const tc1 = (p01.x - p00.x) / dv;
            const td1 = (p01.y - p00.y) / dv;
            const te1 = p00.x - ta1 * u0 - tc1 * v0;
            const tf1 = p00.y - tb1 * u0 - td1 * v0;
            drawTexTri(p00.x, p00.y, p10.x, p10.y, p01.x, p01.y, ta1, tb1, tc1, td1, te1, tf1);

            // Lower-right triangle: (u1,v1)->p11, (u0,v1)->p01, (u1,v0)->p10
            const ta2 = (p11.x - p01.x) / du;
            const tb2 = (p11.y - p01.y) / du;
            const tc2 = (p11.x - p10.x) / dv;
            const td2 = (p11.y - p10.y) / dv;
            const te2 = p01.x - ta2 * u0 - tc2 * v1;
            const tf2 = p01.y - tb2 * u0 - td2 * v1;
            drawTexTri(p11.x, p11.y, p01.x, p01.y, p10.x, p10.y, ta2, tb2, tc2, td2, te2, tf2);
          }
        }

        // Subtle time-of-day atmospheric lighting tint on the terrain
        if (timeOfDay === 'sunset') {
          ctx.fillStyle = 'rgba(251, 146, 60, 0.18)';
          ctx.fillRect(0, 0, width, height);
        } else if (timeOfDay === 'night') {
          ctx.fillStyle = 'rgba(15, 23, 42, 0.42)';
          ctx.fillRect(0, 0, width, height);
        }

        ctx.restore();
      } else {
        // Fallback procedural lakes & pathways only while the reference image is still loading
        const drawGroundPoly = (outline: [number, number][], fillStyle: string, strokeStyle?: string) => {
          ctx.fillStyle = fillStyle;
          ctx.beginPath();
          outline.forEach(([nx, ny], i) => {
            const p = normToWorld(nx, ny);
            const proj = project3D(p.x, 1.85, p.z);
            if (i === 0) ctx.moveTo(proj.x, proj.y);
            else ctx.lineTo(proj.x, proj.y);
          });
          ctx.closePath();
          ctx.fill();
          if (strokeStyle) {
            ctx.strokeStyle = strokeStyle;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        };
        drawGroundPoly(DRAGONFLY_LAKE_OUTLINE, '#0095d9', '#bae6fd');
        drawGroundPoly(KINGFISHER_LAKE_OUTLINE, '#0284c7', '#bae6fd');
        PATHWAY_NETWORK.forEach((pts) => {
          ctx.strokeStyle = '#f8fafc';
          ctx.lineWidth = 3.0;
          ctx.beginPath();
          pts.forEach(([nx, ny], idx) => {
            const p = normToWorld(nx, ny);
            const proj = project3D(p.x, 1.95, p.z);
            if (idx === 0) ctx.moveTo(proj.x, proj.y);
            else ctx.lineTo(proj.x, proj.y);
          });
          ctx.stroke();
        });
      }

      // Crisp 3D Peninsula Seawall Rim Highlight
      ctx.beginPath();
      landTopPts.forEach((pt, i) => {
        if (i === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      });
      ctx.closePath();
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // 7. Draw Active Walking Route Path
      if (activeRoute) {
        const fromPoi = GARDENS_POIS.find((p) => p.id === activeRoute.fromId);
        const toPoi = GARDENS_POIS.find((p) => p.id === activeRoute.toId);
        if (fromPoi && toPoi) {
          const sWorld = normToWorld(fromPoi.mapCoord.x, fromPoi.mapCoord.y);
          const eWorld = normToWorld(toPoi.mapCoord.x, toPoi.mapCoord.y);
          const sProj = project3D(sWorld.x, 2.2, sWorld.z);
          const eProj = project3D(eWorld.x, 2.2, eWorld.z);
          const midProj = project3D((sWorld.x + eWorld.x) / 2, 2.8, (sWorld.z + eWorld.z) / 2 - 4);

          ctx.save();
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 4.5;
          ctx.setLineDash([10, 6]);
          ctx.lineDashOffset = -elapsed * 28;
          ctx.beginPath();
          ctx.moveTo(sProj.x, sProj.y);
          ctx.quadraticCurveTo(midProj.x, midProj.y, eProj.x, eProj.y);
          ctx.stroke();
          ctx.restore();
        }
      }

      // 8. Collect Depth-Sorted 3D Renderables (Landmarks, Live Vehicles, Boats, Trees, Beacons)
      const renderables: { dist: number; draw: () => void }[] = [];

      // A. Live Sightseeing Cruise Boats & Yachts Gliding on North-East Marina Bay Waters
      for (let b = 0; b < 4; b++) {
        const t = (elapsed * (0.028 + (b % 2) * 0.008) + b * 0.25) % 1;
        const nx = 0.44 + t * 0.52;
        const ny = -0.02 + t * 0.38 + (b % 2) * 0.04;
        const bWorld = normToWorld(nx, ny);
        const bx = bWorld.x;
        const bz = bWorld.z;
        const bp = project3D(bx, 0.4, bz);
        if (bp.visible) {
          renderables.push({
            dist: bp.dist,
            draw: () => {
              const u = getScaleAt(bx, 0.4, bz);
              ctx.save();
              ctx.translate(bp.x, bp.y);
              ctx.rotate(0.52);

              // V-Shaped White Foaming Wake Trail behind Stern
              ctx.strokeStyle = 'rgba(224, 242, 254, 0.65)';
              ctx.lineWidth = Math.max(1.2, u * 0.35);
              ctx.beginPath();
              ctx.moveTo(-u * 4.2, -u * 1.1);
              ctx.lineTo(-u * 1.2, 0);
              ctx.lineTo(-u * 4.2, u * 1.1);
              ctx.stroke();

              // Pointed Boat Hull (Stern to Sharp Bow)
              ctx.fillStyle = b % 2 === 1 ? '#b45309' : '#ffffff';
              ctx.strokeStyle = '#0f172a';
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(-u * 2.0, -u * 0.85);
              ctx.lineTo(u * 1.4, -u * 0.85);
              ctx.lineTo(u * 2.8, 0);
              ctx.lineTo(u * 1.4, u * 0.85);
              ctx.lineTo(-u * 2.0, u * 0.85);
              ctx.closePath();
              ctx.fill();
              ctx.stroke();

              // Passenger Cabin & Blue Panoramic Glass Window
              ctx.fillStyle = '#0284c7';
              ctx.fillRect(-u * 0.9, -u * 0.55, u * 1.9, u * 1.1);
              ctx.fillStyle = '#f8fafc';
              ctx.fillRect(-u * 0.7, -u * 0.42, u * 1.4, u * 0.84);

              ctx.restore();
            },
          });
        }
      }

      // B. Live Garden Shuttles & Cars Moving Along Roadways
      roadCurves.forEach((curve, rIdx) => {
        for (let v = 0; v < 3; v++) {
          const t = (elapsed * (0.03 + v * 0.01) + v / 3 + rIdx * 0.2) % 1;
          const pos = curve.getPointAt(t);
          const vp = project3D(pos.x, 2.3, pos.z);
          if (vp.visible) {
            renderables.push({
              dist: vp.dist,
              draw: () => {
                const u = getScaleAt(pos.x, 2.3, pos.z);
                ctx.fillStyle = v % 2 === 0 ? '#38bdf8' : '#fbbf24';
                ctx.strokeStyle = '#ffffff';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.roundRect(vp.x - u * 1.2, vp.y - u * 0.8, Math.max(4, u * 2.4), Math.max(2.5, u * 1.4), 2);
                ctx.fill();
                ctx.stroke();
              },
            });
          }
        }
      });

      // C. Dense Botanical Trees (190+ multi-species trees across all garden zones)
      DENSE_TREE_SPECIFICATIONS.forEach((spec) => {
        const w = normToWorld(spec.nx, spec.ny);
        const base = project3D(w.x, 1.85, w.z);
        if (!base.visible) return;
        renderables.push({
          dist: base.dist,
          draw: () => {
            const top = project3D(w.x, 1.85 + 2.8 * spec.scale, w.z);
            const r = Math.max(3, getScaleAt(w.x, 3, w.z) * 1.45 * spec.scale);
            ctx.strokeStyle = '#451a03';
            ctx.lineWidth = Math.max(1.2, r * 0.32);
            ctx.beginPath();
            ctx.moveTo(base.x, base.y);
            ctx.lineTo(top.x, top.y);
            ctx.stroke();

            ctx.fillStyle = spec.type === 'flowering' ? '#10b981' : spec.type === 'palm' ? '#22c55e' : '#15803d';
            ctx.beginPath();
            ctx.arc(top.x, top.y, r, 0, Math.PI * 2);
            ctx.fill();
          },
        });
      });

      // C2. Understorey Beehive (#12), SG50 Lattice (#33), Planet (#19) & Satay by the Bay (#g)
      const usW = normToWorld(0.541, 0.527);
      const usP = project3D(usW.x, 2, usW.z);
      if (usP.visible) {
        renderables.push({
          dist: usP.dist,
          draw: () => {
            const u = getScaleAt(usW.x, 2, usW.z);
            ctx.fillStyle = '#a16207';
            ctx.beginPath();
            ctx.moveTo(usP.x - u * 4.2, usP.y);
            ctx.lineTo(usP.x, usP.y - u * 5.2);
            ctx.lineTo(usP.x + u * 4.2, usP.y);
            ctx.closePath();
            ctx.fill();
          },
        });
      }

      const sg50W = normToWorld(0.191, 0.435);
      const sg50P = project3D(sg50W.x, 2, sg50W.z);
      if (sg50P.visible) {
        renderables.push({
          dist: sg50P.dist,
          draw: () => {
            const u = getScaleAt(sg50W.x, 2, sg50W.z);
            ctx.fillStyle = '#f1f5f9';
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.ellipse(sg50P.x, sg50P.y, u * 5.5, u * 3.5, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
          },
        });
      }

      const plW = normToWorld(0.277, 0.495);
      const plP = project3D(plW.x, 2, plW.z);
      if (plP.visible) {
        renderables.push({
          dist: plP.dist,
          draw: () => {
            const u = getScaleAt(plW.x, 2, plW.z);
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.ellipse(plP.x, plP.y - u * 1.2, u * 3.4, u * 1.5, -0.25, 0, Math.PI * 2);
            ctx.fill();
          },
        });
      }

      // D. Flower Dome (#3)
      const fdWorld = normToWorld(0.556, 0.199);
      const fdProj = project3D(fdWorld.x, 6, fdWorld.z);
      if (fdProj.visible) {
        renderables.push({
          dist: fdProj.dist,
          draw: () => {
            const base = project3D(fdWorld.x, 1.85, fdWorld.z);
            const unit = getScaleAt(fdWorld.x, 2, fdWorld.z);
            const rx = unit * 16.5;
            const ry = unit * 10.5;
            const isSel = selectedPoi?.id === 'flower-dome' || hoveredPoi?.id === 'flower-dome';

            ctx.save();
            ctx.translate(base.x, base.y);
            const domeGrad = ctx.createRadialGradient(-rx * 0.25, -ry * 0.4, rx * 0.1, 0, -ry * 0.2, rx);
            if (timeOfDay === 'night') {
              domeGrad.addColorStop(0, 'rgba(56, 189, 248, 0.88)');
              domeGrad.addColorStop(1, 'rgba(30, 58, 138, 0.7)');
            } else {
              domeGrad.addColorStop(0, 'rgba(224, 242, 254, 0.9)');
              domeGrad.addColorStop(1, 'rgba(56, 189, 248, 0.6)');
            }
            ctx.fillStyle = domeGrad;
            ctx.beginPath();
            ctx.ellipse(0, 0, rx, ry * 0.55, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(0, 0, rx, ry, 0, Math.PI, 0);
            ctx.fill();

            ctx.strokeStyle = isSel ? '#fbbf24' : 'rgba(255, 255, 255, 0.72)';
            ctx.lineWidth = Math.max(1.2, unit * (isSel ? 0.45 : 0.25));
            for (let i = -3; i <= 3; i++) {
              ctx.beginPath();
              ctx.ellipse(0, 0, Math.abs(i / 3.5) * rx, ry, 0, Math.PI, 0);
              ctx.stroke();
            }
            ctx.restore();

            const fdPoi = GARDENS_POIS.find((p) => p.id === 'flower-dome');
            if (fdPoi) hitTargets.push({ x: base.x, y: base.y - ry * 0.4, r: rx * 0.8, poi: fdPoi });
          },
        });
      }

      // E. Cloud Forest (#4) with Live Animated Indoor Waterfall
      const cfWorld = normToWorld(0.663, 0.263);
      const cfProj = project3D(cfWorld.x, 8, cfWorld.z);
      if (cfProj.visible) {
        renderables.push({
          dist: cfProj.dist,
          draw: () => {
            const base = project3D(cfWorld.x, 1.85, cfWorld.z);
            const unit = getScaleAt(cfWorld.x, 2, cfWorld.z);
            const rx = unit * 14.5;
            const ry = unit * 16.5;
            const isSel = selectedPoi?.id === 'cloud-forest' || hoveredPoi?.id === 'cloud-forest';

            ctx.save();
            ctx.translate(base.x, base.y);

            // Interior Cloud Mountain
            ctx.fillStyle = '#15803d';
            ctx.beginPath();
            ctx.moveTo(-rx * 0.55, 0);
            ctx.lineTo(0, -ry * 0.82);
            ctx.lineTo(rx * 0.55, 0);
            ctx.closePath();
            ctx.fill();

            // Animated Cascading Waterfall Stream
            ctx.strokeStyle = '#e0f2fe';
            ctx.lineWidth = Math.max(2, unit * 0.7);
            ctx.setLineDash([4, 3]);
            ctx.lineDashOffset = -elapsed * 18;
            ctx.beginPath();
            ctx.moveTo(rx * 0.05, -ry * 0.75);
            ctx.lineTo(rx * 0.22, 0);
            ctx.stroke();
            ctx.setLineDash([]);

            // Outer Glass Shell
            const domeGrad = ctx.createRadialGradient(-rx * 0.2, -ry * 0.5, rx * 0.1, 0, -ry * 0.3, ry);
            if (timeOfDay === 'night') {
              domeGrad.addColorStop(0, 'rgba(34, 211, 238, 0.78)');
              domeGrad.addColorStop(1, 'rgba(15, 118, 110, 0.58)');
            } else {
              domeGrad.addColorStop(0, 'rgba(224, 242, 254, 0.82)');
              domeGrad.addColorStop(1, 'rgba(14, 165, 233, 0.52)');
            }
            ctx.fillStyle = domeGrad;
            ctx.beginPath();
            ctx.ellipse(0, 0, rx, ry, 0, Math.PI, 0);
            ctx.ellipse(0, 0, rx, rx * 0.45, 0, 0, Math.PI);
            ctx.fill();

            ctx.strokeStyle = isSel ? '#fbbf24' : 'rgba(255, 255, 255, 0.72)';
            ctx.lineWidth = Math.max(1.2, unit * (isSel ? 0.45 : 0.25));
            for (let i = -3; i <= 3; i++) {
              ctx.beginPath();
              ctx.ellipse(0, 0, Math.abs(i / 3.5) * rx, ry, 0, Math.PI, 0);
              ctx.stroke();
            }
            ctx.restore();

            const cfPoi = GARDENS_POIS.find((p) => p.id === 'cloud-forest');
            if (cfPoi) hitTargets.push({ x: base.x, y: base.y - ry * 0.45, r: rx * 0.8, poi: cfPoi });
          },
        });
      }

      // F. OCBC Skyway Aerial Walkway
      const swMid = project3D(stCenter.x, 11.8, stCenter.z);
      if (swMid.visible) {
        renderables.push({
          dist: swMid.dist + 1,
          draw: () => {
            const p0 = project3D(stCenter.x - 8, 11.8, stCenter.z - 3);
            const p1 = project3D(stCenter.x - 4, 12.3, stCenter.z + 8);
            const p2 = project3D(stCenter.x + 6, 12.8, stCenter.z + 9);
            const p3 = project3D(stCenter.x + 11, 12.3, stCenter.z + 4);
            const unit = getScaleAt(stCenter.x, 12, stCenter.z);

            ctx.save();
            ctx.strokeStyle = '#f97316';
            ctx.lineWidth = Math.max(3, unit * 1.15);
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(p0.x, p0.y);
            ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
            ctx.stroke();
            ctx.strokeStyle = '#fde047';
            ctx.lineWidth = Math.max(1, unit * 0.35);
            ctx.stroke();
            ctx.restore();
          },
        });
      }

      // G. 3D Supertrees
      supertreeSpecs.forEach((st) => {
        const base = project3D(st.x, 1.85, st.z);
        if (!base.visible) return;
        renderables.push({
          dist: base.dist,
          draw: () => {
            const top = project3D(st.x, 1.85 + st.h, st.z);
            const waist = project3D(st.x, 1.85 + st.h * 0.72, st.z);
            const unit = getScaleAt(st.x, 1.85 + st.h * 0.5, st.z);
            const trunkW = Math.max(2, unit * 1.15);
            const crownW = Math.max(5, unit * st.cr);

            ctx.strokeStyle = '#582645';
            ctx.lineWidth = trunkW * 1.6;
            ctx.beginPath();
            ctx.moveTo(base.x, base.y);
            ctx.lineTo(waist.x, waist.y);
            ctx.stroke();

            ctx.strokeStyle = '#16a34a';
            ctx.lineWidth = trunkW * 2.1;
            for (let b = 1; b <= 4; b++) {
              const by = 1.85 + (st.h * 0.65) * (b / 5);
              const bp = project3D(st.x, by, st.z);
              ctx.beginPath();
              ctx.moveTo(bp.x - trunkW, bp.y);
              ctx.lineTo(bp.x + trunkW, bp.y);
              ctx.stroke();
            }

            ctx.fillStyle = timeOfDay === 'night' ? 'rgba(168, 85, 247, 0.88)' : 'rgba(147, 51, 234, 0.8)';
            ctx.beginPath();
            ctx.moveTo(waist.x - trunkW * 0.8, waist.y);
            ctx.lineTo(top.x - crownW, top.y);
            ctx.lineTo(top.x + crownW, top.y);
            ctx.lineTo(waist.x + trunkW * 0.8, waist.y);
            ctx.closePath();
            ctx.fill();

            ctx.strokeStyle = timeOfDay === 'night' ? '#f43f5e' : '#fbbf24';
            ctx.lineWidth = Math.max(1.5, unit * 0.35);
            ctx.fillStyle = st.isObs ? '#f8fafc' : 'rgba(168, 85, 247, 0.45)';
            ctx.beginPath();
            ctx.ellipse(top.x, top.y, crownW, crownW * 0.38, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
          },
        });
      });

      // H. Children's Garden (#23) Animated Splash Fountain Jets
      const chWorld = normToWorld(0.763, 0.406);
      const chBase = project3D(chWorld.x, 1.9, chWorld.z);
      if (chBase.visible) {
        renderables.push({
          dist: chBase.dist,
          draw: () => {
            const u = getScaleAt(chWorld.x, 2, chWorld.z);
            ctx.fillStyle = 'rgba(56, 189, 248, 0.55)';
            ctx.beginPath();
            ctx.ellipse(chBase.x, chBase.y, u * 5.5, u * 3.0, 0, 0, Math.PI * 2);
            ctx.fill();
            // Pulsing water jets
            ctx.strokeStyle = '#e0f2fe';
            ctx.lineWidth = Math.max(1.5, u * 0.4);
            for (let j = 0; j < 5; j++) {
              const jh = (1.5 + Math.abs(Math.sin(elapsed * 3.5 + j))) * u * 1.8;
              const jx = chBase.x + (j - 2) * u * 1.6;
              ctx.beginPath();
              ctx.moveTo(jx, chBase.y);
              ctx.lineTo(jx, chBase.y - jh);
              ctx.stroke();
            }
          },
        });
      }

      // I. 3D Food & Dining Pavilions + Interactive Beacons for All POIs
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

      GARDENS_POIS.forEach((poi) => {
        const matchesCat = selectedCat === 'all' || poi.category === selectedCat;
        const pWorld = normToWorld(poi.mapCoord.x, poi.mapCoord.y);
        const isSel = selectedPoi?.id === poi.id;
        const isHov = hoveredPoi?.id === poi.id;
        const isDining = poi.category === 'dining';

        // Render 3D Outdoor Café Pavilion & Parasol Umbrellas on the terrain for Dining POIs
        const baseProj = project3D(pWorld.x, 1.9, pWorld.z);
        if (isDining && baseProj.visible) {
          renderables.push({
            dist: baseProj.dist - 2,
            draw: () => {
              const u = getScaleAt(pWorld.x, 2, pWorld.z);
              ctx.save();
              ctx.globalAlpha = matchesCat || isSel || isHov ? 1.0 : 0.35;

              // Warm timber outdoor dining terrace deck
              ctx.fillStyle = '#d97706';
              ctx.strokeStyle = '#fef3c7';
              ctx.lineWidth = 1.2;
              ctx.beginPath();
              ctx.ellipse(baseProj.x, baseProj.y, u * 2.5, u * 1.4, 0, 0, Math.PI * 2);
              ctx.fill();
              ctx.stroke();

              // 3D Terracotta Food Pavilion Roof + 2 Café Parasol Umbrellas
              const roofProj = project3D(pWorld.x, 3.3, pWorld.z);
              ctx.fillStyle = '#ea580c';
              ctx.strokeStyle = '#ffffff';
              ctx.lineWidth = 1.2;
              ctx.beginPath();
              ctx.ellipse(roofProj.x, roofProj.y, u * 1.9, u * 1.05, 0, 0, Math.PI * 2);
              ctx.fill();
              ctx.stroke();

              // Parasol umbrella stripes
              [-1.6, 1.6].forEach((ox) => {
                const umbProj = project3D(pWorld.x + ox, 2.9, pWorld.z + 0.6);
                ctx.fillStyle = ox < 0 ? '#ef4444' : '#f59e0b';
                ctx.strokeStyle = '#fffbeb';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.ellipse(umbProj.x, umbProj.y, u * 1.05, u * 0.62, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
              });

              ctx.restore();
            },
          });
        }

        const baseFloat = isDining ? 6.2 : 3.8;
        const floatY = 1.85 + (isSel ? baseFloat + 1.6 : isHov ? baseFloat + 0.9 : baseFloat) + Math.sin(elapsed * 2.5 + posHash(poi.id)) * 0.28;
        const topProj = project3D(pWorld.x, floatY, pWorld.z);
        if (!topProj.visible) return;

        renderables.push({
          dist: topProj.dist - (isSel ? 28 : isHov ? 18 : isDining ? 11 : 0),
          draw: () => {
            const alpha = matchesCat || isSel || isHov ? 1.0 : 0.22;
            ctx.save();
            ctx.globalAlpha = alpha;

            const colorHex =
              poi.category === 'conservatory' ? '#06b6d4' :
              poi.category === 'supertree' ? '#a855f7' :
              poi.category === 'dining' ? '#ea580c' :
              poi.category === 'facility' ? '#3b82f6' : '#10b981';

            ctx.strokeStyle = isDining ? 'rgba(254, 215, 170, 0.88)' : 'rgba(255,255,255,0.65)';
            ctx.lineWidth = isSel ? 2.5 : isDining ? 2.0 : 1.5;
            ctx.beginPath();
            ctx.moveTo(baseProj.x, baseProj.y);
            ctx.lineTo(topProj.x, topProj.y);
            ctx.stroke();

            const radius = isSel ? 15 : isHov ? 13.5 : isDining ? 11.5 : 10.5;
            ctx.fillStyle = isSel ? '#ec4899' : colorHex;
            ctx.strokeStyle = isDining ? '#fef3c7' : '#ffffff';
            ctx.lineWidth = isSel ? 3 : 2.2;
            ctx.beginPath();
            ctx.arc(topProj.x, topProj.y, radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#ffffff';
            ctx.font = `bold ${isSel ? 11 : isDining ? 10 : 9.5}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            const badgeText = isDining ? (poi.numberKey || 'F').toUpperCase() : (poi.numberKey || '★');
            ctx.fillText(badgeText, topProj.x, topProj.y + 0.5);

            // Show visible food label pill for Dining POIs when visible, or full label on select/hover
            if (isSel || isHov) {
              const label = isDining ? `🍴 ${poi.name}` : poi.name;
              ctx.font = 'bold 11px sans-serif';
              const tw = ctx.measureText(label).width + 16;
              ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
              ctx.strokeStyle = colorHex;
              ctx.lineWidth = 1.6;
              const bx = topProj.x - tw / 2;
              const by = topProj.y - radius - 25;
              ctx.beginPath();
              ctx.roundRect(bx, by, tw, 20, 6);
              ctx.fill();
              ctx.stroke();

              ctx.fillStyle = '#ffffff';
              ctx.fillText(label, topProj.x, by + 10.5);
            } else if (isDining && matchesCat) {
              const shortLabel = shortDiningLabels[poi.id] || `🍴 ${poi.name}`;
              ctx.font = 'bold 9.5px sans-serif';
              const tw = ctx.measureText(shortLabel).width + 12;
              ctx.fillStyle = 'rgba(124, 45, 18, 0.92)';
              ctx.strokeStyle = '#fdba74';
              ctx.lineWidth = 1.2;
              const bx = topProj.x - tw / 2;
              const by = topProj.y - radius - 19;
              ctx.beginPath();
              ctx.roundRect(bx, by, tw, 16, 5);
              ctx.fill();
              ctx.stroke();

              ctx.fillStyle = '#fff7ed';
              ctx.fillText(shortLabel, topProj.x, by + 8.5);
            }

            ctx.restore();

            if (matchesCat || isSel) {
              hitTargets.push({
                x: topProj.x,
                y: topProj.y - (isDining ? 8 : 0),
                r: Math.max(18, radius + (isDining ? 12 : 6)),
                poi,
              });
            }
          },
        });
      });

      renderables.sort((a, b) => b.dist - a.dist);
      renderables.forEach((item) => item.draw());

      ctx.restore();
    }

    frameId = requestAnimationFrame(renderLoop);
  };

  frameId = requestAnimationFrame(renderLoop);

  return () => {
    cancelAnimationFrame(frameId);
    canvas.removeEventListener('mousedown', handleMouseDown);
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
    canvas.removeEventListener('wheel', handleWheel);
    canvas.removeEventListener('contextmenu', handleContextMenu);
    canvas.removeEventListener('touchstart', handleTouchStart);
    canvas.removeEventListener('touchmove', handleTouchMove);
    canvas.removeEventListener('touchend', handleTouchEnd);
    window.removeEventListener('resize', updateSize);
    if (container.contains(canvas)) {
      container.removeChild(canvas);
    }
  };
}

function posHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return (Math.abs(hash) % 100) / 10;
}
