/** Export PNG côté client : SVG → Blob → canvas → fichier. Aucune dépendance. */

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      resolve(image);
    };
    image.onerror = () => {
      reject(new Error("Impossible de convertir le terrain en image."));
    };
    image.src = url;
  });
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Le navigateur a refusé de générer le PNG.'));
    }, 'image/png');
  });
}

function triggerDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  // Laisse au navigateur le temps de démarrer le téléchargement.
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}

export async function exportSvgToPng(
  svg: SVGSVGElement,
  filename: string,
  scale = 2,
): Promise<void> {
  const { width, height } = svg.viewBox.baseVal;
  if (width === 0 || height === 0) throw new Error('Terrain introuvable dans le DOM.');

  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('width', String(width));
  clone.setAttribute('height', String(height));

  const markup = new XMLSerializer().serializeToString(clone);
  const svgUrl = URL.createObjectURL(new Blob([markup], { type: 'image/svg+xml;charset=utf-8' }));

  try {
    const image = await loadImage(svgUrl);
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);

    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas 2D indisponible dans ce navigateur.');

    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    triggerDownload(await canvasToBlob(canvas), filename);
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}
