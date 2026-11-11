import * as THREE from 'three';

export interface RouteVisual {
  group: THREE.Group;
  update: (time: number) => void;
  dispose: () => void;
}

export function createRouteVisual(
  startPos: THREE.Vector3,
  endPos: THREE.Vector3,
  midPoints?: THREE.Vector3[]
): RouteVisual {
  const group = new THREE.Group();

  // Create curve with elevation above sculpted 3D landmass
  const allPoints: THREE.Vector3[] = [];
  allPoints.push(new THREE.Vector3(startPos.x, 2.25, startPos.z));

  if (midPoints && midPoints.length > 0) {
    midPoints.forEach((pt) => {
      allPoints.push(new THREE.Vector3(pt.x, 2.25, pt.z));
    });
  } else {
    // Generate gentle intermediate waypoint
    const midX = (startPos.x + endPos.x) / 2;
    const midZ = (startPos.z + endPos.z) / 2;
    allPoints.push(new THREE.Vector3(midX, 2.35, midZ));
  }

  allPoints.push(new THREE.Vector3(endPos.x, 2.25, endPos.z));

  const curve = new THREE.CatmullRomCurve3(allPoints);
  const samplePoints = curve.getPoints(48);

  // Dashed glowing tube or line
  const lineGeom = new THREE.BufferGeometry().setFromPoints(samplePoints);
  const lineMat = new THREE.LineDashedMaterial({
    color: 0x38bdf8, // Sky cyan glow
    linewidth: 3,
    scale: 1,
    dashSize: 2.5,
    gapSize: 1.5,
  });

  const line = new THREE.Line(lineGeom, lineMat);
  line.computeLineDistances();
  group.add(line);

  // Start beacon
  const startMarkerGeom = new THREE.CylinderGeometry(1.6, 1.6, 0.3, 16);
  const startMarkerMat = new THREE.MeshBasicMaterial({
    color: 0x10b981,
    transparent: true,
    opacity: 0.85,
  });
  const startMesh = new THREE.Mesh(startMarkerGeom, startMarkerMat);
  startMesh.position.set(startPos.x, 2.1, startPos.z);
  group.add(startMesh);

  // Destination beacon
  const endMarkerGeom = new THREE.CylinderGeometry(1.8, 1.8, 0.3, 16);
  const endMarkerMat = new THREE.MeshBasicMaterial({
    color: 0xef4444,
    transparent: true,
    opacity: 0.9,
  });
  const endMesh = new THREE.Mesh(endMarkerGeom, endMarkerMat);
  endMesh.position.set(endPos.x, 2.1, endPos.z);
  group.add(endMesh);

  const update = (time: number) => {
    // Animate line dashes to show direction of flow
    lineMat.dashSize = 2.0 + Math.sin(time * 4) * 0.5;
  };

  const dispose = () => {
    lineGeom.dispose();
    lineMat.dispose();
    startMarkerGeom.dispose();
    startMarkerMat.dispose();
    endMarkerGeom.dispose();
    endMarkerMat.dispose();
  };

  return { group, update, dispose };
}
