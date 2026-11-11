import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { POIItem, TimeOfDayMode, CategoryType } from '../../types/map';
import { GARDENS_POIS } from '../../data/gardensData';
import { createGardens3DWorld, normToWorld } from './Gardens3DWorld';
import { createRouteVisual, RouteVisual } from './PathRenderer';
import { startCanvas3DFallbackEngine } from './Canvas3DFallbackEngine';

interface ThreeMapCanvasProps {
  selectedPoi: POIItem | null;
  hoveredPoi: POIItem | null;
  onSelectPoi: (poi: POIItem | null) => void;
  onHoverPoi: (poi: POIItem | null) => void;
  timeOfDay: TimeOfDayMode;
  selectedCategory?: CategoryType;
  activeRoute: { fromId: string; toId: string } | null;
  cameraPreset: 'overview' | 'supertree' | 'conservatory' | 'meadow' | 'children' | 'heritage' | null;
  onCameraPresetConsumed?: () => void;
}

export const ThreeMapCanvas: React.FC<ThreeMapCanvasProps> = ({
  selectedPoi,
  hoveredPoi,
  onSelectPoi,
  onHoverPoi,
  timeOfDay,
  selectedCategory = 'all',
  activeRoute,
  cameraPreset,
  onCameraPresetConsumed,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // Latest state refs for animation loops
  const selectedPoiRef = useRef<POIItem | null>(selectedPoi);
  selectedPoiRef.current = selectedPoi;
  const hoveredPoiRef = useRef<POIItem | null>(hoveredPoi);
  hoveredPoiRef.current = hoveredPoi;
  const timeOfDayRef = useRef<TimeOfDayMode>(timeOfDay);
  timeOfDayRef.current = timeOfDay;
  const selectedCategoryRef = useRef<CategoryType>(selectedCategory);
  selectedCategoryRef.current = selectedCategory;
  const activeRouteRef = useRef<{ fromId: string; toId: string } | null>(activeRoute);
  activeRouteRef.current = activeRoute;

  // Lighting refs for smooth time-of-day transitions
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);
  const nightLightsGroupRef = useRef<THREE.Group | null>(null);

  // Camera animation target states
  const targetCamPos = useRef(new THREE.Vector3(0, 115, 125));
  const targetLookAt = useRef(new THREE.Vector3(0, 2, -5));
  const isTransitioningCamera = useRef(false);

  // Active route visual ref
  const routeVisualRef = useRef<RouteVisual | null>(null);

  // Interaction raycasting
  const raycaster = useRef(new THREE.Raycaster());
  const mouse = useRef(new THREE.Vector2());

  // Detect Software GL
  const isSoftwareGl = useRef<boolean>(false);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // Setup shared 3D PerspectiveCamera
    const camera = new THREE.PerspectiveCamera(40, width / Math.max(1, height), 1, 1000);
    camera.position.set(0, 115, 125);
    cameraRef.current = camera;

    // 1. Probe WebGL availability safely BEFORE invoking THREE.WebGLRenderer
    let webglAvailable = false;
    try {
      const probeCanvas = document.createElement('canvas');
      const gl = (
        probeCanvas.getContext('webgl2') ||
        probeCanvas.getContext('webgl') ||
        probeCanvas.getContext('experimental-webgl')
      ) as WebGLRenderingContext | null;

      if (gl) {
        webglAvailable = true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        isSoftwareGl.current = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      }
    } catch {
      webglAvailable = false;
    }

    let renderer: THREE.WebGLRenderer | null = null;
    if (webglAvailable) {
      try {
        renderer = new THREE.WebGLRenderer({
          antialias: !isSoftwareGl.current,
          alpha: false,
        });
      } catch {
        renderer = null;
      }
    }

    // Fallback to Hardware-Independent 3D-Projected Canvas2D Engine when WebGL is disabled
    if (!renderer) {
      return startCanvas3DFallbackEngine({
        container,
        camera,
        targetCamPos,
        targetLookAt,
        isTransitioningCamera,
        getSelectedPoi: () => selectedPoiRef.current,
        getHoveredPoi: () => hoveredPoiRef.current,
        getTimeOfDay: () => timeOfDayRef.current,
        getSelectedCategory: () => selectedCategoryRef.current,
        getActiveRoute: () => activeRouteRef.current,
        onSelectPoi,
        onHoverPoi,
      });
    }

    // 2. Setup WebGL Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x3d1452);
    scene.fog = new THREE.FogExp2(0x3d1452, 0.0012);

    // 3. Configure WebGLRenderer
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl.current ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl.current;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // 4. Setup OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl.current;
    controls.dampingFactor = 0.08;
    controls.minDistance = 32;
    controls.maxDistance = 260;
    controls.maxPolarAngle = Math.PI / 2.15;
    controls.target.set(0, 2, -5);
    controlsRef.current = controls;

    controls.addEventListener('start', () => {
      isTransitioningCamera.current = false;
    });

    // 5. Setup Studio Environment Reflection
    try {
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environmentIntensity = 0.28;
      pmremGenerator.dispose();
    } catch {
      // ignore
    }

    // 6. Setup Studio 3-Point & Warm/Cool Lighting
    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0x14532d, 1.25);
    hemiLight.position.set(0, 110, 0);
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    const dirLight = new THREE.DirectionalLight(0xfffbeb, 2.3);
    dirLight.position.set(65, 125, 75);
    dirLight.castShadow = !isSoftwareGl.current;
    if (dirLight.castShadow) {
      dirLight.shadow.mapSize.width = 2048;
      dirLight.shadow.mapSize.height = 2048;
      dirLight.shadow.camera.near = 10;
      dirLight.shadow.camera.far = 320;
      const d = 120;
      dirLight.shadow.camera.left = -d;
      dirLight.shadow.camera.right = d;
      dirLight.shadow.camera.top = d;
      dirLight.shadow.camera.bottom = -d;
      dirLight.shadow.bias = -0.0004;
      dirLight.shadow.normalBias = 0.02;
    }
    scene.add(dirLight);
    dirLightRef.current = dirLight;

    // Night lighting group (Garden Rhapsody neon illumination)
    const nightLights = new THREE.Group();
    nightLights.visible = false;
    const supertreePointLight = new THREE.PointLight(0xf43f5e, 6.0, 110, 1.2);
    supertreePointLight.position.set(-10, 26, -20);
    nightLights.add(supertreePointLight);

    const domePointLight = new THREE.PointLight(0x06b6d4, 5.5, 115, 1.2);
    domePointLight.position.set(24, 24, -38);
    nightLights.add(domePointLight);
    scene.add(nightLights);
    nightLightsGroupRef.current = nightLights;

    // 7. Build Pure 3D Sculpted Gardens by the Bay World (Zero flat map image!)
    const liveWorld = createGardens3DWorld(isSoftwareGl.current);
    scene.add(liveWorld.group);

    // 8. Animation Loop with Software-GL guard
    let frameId = 0;
    let lastTime = performance.now();
    const startTime = lastTime;

    function afterDraw(cb: () => void) {
      if (!renderer) return;
      const glContext = renderer.getContext() as WebGL2RenderingContext;
      if (!glContext || typeof glContext.fenceSync !== 'function') {
        frameId = window.setTimeout(cb, 80);
        return;
      }
      const sync = glContext.fenceSync(glContext.SYNC_GPU_COMMANDS_COMPLETE, 0);
      glContext.flush();
      const poll = () => {
        const state = sync && glContext.getSyncParameter(sync, glContext.SYNC_STATUS);
        if (state === glContext.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          glContext.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      if (!renderer) return;
      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      const elapsed = (now - startTime) / 1000;

      // Update live world animations (water ripples, indoor waterfall, fountains, shuttles, boats, beacons)
      liveWorld.update(
        elapsed,
        delta,
        selectedPoiRef.current?.id || null,
        hoveredPoiRef.current?.id || null,
        selectedCategoryRef.current,
        timeOfDayRef.current
      );

      if (routeVisualRef.current) {
        routeVisualRef.current.update(elapsed);
      }

      // Smooth camera interpolation if transitioning
      if (isTransitioningCamera.current) {
        camera.position.x = THREE.MathUtils.damp(camera.position.x, targetCamPos.current.x, 4.0, delta);
        camera.position.y = THREE.MathUtils.damp(camera.position.y, targetCamPos.current.y, 4.0, delta);
        camera.position.z = THREE.MathUtils.damp(camera.position.z, targetCamPos.current.z, 4.0, delta);

        controls.target.x = THREE.MathUtils.damp(controls.target.x, targetLookAt.current.x, 4.5, delta);
        controls.target.y = THREE.MathUtils.damp(controls.target.y, targetLookAt.current.y, 4.5, delta);
        controls.target.z = THREE.MathUtils.damp(controls.target.z, targetLookAt.current.z, 4.5, delta);

        if (
          camera.position.distanceTo(targetCamPos.current) < 0.8 &&
          controls.target.distanceTo(targetLookAt.current) < 0.5
        ) {
          isTransitioningCamera.current = false;
        }
      }

      controls.update();
      renderer.render(scene, camera);

      if (isSoftwareGl.current) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    // 9. Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newW = container.clientWidth || window.innerWidth;
      const newH = container.clientHeight || window.innerHeight;
      camera.aspect = newW / Math.max(1, newH);
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    // 10. Pointer Event Handlers for Raycasting Selection (both 3D Buildings & Beacons)
    const handlePointerMove = (e: MouseEvent) => {
      if (!renderer) return;
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.current.setFromCamera(mouse.current, camera);
      const hits = raycaster.current.intersectObjects(liveWorld.group.children, true);

      let foundPoi: POIItem | null = null;
      for (const hit of hits) {
        let cur: THREE.Object3D | null = hit.object;
        while (cur && cur !== scene) {
          if (cur.visible && cur.userData && cur.userData.poi) {
            foundPoi = cur.userData.poi;
            break;
          }
          cur = cur.parent;
        }
        if (foundPoi) break;
      }

      onHoverPoi(foundPoi);
      renderer.domElement.style.cursor = foundPoi ? 'pointer' : 'default';
    };

    const handleClick = () => {
      raycaster.current.setFromCamera(mouse.current, camera);
      const hits = raycaster.current.intersectObjects(liveWorld.group.children, true);

      let foundPoi: POIItem | null = null;
      for (const hit of hits) {
        let cur: THREE.Object3D | null = hit.object;
        while (cur && cur !== scene) {
          if (cur.visible && cur.userData && cur.userData.poi) {
            foundPoi = cur.userData.poi;
            break;
          }
          cur = cur.parent;
        }
        if (foundPoi) break;
      }

      if (foundPoi) {
        onSelectPoi(foundPoi);
      }
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousemove', handlePointerMove);
    dom.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('mousemove', handlePointerMove);
      dom.removeEventListener('click', handleClick);
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      controls.dispose();
      liveWorld.dispose();
      renderer?.dispose();
      if (container.contains(dom)) {
        container.removeChild(dom);
      }
    };
  }, []);

  // Update lighting on timeOfDay change
  useEffect(() => {
    if (!sceneRef.current || !hemiLightRef.current || !dirLightRef.current) return;

    const hemi = hemiLightRef.current;
    const dir = dirLightRef.current;
    const scene = sceneRef.current;
    const nightGroup = nightLightsGroupRef.current;

    if (timeOfDay === 'day') {
      scene.background = new THREE.Color(0x3d1452);
      scene.fog = new THREE.FogExp2(0x3d1452, 0.0012);
      scene.environmentIntensity = 0.28;
      hemi.color.set(0xe0f2fe);
      hemi.groundColor.set(0x14532d);
      hemi.intensity = 1.25;
      dir.color.set(0xfffbeb);
      dir.intensity = 2.3;
      dir.position.set(65, 125, 75);
      if (nightGroup) nightGroup.visible = false;
    } else if (timeOfDay === 'sunset') {
      scene.background = new THREE.Color(0x270c36);
      scene.fog = new THREE.FogExp2(0x270c36, 0.0016);
      scene.environmentIntensity = 0.16;
      hemi.color.set(0xfdba74);
      hemi.groundColor.set(0x431407);
      hemi.intensity = 1.15;
      dir.color.set(0xf97316);
      dir.intensity = 2.5;
      dir.position.set(85, 50, 45);
      if (nightGroup) nightGroup.visible = true;
    } else if (timeOfDay === 'night') {
      scene.background = new THREE.Color(0x0d041a);
      scene.fog = new THREE.FogExp2(0x0d041a, 0.0020);
      scene.environmentIntensity = 0.05;
      hemi.color.set(0x312e81);
      hemi.groundColor.set(0x020617);
      hemi.intensity = 0.4;
      dir.color.set(0x818cf8);
      dir.intensity = 0.65;
      dir.position.set(30, 80, 50);
      if (nightGroup) nightGroup.visible = true;
    }
  }, [timeOfDay]);

  // Update Route Visual line when activeRoute changes
  useEffect(() => {
    if (activeRoute) {
      const fromPoi = GARDENS_POIS.find((p) => p.id === activeRoute.fromId);
      const toPoi = GARDENS_POIS.find((p) => p.id === activeRoute.toId);
      if (fromPoi && toPoi) {
        const startPos = normToWorld(fromPoi.mapCoord.x, fromPoi.mapCoord.y);
        const endPos = normToWorld(toPoi.mapCoord.x, toPoi.mapCoord.y);

        if (sceneRef.current) {
          if (routeVisualRef.current) {
            sceneRef.current.remove(routeVisualRef.current.group);
            routeVisualRef.current.dispose();
            routeVisualRef.current = null;
          }
          const routeVis = createRouteVisual(startPos, endPos);
          sceneRef.current.add(routeVis.group);
          routeVisualRef.current = routeVis;
        }

        const midX = (startPos.x + endPos.x) / 2;
        const midZ = (startPos.z + endPos.z) / 2;
        const dist = startPos.distanceTo(endPos);

        targetLookAt.current.set(midX, 2, midZ);
        targetCamPos.current.set(midX, Math.max(70, dist * 1.2), midZ + Math.max(65, dist * 1.1));
        isTransitioningCamera.current = true;
      }
    } else if (sceneRef.current && routeVisualRef.current) {
      sceneRef.current.remove(routeVisualRef.current.group);
      routeVisualRef.current.dispose();
      routeVisualRef.current = null;
    }
  }, [activeRoute]);

  // Handle camera presets
  useEffect(() => {
    if (!cameraPreset) return;

    if (cameraPreset === 'overview') {
      targetLookAt.current.set(0, 2, -5);
      targetCamPos.current.set(0, 115, 125);
    } else if (cameraPreset === 'supertree') {
      const pos = normToWorld(0.454, 0.36);
      targetLookAt.current.set(pos.x, 8, pos.z);
      targetCamPos.current.set(pos.x, 40, pos.z + 48);
    } else if (cameraPreset === 'conservatory') {
      const pos = normToWorld(0.60, 0.24);
      targetLookAt.current.set(pos.x, 8, pos.z);
      targetCamPos.current.set(pos.x, 44, pos.z + 50);
    } else if (cameraPreset === 'meadow') {
      const pos = normToWorld(0.28, 0.54);
      targetLookAt.current.set(pos.x, 4, pos.z);
      targetCamPos.current.set(pos.x, 34, pos.z + 42);
    } else if (cameraPreset === 'children') {
      const pos = normToWorld(0.77, 0.39);
      targetLookAt.current.set(pos.x, 4, pos.z);
      targetCamPos.current.set(pos.x, 32, pos.z + 38);
    } else if (cameraPreset === 'heritage') {
      const pos = normToWorld(0.38, 0.32);
      targetLookAt.current.set(pos.x, 4, pos.z);
      targetCamPos.current.set(pos.x, 36, pos.z + 40);
    }

    isTransitioningCamera.current = true;
    onCameraPresetConsumed?.();
  }, [cameraPreset, onCameraPresetConsumed]);

  // Camera Fly-To when a POI is selected
  useEffect(() => {
    if (!selectedPoi) return;

    const targetPos = normToWorld(selectedPoi.mapCoord.x, selectedPoi.mapCoord.y);
    targetLookAt.current.set(targetPos.x, 5, targetPos.z);
    targetCamPos.current.set(targetPos.x, 34, targetPos.z + 38);
    isTransitioningCamera.current = true;
  }, [selectedPoi]);

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-slate-950">
      {/* 3D Canvas mount container */}
      <div ref={mountRef} className="w-full h-full" />

      {/* Subtle Hover Tooltip Pill at Top-Center */}
      {hoveredPoi && !selectedPoi && (
        <div className="pointer-events-none absolute top-20 left-1/2 -translate-x-1/2 z-20 bg-slate-900/95 border border-purple-500/40 text-white px-3.5 py-1.5 rounded-xl shadow-xl flex items-center gap-2">
          {hoveredPoi.numberKey && (
            <span className="w-5 h-5 rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center">
              {hoveredPoi.numberKey}
            </span>
          )}
          <span className="text-xs font-bold">{hoveredPoi.name}</span>
          <span className="text-[10px] text-slate-400">({hoveredPoi.categoryLabel})</span>
        </div>
      )}
    </div>
  );
};
