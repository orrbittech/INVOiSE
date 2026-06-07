export type PdfExportProgress = { percent: number; label: string };

export type PdfExportControls = {
  start: () => void;
  reportProgress: (progress: PdfExportProgress) => void;
  finish: () => void;
  cancel: () => void;
};

const COLOR_PROPS = [
  "color",
  "backgroundColor",
  "borderTopColor",
  "borderRightColor",
  "borderBottomColor",
  "borderLeftColor",
] as const;

function hasUnsupportedColorSyntax(value: string): boolean {
  const lower = value.toLowerCase();
  return (
    lower.includes("oklch") ||
    lower.includes("lab(") ||
    lower.includes("lch(") ||
    lower.includes("color-mix")
  );
}

function isTransparentColor(value: string): boolean {
  return (
    !value ||
    value === "transparent" ||
    value === "rgba(0, 0, 0, 0)" ||
    value === "rgba(0,0,0,0)"
  );
}

function forceCloneVisible(root: HTMLElement): void {
  let el: HTMLElement | null = root;
  while (el) {
    el.style.opacity = "1";
    el.style.visibility = "visible";
    el = el.parentElement;
  }
}

function forcePdfSafeColors(root: HTMLElement, doc: Document): void {
  const view = doc.defaultView;
  if (!view) return;

  const styleEl = doc.createElement("style");
  styleEl.textContent = `
    *, *::before, *::after {
      animation: none !important;
      transition: none !important;
    }
  `;
  doc.head.appendChild(styleEl);

  const elements: HTMLElement[] = [root];
  root.querySelectorAll<HTMLElement>("*").forEach((el) => elements.push(el));

  for (const el of elements) {
    const computed = view.getComputedStyle(el);
    for (const prop of COLOR_PROPS) {
      const value = computed[prop];
      if (isTransparentColor(value) || hasUnsupportedColorSyntax(value)) {
        continue;
      }
      if (/^rgb/.test(value) || /^#[0-9a-f]{3,8}$/i.test(value)) {
        el.style.setProperty(prop, value);
      }
    }
  }
}

type CaptureStyleSnapshot = {
  position: string;
  left: string;
  top: string;
  opacity: string;
  zIndex: string;
  pointerEvents: string;
};

function prepareElementForCapture(element: HTMLElement): CaptureStyleSnapshot {
  const snapshot: CaptureStyleSnapshot = {
    position: element.style.position,
    left: element.style.left,
    top: element.style.top,
    opacity: element.style.opacity,
    zIndex: element.style.zIndex,
    pointerEvents: element.style.pointerEvents,
  };

  element.style.position = "fixed";
  element.style.left = "0";
  element.style.top = "0";
  element.style.opacity = "1";
  element.style.zIndex = "-1";
  element.style.pointerEvents = "none";

  return snapshot;
}

function restoreElementAfterCapture(
  element: HTMLElement,
  snapshot: CaptureStyleSnapshot,
): void {
  element.style.position = snapshot.position;
  element.style.left = snapshot.left;
  element.style.top = snapshot.top;
  element.style.opacity = snapshot.opacity;
  element.style.zIndex = snapshot.zIndex;
  element.style.pointerEvents = snapshot.pointerEvents;
}

function sampleCanvasPixels(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
): { total: number; visible: number; minLuminance: number; maxLuminance: number } {
  const grid = 8;
  let total = 0;
  let visible = 0;
  let minLuminance = 255;
  let maxLuminance = 0;

  for (let row = 0; row < grid; row++) {
    for (let col = 0; col < grid; col++) {
      const x = Math.floor(
        (col / (grid - 1 || 1)) * Math.max(0, canvas.width - 1),
      );
      const y = Math.floor(
        (row / (grid - 1 || 1)) * Math.max(0, canvas.height - 1),
      );
      const data = ctx.getImageData(x, y, 1, 1).data;
      const r = data[0];
      const g = data[1];
      const b = data[2];
      const a = data[3];
      total++;

      if (a <= 10) continue;

      visible++;
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
      minLuminance = Math.min(minLuminance, luminance);
      maxLuminance = Math.max(maxLuminance, luminance);
    }
  }

  return { total, visible, minLuminance, maxLuminance };
}

function isCaptureBlank(canvas: HTMLCanvasElement): boolean {
  if (canvas.width <= 0 || canvas.height <= 0) return true;

  const ctx = canvas.getContext("2d");
  if (!ctx) return true;

  const { total, visible, minLuminance, maxLuminance } = sampleCanvasPixels(
    ctx,
    canvas,
  );
  if (visible < total * 0.05) return true;

  const luminanceRange = maxLuminance - minLuminance;
  if (luminanceRange < 20) return true;

  return false;
}

function reportProgress(
  onProgress: ((p: PdfExportProgress) => void) | undefined,
  percent: number,
  label: string,
): void {
  onProgress?.({ percent, label });
}

export async function exportInvoicePdf(
  elementId: string,
  filename: string,
  pageColor: string,
  onProgress?: (p: PdfExportProgress) => void,
): Promise<void> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error("Invoice preview element not found");
  }

  reportProgress(onProgress, 10, "Preparing…");
  await document.fonts.ready;

  const html2canvas = (await import("html2canvas")).default;
  const { jsPDF } = await import("jspdf");

  const styleSnapshot = prepareElementForCapture(element);

  let canvas: HTMLCanvasElement;
  try {
    reportProgress(onProgress, 40, "Rendering invoice…");
    canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: pageColor,
      logging: false,
      imageTimeout: 15000,
      onclone: (doc) => {
        const clonedRoot = doc.getElementById(elementId);
        if (!clonedRoot) return;
        forceCloneVisible(clonedRoot);
        forcePdfSafeColors(clonedRoot, doc);
      },
    });
  } finally {
    restoreElementAfterCapture(element, styleSnapshot);
  }

  if (isCaptureBlank(canvas)) {
    throw new Error(
      "PDF capture failed — try refreshing the page or simplifying colors.",
    );
  }

  reportProgress(onProgress, 75, "Building PDF…");
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 10;
  const contentWidth = pageWidth - margin * 2;

  const imgWidth = contentWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  let heightLeft = imgHeight;
  let position = margin;

  pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
  heightLeft -= pageHeight - margin * 2;

  while (heightLeft > 0) {
    position = margin - (imgHeight - heightLeft);
    pdf.addPage();
    pdf.addImage(imgData, "PNG", margin, position, imgWidth, imgHeight);
    heightLeft -= pageHeight - margin * 2;
  }

  reportProgress(onProgress, 100, "Downloading…");
  pdf.save(filename);
}
