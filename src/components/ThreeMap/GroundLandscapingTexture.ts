/**
 * Reference Map Ground Texture Loader & Landmass Clipper
 * Loads the clean, text-free Gardens by the Bay reference map (/assets/aistudio/Gemini_Generated_Image_4zsrqx4zsrqx4zsr_aa5db8df.png)
 * and aligns it 1:1 onto the 3D extruded Bay South peninsula landmass.
 */

export const REFERENCE_MAP_URL = '/assets/aistudio/Gemini_Generated_Image_4zsrqx4zsrqx4zsr_aa5db8df.png';

// Sub-pixel measured outer boundary of the Bay South Peninsula + Marina Boulevard + Marina Gardens Drive
// Measured directly from Gemini_Generated_Image_4zsrqx4zsrqx4zsr_aa5db8df.png
export const exactLandmassPolygon: [number, number][] = [
  // 1. Northern Tip (Towards Marina Bay Sands Waterfront Promenade)
  [0.332, 0.034],
  // 2. West Seawall & Bayfront Coastline (North to West)
  [0.310, 0.110],
  [0.290, 0.182],
  [0.270, 0.236],
  [0.250, 0.278],
  [0.210, 0.342],
  [0.150, 0.414],
  [0.070, 0.498],
  [0.002, 0.562],
  // 3. Far West Edge across Bayfront Plaza & Marina Boulevard
  [0.002, 0.740],
  // 4. Marina Boulevard Outer Curb (West to South-West Corner)
  [0.040, 0.780],
  [0.100, 0.846],
  [0.160, 0.910],
  [0.215, 0.954], // SW Corner where Marina Boulevard meets Marina Gardens Drive
  // 5. Marina Gardens Drive Outer Curb (South-West to South-East)
  [0.250, 0.920],
  [0.310, 0.852],
  [0.370, 0.782],
  [0.430, 0.716],
  [0.490, 0.662],
  [0.550, 0.634],
  [0.610, 0.622],
  [0.670, 0.622],
  [0.730, 0.634],
  [0.790, 0.662],
  [0.850, 0.702],
  [0.910, 0.752],
  [0.970, 0.816],
  [0.998, 0.848], // Far SE Road Exit
  // 6. Far East Edge up to Waterfront Promenade
  [0.998, 0.538],
  // 7. North-East Waterfront Promenade Coastline (South-East to Northern Tip)
  [0.950, 0.468],
  [0.890, 0.420],
  [0.810, 0.332],
  [0.730, 0.268],
  [0.650, 0.214],
  [0.590, 0.178],
  [0.490, 0.122],
  [0.410, 0.076],
];

let cachedImage: HTMLImageElement | null = null;
const loadListeners: Array<(img: HTMLImageElement) => void> = [];
let isLoading = false;

export function loadReferenceMapImage(onLoaded: (img: HTMLImageElement) => void): void {
  if (cachedImage && cachedImage.complete && cachedImage.naturalWidth > 0) {
    onLoaded(cachedImage);
    return;
  }
  loadListeners.push(onLoaded);
  if (isLoading) return;
  isLoading = true;

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    cachedImage = img;
    isLoading = false;
    loadListeners.splice(0).forEach((cb) => cb(img));
  };
  img.onerror = () => {
    isLoading = false;
  };
  img.src = REFERENCE_MAP_URL;
}

/**
 * Draws the clean reference map image onto the texture canvas so that normalized
 * UVs (u = nx, v = 1 - ny) on the 3D extruded terrain align 1:1 with the map artwork.
 */
export function renderReferenceGroundOntoCanvas(
  canvas: HTMLCanvasElement,
  img?: HTMLImageElement | null
): void {
  const W = canvas.width;
  const H = canvas.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.clearRect(0, 0, W, H);

  if (img && img.complete && img.naturalWidth > 0) {
    // Draw the full image across (0, 0, W, H) so even beveled edges sample valid neighboring terrain pixels
    ctx.drawImage(img, 0, 0, W, H);
  } else {
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, '#5bb84d');
    grad.addColorStop(0.5, '#46a748');
    grad.addColorStop(1, '#25793e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
  }
}

export function createGroundLandscapingCanvas(onUpdate?: (canvas: HTMLCanvasElement) => void): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 1448;

  renderReferenceGroundOntoCanvas(canvas, cachedImage);

  loadReferenceMapImage((img) => {
    renderReferenceGroundOntoCanvas(canvas, img);
    if (onUpdate) onUpdate(canvas);
  });

  return canvas;
}
