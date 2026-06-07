"use client";

type PdfExportOverlayProps = {
  open: boolean;
  percent: number;
  label: string;
};

export function PdfExportOverlay({
  open,
  percent,
  label,
}: PdfExportOverlayProps) {
  if (!open) return null;

  const clampedPercent = Math.min(100, Math.max(0, percent));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-busy="true"
      aria-labelledby="pdf-export-title"
      aria-describedby="pdf-export-status"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#f5f5f5]/70 backdrop-blur-md"
    >
      <div className="mx-4 w-full max-w-sm rounded-lg border border-[#e5e5e5] bg-[#ffffff] p-6 shadow-lg">
        <h2
          id="pdf-export-title"
          className="text-lg font-semibold text-[#171717]"
        >
          Generating PDF
        </h2>
        <p
          id="pdf-export-status"
          className="mt-2 text-sm text-[#525252]"
          aria-live="polite"
        >
          {label}
        </p>
        <div
          className="mt-4 h-2 overflow-hidden rounded-full bg-[#e5e5e5]"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={clampedPercent}
          aria-label="PDF export progress"
        >
          <div
            className="h-full rounded-full bg-[#059669] transition-[width] duration-300 ease-out"
            style={{ width: `${clampedPercent}%` }}
          />
        </div>
        <p className="mt-2 text-right text-xs text-[#737373]">
          {clampedPercent}%
        </p>
      </div>
    </div>
  );
}
