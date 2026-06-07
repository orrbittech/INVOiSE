/** Hex-only Tailwind classes for PDF/html2canvas capture (avoids lab/oklch). */
export const pdf = {
  text: "text-[#171717]",
  textMuted: "text-[#525252]",
  textLight: "text-[#737373]",
  bg: "bg-[#ffffff]",
  bgMuted: "bg-[#f5f5f5]",
  bgPlaceholder: "bg-[#d4d4d4]",
  border: "border-[#e5e5e5]",
  borderStrong: "border-[#171717]",
  divider: "bg-[#d4d4d4]",
  tableHeader: "bg-[#000000] text-[#ffffff]",
} as const;
