export function createRadialMaskImage(size = 640): Promise<HTMLImageElement> {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');
  if (!context) return Promise.reject(new Error('2D canvas is unavailable'));
  const gradient = context.createRadialGradient(
    size / 2,
    size / 2,
    size * 0.08,
    size / 2,
    size / 2,
    size * 0.58,
  );
  gradient.addColorStop(0, '#fff');
  gradient.addColorStop(0.7, '#777');
  gradient.addColorStop(1, '#000');
  context.fillStyle = gradient;
  context.fillRect(0, 0, size, size);

  const image = new Image();
  return new Promise((resolve, reject) => {
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Mask image failed to load'));
    image.src = canvas.toDataURL();
  });
}
