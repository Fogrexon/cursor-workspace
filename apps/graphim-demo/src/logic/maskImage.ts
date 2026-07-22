/**
 * Build a synthetic second input image (radial mask) for multi-source demos.
 * Resolves when the HTMLImageElement has loaded.
 */
export function createRadialMaskImage(
  size = 512,
): Promise<HTMLImageElement> {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return Promise.reject(new Error('2d context unavailable'));

  const g = ctx.createRadialGradient(
    size / 2,
    size / 2,
    size * 0.05,
    size / 2,
    size / 2,
    size * 0.55,
  );
  g.addColorStop(0, '#ffffff');
  g.addColorStop(1, '#000000');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);

  const img = new Image();
  return new Promise((resolve, reject) => {
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('mask image failed to load'));
    img.src = canvas.toDataURL('image/png');
  });
}
